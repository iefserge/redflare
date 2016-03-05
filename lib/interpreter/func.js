'use strict';
const FUNC_TYPE_JS = 0;
const FUNC_TYPE_NATIVE = 1;

class Func {
  constructor(type, node, parentScope, handler) {
    this._type = type;
    this._node = node;
    this._parentScope = parentScope;
    this._handler = handler;
  }

  static makeFromNode(node, parentScope) {
    return new Func(FUNC_TYPE_JS, node, parentScope, null);
  }

  static makeNative(handler) {
    return new Func(FUNC_TYPE_NATIVE, null, null, handler);
  }

  node() {
    return this._node;
  }

  isNative() {
    return this._type === FUNC_TYPE_NATIVE;
  }

  parentScope() {
    return this._parentScope;
  }

  handler() {
    return this._handler;
  }
}

module.exports = Func;
