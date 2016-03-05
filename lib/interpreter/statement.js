'use strict';
const AbstractValue = require('./abstract-type');
const block = require('./block');
const binaryExpression = require('./binary-expression');
const unaryExpression = require('./unary-expression');
const assignmentExpression = require('./assignment-expression');
const builtins = require('./builtins');
const Scope = require('./scope').Scope;
const Binding = require('./scope').Binding;
const Func = require('./func');
const assert = require('assert');
const ValueOrException = require('./value-or-exception');
const VAL = ValueOrException.makeValue;
const THROW = ValueOrException.makeException;

function evaluateStatement(state, node) {
  const stack = state.stack;
  const reporter = state.reporter;
  const source = state.source;

  if (node.type === 'Literal') {
    return VAL(AbstractValue.makeFromValue(node.value));
  }

  if (node.type === 'Identifier') {
    const val = stack.current().getBinding(node.name);

    if (!val || !val.value()) {
      // Identifier is not defined or in a dead zone
      return THROW(source, node, AbstractValue.makeString(`${node.name} is not defined`));
    }

    assert(val.value() instanceof AbstractValue, 'binding value is not valid');
    return VAL(val.value());
  }

  if (node.type === 'FunctionExpression') {
    return VAL(AbstractValue.makeFunction(Func.makeFromNode(node, stack.current())));
  }

  if (node.type === 'BinaryExpression') {
    return binaryExpression.evaluateBinaryExpression(state, node);
  }

  if (node.type === 'AssignmentExpression') {
    return assignmentExpression.evaluateAssignmentExpression(state, node);
  }

  if (node.type === 'UnaryExpression') {
    return unaryExpression.evaluateUnaryExpression(state, node);
  }

  if (node.type === 'CallExpression') {
    const maybeCallee = evaluateStatement(state, node.callee);
    if (maybeCallee.isException()) {
      return maybeCallee;
    }

    const callee = maybeCallee.value();
    if (!callee.isFunction()) {
      return THROW(source, node.callee, AbstractValue.makeString(`${callee.toTypeString()} is not a function`));
    }

    if (!callee.hasValue()) {
      return THROW(source, node.callee, AbstractValue.makeString('callee function is unknown'));
    }

    const args = [];
    for (let i = 0; i < node.arguments.length; ++i) {
      const maybeArg = evaluateStatement(state, node.arguments[i]);
      if (maybeArg.isException()) {
        return maybeArg;
      }

      args.push(maybeArg.value());
    }

    const fn = callee.value();

    if (fn.isNative()) {
      return fn.handler()(state, args, node) || VAL(AbstractValue.makeUndefined());
    }

    const fnNode = fn.node();

    const argsBindings = {};
    fnNode.params.map((param, index) => {
      argsBindings[param.name] = new Binding((index < args.length) ? args[index] : AbstractValue.makeUndefined(), false);
    });

    const newScope = new Scope(fn.parentScope());

    // Hoist all variable declarations in function scope.
    const functionBindings = block.hoistVariableDeclarations(newScope, state, fnNode.body, true);

    // Hoist all variable declarations in block scope.
    const blockBindings = block.hoistVariableDeclarations(newScope, state, fnNode.body, false);

    newScope.pushBindings3(argsBindings, functionBindings, blockBindings);

    stack.pushFunctionScope(newScope);

    // We can get null as a result here if there no return value from the function
    const callResult = block.evaluateBlock(state, fnNode.body)[1] || VAL(AbstractValue.makeUndefined());
    stack.popFunctionScope();
    return callResult;
  }

  // Ternary operator (test ? consequent : alternate)
  if (node.type === 'ConditionalExpression') {
    // First, evaluate the test. This can result in any value, not just true/false.
    const maybeTestResult = evaluateStatement(state, node.test);
    if (maybeTestResult.isException()) {
      return maybeTestResult;
    }

    const testResult = maybeTestResult.value();

    // Known value of conditional expression results in the branch elimination
    // and dead code in the current flow trace. We don't have to follow both
    // paths and merge their results into single result and we can simply remove
    // the conditional and proceed evaluating linear program.
    if (testResult.hasValue()) {
      return evaluateStatement(state, testResult.value() ? node.consequent : node.alternate);
    }

    const maybeFirst = evaluateStatement(state, node.consequent);
    if (maybeFirst.isException()) {
      return maybeFirst;
    }

    const maybeSecond = evaluateStatement(state, node.alternate);
    if (maybeSecond.isException()) {
      return maybeSecond;
    }

    const first = maybeFirst.value();
    const second = maybeSecond.value();

    // Compute supervalue from two the values
    const result = AbstractValue.superValue(first, second);

    // Both branches returned known type values, but supertype is any. This means
    // result of the ternary expression can be mixed, which is a type error. For example,
    // (test ? 10 : '10') returns string or number.
    if (!first.isAny() && !second.isAny() && result.isAny()) {
      reporter.log(source, node, 'INCOMPATIBLE_TYPES_COND_RESULT', first.toTypeString(), second.toTypeString());
    }

    return VAL(result);
  }

  throw new Error('unknown expression node ' + JSON.stringify(node));
}

exports.evaluateStatement = evaluateStatement;
