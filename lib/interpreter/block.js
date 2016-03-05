'use strict';
const assert = require('assert');
const AbstractValue = require('./abstract-type');
const statement = require('./statement');
const ValueOrException = require('./value-or-exception');
const Binding = require('./scope').Binding;
const Scope = require('./scope').Scope;
const Func = require('./func');
const VAL = ValueOrException.makeValue;
const THROW = ValueOrException.makeException;

/**
 * Evaluate block statement.
 *
 * Returns a tuple [shouldContinue: boolean, result: Maybe<AbstractValue>], where
 *   shouldContinue:
 *     true = interpreter should continue evaluating current block
 *     false = interpreter should exit from the current block and treat all remaining
 *       statemens as a dead code.
 *   result:
 *     supervalue of all return statement values found in the statement
 *     null = no return statements found
 */
function evaluateBlockElement(state, node) {
  const stack = state.stack;
  const reporter = state.reporter;
  const source = state.source;

  if (node.type === 'FunctionDeclaration') {
    // Those are hoisted, ignore here
    return [true, null];
  }

  if (node.type === 'ExpressionStatement') {
    // Exit on exception, continue on value
    const res = statement.evaluateStatement(state, node.expression);
    if (res.isException()) {
      return [false, res];
    }

    return [true, null];
  }

  if (node.type === 'ReturnStatement') {
    // In both value or exception cases we should not continue
    return [false, statement.evaluateStatement(state, node.argument)];
  }

  // if (test) consequent else alternate
  if (node.type === 'IfStatement') {
    // First, evaluate the test. This can result in any value, not just true/false.
    const maybeTestResult = statement.evaluateStatement(state, node.test);
    if (maybeTestResult.isException()) {
      return [false, maybeTestResult];
    }

    const testResult = maybeTestResult.value();

    // Known value of a conditional results in a branch elimination and the dead
    // code in current flow trace. We don't have to follow both paths and evaluate
    // both blocks and can simply remove the conditional and proceed evaluating
    // linear program.
    if (testResult.hasValue()) {
      if (node.alternate) {
        return evaluateBlock(state, testResult.value() ? node.consequent : node.alternate);
      } else {
        return testResult.value() ? evaluateBlock(state, node.consequent) : [true, null];
      }
    }

    // Values we get from blocks are the return statement values. It's possible
    // block doesn't contain a return, in that case null will be returned.
    const maybeFirst = evaluateBlock(state, node.consequent);
    if (maybeFirst[1] && maybeFirst[1].isException()) {
      return [false, maybeFirst[1]];
    }

    const maybeSecond = node.alternate
      ? evaluateBlock(state, node.alternate)
      : [true, null];
    if (maybeSecond[1] && maybeSecond[1].isException()) {
      return [false, maybeSecond[1]];
    }

    const first = [maybeFirst[0], maybeFirst[1] ? maybeFirst[1].value() : null];
    const second = [maybeSecond[0], maybeSecond[1] ? maybeSecond[1].value() : null];

    // Merge all available return values from both branches
    const result = (first[1] && second[1])
      ? AbstractValue.superValue(first[1], second[1])
      : (first[1] || second[1]);

    // Continue is any of the branches is missing a return
    return [first[0] || second[0], result ? VAL(result) : null];
  }

  if (node.type === 'VariableDeclaration') {
    for (let j = 0; j < node.declarations.length; ++j) {
      const decl = node.declarations[j];

      // Initialize evaluated variable declaration statement. Let and const will
      // get their first value here, var value will replace undefined.
      if (decl.init) {
        const maybeInitValue = statement.evaluateStatement(state, decl.init);
        if (maybeInitValue.isException()) {
          return [false, maybeInitValue];
        }

        stack.current().getBinding(decl.id.name).set(maybeInitValue.value());
      } else {
        stack.current().getBinding(decl.id.name).set(AbstractValue.makeUndefined());
      }
    }

    return [true, null];
  }

  // Block statement in a block { ... { ... } ... }
  if (node.type === 'BlockStatement') {
    return evaluateBlock(state, node);
  }

  // throw ...
  if (node.type === 'ThrowStatement') {
    const maybeArgument = statement.evaluateStatement(state, node.argument);
    if (maybeArgument.isException()) {
      return [false, maybeArgument];
    }

    return [false, THROW(source, node.argument, maybeArgument.value())];
  }

  throw new Error('unknown block element ' + JSON.stringify(node));
}

/**
 * Evaluate block, which is an array of block elements (statements).
 */
function evaluateBlock(state, node) {
  const stack = state.stack;

  if (node.type === 'Program' || node.type === 'BlockStatement') {
    // It is important that we return null in case block doesn't contain a
    // return statement. This way we can distinguish "return;" or "return undefined;"
    // from no return statement in that block.
    let blockReturnValue = null;
    let shouldContinueOuter = true;
    let exitValue = null;

    const newScope = new Scope(stack.current());

    // Hoist all variable declarations in block.
    const blockBindings = hoistVariableDeclarations(newScope, state, node, false);

    if (node.type === 'Program') {
      // Hoist all variable declarations in global module scope.
      const moduleBindings = hoistVariableDeclarations(newScope, state, node, true);
      newScope.pushBindings2(moduleBindings, blockBindings);
    } else {
      newScope.pushBindings1(blockBindings);
    }

    stack.pushBlockScope(newScope);

    for (let i = 0; i < node.body.length; ++i) {
      const blockElementResult = evaluateBlockElement(state, node.body[i]);
      const shouldContinue = blockElementResult[0];
      const maybeResult = blockElementResult[1];

      if (maybeResult) {
        if (maybeResult.isException()) {
          assert(!shouldContinue, 'should not continue on exception');
          exitValue = maybeResult;
        } else {
          const result = maybeResult.value();
          // Received a result, this means statement contains at least one return
          // statement, merge this value with other previously returned values.
          if (blockReturnValue) {
            blockReturnValue = AbstractValue.superValue(blockReturnValue, result);
          } else {
            // This is the first return statement in this black, simply save its
            // value.
            blockReturnValue = result;
          }
        }
      }

      if (!shouldContinue) {
        // We got here because evaluated statement always returns a value (i.e. in every
        // branch), everything below it is a dead code. Also we're going to exit
        // from all outer blocks in this function as well.
        shouldContinueOuter = false;
        // TODO: handle dead code
        break;
      }
    }

    stack.popBlockScope();

    return [shouldContinueOuter, exitValue || (blockReturnValue ? VAL(blockReturnValue) : null)];
  }

  return [false, null];
}

function hoistVariableDeclarationsFromElement(scope, bindings, state, node, isFunctionScope) {
  const stack = state.stack;

  if (node.type === 'VariableDeclaration') {
    // Ignore vars in block scope, they're handled in function scope.
    if (node.kind === 'var' && !isFunctionScope) {
      return;
    }

    // Ignore let/const in function scope, they're handled in block scope.
    if (node.kind !== 'var' && isFunctionScope) {
      return;
    }

    for (let j = 0; j < node.declarations.length; ++j) {
      const decl = node.declarations[j];
      assert(decl.id.type === 'Identifier');

      // Var gets undefined value, let and const - no value until
      // evaluated. This implements temporal dead zone.
      bindings[decl.id.name] = new Binding(
        node.kind === 'var' ? AbstractValue.makeUndefined() : null,
        node.kind === 'const');
    }

    return;
  }

  if (node.type === 'FunctionDeclaration') {
    const fnName = node.id.name;
    bindings[fnName] = new Binding(AbstractValue.makeFunction(Func.makeFromNode(node, scope)), false);
    return;
  }

  // Skip recursive var handling logic in block scope.
  if (!isFunctionScope) {
    return;
  }

  // Recursively go into nested blocks to hoist all vars in this
  // function scope.
  if (node.type === 'IfStatement') {
    if (node.consequent) {
      hoistVariableDeclarationsImpl(scope, bindings, state, node.consequent, true);
    }

    if (node.alternate) {
      hoistVariableDeclarationsImpl(scope, bindings, state, node.alternate, true);
    }

    return;
  }

  if (node.type === 'BlockStatement') {
    hoistVariableDeclarationsImpl(scope, bindings, state, node, true);
    return;
  }

  // TODO: handle other types of blocks
}

/**
 * @param {Scope} scope Parent closure scope to use for function declarations
 * @param {Object} bindings Object to store hoisted bindings to
 *
 */
function hoistVariableDeclarationsImpl(scope, bindings, state, node, isFunctionScope) {
  var stack = state.stack;

  if (node.type !== 'Program' && node.type !== 'BlockStatement') {
    throw new Error('not a block');
  }

  for (let i = 0; i < node.body.length; ++i) {
    hoistVariableDeclarationsFromElement(scope, bindings, state, node.body[i], isFunctionScope);
  }
}

function hoistVariableDeclarations(scope, state, node, isFunctionScope) {
  const bindings = {};
  hoistVariableDeclarationsImpl(scope, bindings, state, node, isFunctionScope);
  return bindings;
}

exports.evaluateBlock = evaluateBlock;
exports.hoistVariableDeclarations = hoistVariableDeclarations;
