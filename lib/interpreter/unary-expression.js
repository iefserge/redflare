'use strict';
const AbstractValue = require('./abstract-type');
const statement = require('./statement');
const ValueOrException = require('./value-or-exception');
const VAL = ValueOrException.makeValue;

function evaluateUnaryExpression(state, node) {
  const reporter = state.reporter;
  const source = state.source;

  const maybeArg = statement.evaluateStatement(state, node.argument);
  if (maybeArg.isException()) {
    return maybeArg;
  }

  const arg = maybeArg.value();

  if (node.operator === 'typeof') {
    if (arg.isAny()) {
      return VAL(AbstractValue.makeAnyString());
    }

    if (arg.isUndefined()) {
      return VAL(AbstractValue.makeString('undefined'));
    }

    if (arg.isNull()) {
      return VAL(AbstractValue.makeString('object'));
    }

    if (arg.isBoolean()) {
      return VAL(AbstractValue.makeString('boolean'));
    }

    if (arg.isNumber()) {
      return VAL(AbstractValue.makeString('number'));
    }

    if (arg.isString()) {
      return VAL(AbstractValue.makeString('string'));
    }

    if (arg.isFunction()) {
      return VAL(AbstractValue.makeString('function'));
    }

    return VAL(AbstractValue.makeString('object'));
  }

  if (node.operator === '!') {
    return VAL(AbstractValue.logicalNot(arg));
  }

  throw new Error('unknown unary operator ' + JSON.stringify(node));
}

exports.evaluateUnaryExpression = evaluateUnaryExpression;
