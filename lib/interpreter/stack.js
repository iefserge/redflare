'use strict';
const AbstractValue = require('./abstract-type');
const assert = require('assert');
const Scope = require('./scope').Scope;
const STACK_SCOPE_FUNCTION = 1;
const STACK_SCOPE_BLOCK = 2;

const ELEMENT_INDEX_TYPE = 0;
const ELEMENT_INDEX_SCOPE = 1;

class Stack {
  constructor() {
    this._stack = [];
  }

  pushFunctionScope(scope) {
    assert(scope instanceof Scope, 'pushing not a scope');
    const stack = this._stack;
    const s = [STACK_SCOPE_FUNCTION, scope];
    stack.push(s);
  }

  pushBlockScope(scope) {
    assert(scope instanceof Scope, 'pushing not a scope');
    const stack = this._stack;
    const s = [STACK_SCOPE_BLOCK, scope];
    stack.push(s);
  }

  current() {
    const stack = this._stack;
    assert(stack.length > 0, 'entered any scope');
    const top = stack[stack.length - 1];
    return top[ELEMENT_INDEX_SCOPE];
  }

  popFunctionScope() {
    const stack = this._stack;
    for (let i = 0; i < stack.length; ++i) {
      const top = stack[stack.length - 1];
      if (top[ELEMENT_INDEX_TYPE] === STACK_SCOPE_BLOCK) {
        stack.pop();
        continue;
      }

      break;
    }

    stack.pop();
  }

  popBlockScope() {
    const stack = this._stack;
    const top = stack[stack.length - 1];
    assert(top[ELEMENT_INDEX_TYPE], STACK_SCOPE_BLOCK);
    stack.pop();
  }

  length() {
    return this._stack.length;
  }
}

module.exports = Stack;
