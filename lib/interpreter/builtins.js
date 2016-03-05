'use strict';
const AbstractValue = require('./abstract-type');
const ValueOrException = require('./value-or-exception');
const Binding = require('./scope').Binding;
const Func = require('./func');
const Scope = require('./scope').Scope;
const VAL = ValueOrException.makeValue;

/**
 * Implements Number()
 */
function evaluateNumberCast(state, args, node) {
  const reporter = state.reporter;
  const source = state.source;

  if (args.length !== 1) {
    reporter.log(source, node, 'INVOCATION_INVALID_ARGUMENTS_NUMBER', args.length, 1);
    return VAL(AbstractValue.makeAnyNumber());
  }

  const arg = args[0];
  if (arg.isNumber()) {
    return VAL(arg);
  }

  if (arg.isString() || arg.isBoolean()) {
    return VAL(arg.hasValue()
      ? AbstractValue.makeNumber(Number(arg.value()))
      : AbstractValue.makeAnyNumber());
  }

  reporter.log(source, node, 'CONVERSION_NUMBER_FAIL', arg.toTypeString());
  return VAL(AbstractValue.makeAnyNumber());
}

/**
 * Implements Boolean()
 */
function evaluateBooleanCast(state, args, node) {
  const reporter = state.reporter;
  const source = state.source;

  if (args.length !== 1) {
    reporter.log(source, node, 'INVOCATION_INVALID_ARGUMENTS_NUMBER', args.length, 1);
    return VAL(AbstractValue.makeAnyBoolean());
  }

  const arg = args[0];
  if (arg.isBoolean()) {
    return VAL(arg);
  }

  if (arg.hasValue()) {
    return VAL(AbstractValue.makeBoolean(Boolean(arg.value())));
  }

  return VAL(AbstractValue.makeAnyBoolean());
}

/**
 * Implements String()
 */
function evaluateStringCast(state, args, node) {
  const reporter = state.reporter;
  const source = state.source;

  if (args.length !== 1) {
    reporter.log(source, node, 'INVOCATION_INVALID_ARGUMENTS_NUMBER', args.length, 1);
    return VAL(AbstractValue.makeAnyString());
  }

  const arg = args[0];
  if (arg.isString()) {
    return VAL(arg);
  }

  if (arg.hasValue()) {
    return VAL(AbstractValue.makeString(String(arg.value())));
  }

  return VAL(AbstractValue.makeAnyString());
}

/**
 * Implements __STATIC_ASSERT builtin function.
 */
function evaluateStaticAssert(state, args, node) {
  const reporter = state.reporter;
  const source = state.source;

  if (args.length === 0 || args.length > 2) {
    reporter.log(source, node, 'INVOCATION_INVALID_ARGUMENTS_NUMBER_OR', args.length, 1, 2);
    return VAL(AbstractValue.makeUndefined());
  }

  let message = '';
  if (args.length === 2) {
    if (!args[1].isString() || !args[1].hasValue()) {
      reporter.log(source, node, 'STATIC_ASSERT_INVALID_MESSAGE');
    } else {
      message = args[1].value();
    }
  }

  const test = args[0].convertToBoolean();
  if (!test.hasValue()) {
    reporter.log(source, node, 'STATIC_ASSERT_UNKNOWN');
    return VAL(AbstractValue.makeUndefined());
  }

  if (!test.value()) {
    if (message) {
      reporter.log(source, node, 'STATIC_ASSERT_FAIL_MESSAGE', message);
    } else {
      reporter.log(source, node, 'STATIC_ASSERT_FAIL');
    }
    return VAL(AbstractValue.makeUndefined());
  }

  return VAL(AbstractValue.makeUndefined());
}

/**
 * Setup globals and builtins
 */
exports.setupContext = function(state) {
  const stack = state.stack;
  const newScope = new Scope(null);

  state.globalScope = newScope;

  newScope.pushBindings1({
    // Undefined is like a regular variable
    'undefined': new Binding(AbstractValue.makeUndefined(), true),

    // NaN, Infinity are globals too
    'NaN': new Binding(AbstractValue.makeNumber(NaN), true),
    'Infinity': new Binding(AbstractValue.makeNumber(Infinity), true),

    // JavaScript builtins
    'Number': new Binding(AbstractValue.makeFunction(Func.makeNative(evaluateNumberCast)), true),
    'String': new Binding(AbstractValue.makeFunction(Func.makeNative(evaluateStringCast)), true),
    'Boolean': new Binding(AbstractValue.makeFunction(Func.makeNative(evaluateBooleanCast)), true),

    // Utils
    '__STATIC_ASSERT': new Binding(AbstractValue.makeFunction(Func.makeNative(evaluateStaticAssert)), true),
    '__BOOLEAN__': new Binding(AbstractValue.makeAnyBoolean(), true),
    '__NUMBER__': new Binding(AbstractValue.makeAnyNumber(), true),
    '__STRING__': new Binding(AbstractValue.makeAnyString(), true)
  });
};
