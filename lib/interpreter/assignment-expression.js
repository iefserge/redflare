'use strict';
const AbstractValue = require('./abstract-type');
const statement = require('./statement');
const ValueOrException = require('./value-or-exception');
const assert = require('assert');
const VAL = ValueOrException.makeValue;
const THROW = ValueOrException.makeException;

exports.evaluateAssignmentExpression = function(state, node) {
  const reporter = state.reporter;
  const source = state.source;
  const stack = state.stack;

  assert(node.left.type === 'Identifier');
  const binding = stack.current().getBinding(node.left.name);

  if (!binding || !binding.value()) {
    // Identifier is not defined or in a dead zone
    return THROW(source, node, AbstractValue.makeString(`${node.left.name} is not defined`));
  }

  if (binding.isConst()) {
    return THROW(source, node, AbstractValue.makeString('assignment to constant variable'));
  }

  const maybeRight = statement.evaluateStatement(state, node.right);
  if (maybeRight.isException()) {
    return maybeRight;
  }

  const right = maybeRight.value();
  binding.set(right);

  return VAL(right);
};
