'use strict';
const test = require('ava');
const Stack = require('../../lib/interpreter/stack');
const Scope = require('../../lib/interpreter/scope').Scope;
const AbstractValue = require('../../lib/interpreter/abstract-type');

test('function and block scopes', t => {
  const stack = new Stack();
  const scope = new Scope(null);

  t.same(stack.length(), 0, 'get initial stack array length');

  // create global block scope
  stack.pushBlockScope(scope);

  // enter fn1
  stack.pushFunctionScope(scope);

  stack.pushBlockScope(scope);

  // enter fn2
  stack.pushFunctionScope(scope);
  stack.pushBlockScope(scope);
  stack.pushBlockScope(scope);
  stack.pushBlockScope(scope);
  stack.pushBlockScope(scope);
  stack.pushBlockScope(scope);
  stack.popBlockScope();
  stack.pushBlockScope(scope);

  // exit fn2
  stack.popFunctionScope();

  // exit fn1
  stack.popFunctionScope();

  // exit global block scope
  stack.popBlockScope();

  t.same(stack.length(), 0, 'left every scope');
});
