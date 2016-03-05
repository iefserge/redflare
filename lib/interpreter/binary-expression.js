'use strict';
const AbstractValue = require('./abstract-type');
const statement = require('./statement');
const ValueOrException = require('./value-or-exception');
const VAL = ValueOrException.makeValue;

function evaluateBinaryExpression(state, node) {
  const reporter = state.reporter;
  const source = state.source;

  const maybeLeft = statement.evaluateStatement(state, node.left);
  if (maybeLeft.isException()) {
    return maybeLeft;
  }

  const maybeRight = statement.evaluateStatement(state, node.right);
  if (maybeRight.isException()) {
    return maybeRight;
  }

  const left = maybeLeft.value();
  const right = maybeRight.value();

  if (node.operator === '*') {
    if (!left.isNumber() || !right.isNumber()) {
      reporter.log(source, node, 'INCOMPATIBLE_TYPES_MULT', left.toTypeString(), right.toTypeString());
      return VAL(AbstractValue.makeAnyNumber());
    }

    if (left.hasValue() && right.hasValue()) {
      return VAL(AbstractValue.makeNumber(left.value() * right.value()));
    }

    return VAL(AbstractValue.makeAnyNumber());
  }

  if (node.operator === '-') {
    if (!left.isNumber() || !right.isNumber()) {
      reporter.log(source, node, 'INCOMPATIBLE_TYPES_SUB', left.toTypeString(), right.toTypeString());
      return VAL(AbstractValue.makeAnyNumber());
    }

    if (left.hasValue() && right.hasValue()) {
      return VAL(AbstractValue.makeNumber(left.value() - right.value()));
    }

    return VAL(AbstractValue.makeAnyNumber());
  }

  if (node.operator === '/') {
    if (!left.isNumber() || !right.isNumber()) {
      reporter.log(source, node, 'INCOMPATIBLE_TYPES_DIV', left.toTypeString(), right.toTypeString());
      return VAL(AbstractValue.makeAnyNumber());
    }

    if (right.hasValue() && right.value() === 0) {
      reporter.log(source, node, 'DIV_ZERO');
      return VAL(AbstractValue.makeNumber(Number.NaN));
    }

    if (left.hasValue() && right.hasValue()) {
      return VAL(AbstractValue.makeNumber(left.value() / right.value()));
    }

    return VAL(AbstractValue.makeAnyNumber());
  }

  if (node.operator === '+') {
    if (left.isString() && right.isString()) {
      if (left.hasValue() && right.hasValue()) {
        return VAL(AbstractValue.makeString(left.value() + right.value()));
      }

      return VAL(AbstractValue.makeAnyString());
    }

    if (left.isNumber() && right.isNumber()) {
      if (left.hasValue() && right.hasValue()) {
        return VAL(AbstractValue.makeNumber(left.value() + right.value()));
      }

      return VAL(AbstractValue.makeAnyNumber());
    }

    if (left.isString() || right.isString()) {
      reporter.log(source, node, 'INCOMPATIBLE_TYPES_CONCAT', left.toTypeString(), right.toTypeString());
      return VAL(AbstractValue.makeAnyString());
    }

    reporter.log(source, node, 'INCOMPATIBLE_TYPES_ADD', left.toTypeString(), right.toTypeString());
    return VAL(AbstractValue.makeAny());
  }

  if (node.operator === '===') {
    return VAL(AbstractValue.strictEquals(left, right));
  }

  if (node.operator === '!==') {
    return VAL(AbstractValue.logicalNot(AbstractValue.strictEquals(left, right)));
  }

  throw new Error('unknown binary operator ' + JSON.stringify(node));
}

exports.evaluateBinaryExpression = evaluateBinaryExpression;
