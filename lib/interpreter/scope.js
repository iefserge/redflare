'use strict';
const AbstractValue = require('./abstract-type');
const immutable = require('immutable');
const assert = require('assert');

/**
 * Variable scope binding defined by its name and constness.
 *
 * Example const binding:
 * new Binding(AbstractValue.makeNumber(10), true);
 *
 * Example mutable binding:
 * new Binding(AbstractValue.makeBoolean(true), false);
 *
 * Example mutable binding in TDZ (temporal dead zone):
 * new Binding(null, false);
 */
class Binding {
  constructor(value, constant) {
    assert(value === null || value instanceof AbstractValue);
    this._value = value || null;
    this._constant = constant || false;
  }

  value() {
    return this._value;
  }

  set(value) {
    assert(value instanceof AbstractValue);
    if (this._constant && this._value !== null) {
      throw new Error('trying to assign a constant');
    }

    this._value = value;
  }

  isConst() {
    return this._constant;
  }
}

/**
 * Scope contains its own variable bindings and also all bindings
 * from all the parent scopes that it closes over (from parent scope).
 *
 * Implemented using immutable.js map, this way every new scope gets own
 * copy of the parent scope bindings. Note, that maps hold mutable bindings
 * objects, this is important because a number of scopes can have access to
 * the same variable bindings.
 *
 * pushBindings1, pushBindings2, pushBindings3 are versions of the same
 * method added for performance. pushBindings merges 1-3 new bindings maps
 * (js objects) into the scope. Each binding should be an instance
 * of a Binding class.
 *
 * Usage example:
 *
 * const scope = new Scope(parentScope);
 * scope.pushBindings1({
 *   val: new Binding(AbstractValue.makeNumber(10), true)
 * });
 *
 * Example creates new scope and declares new "val" const variable binding
 * in it. val has initial type number and value 10.
 */
class Scope {
  constructor(parentScope) {
    this._bindings = parentScope ? parentScope._bindings : immutable.Map();
  }

  pushBindings1(a) {
    this._bindings = this._bindings.merge(a);
  }

  pushBindings2(a, b) {
    this._bindings = this._bindings.merge(a, b);
  }

  pushBindings3(a, b, c) {
    this._bindings = this._bindings.merge(a, b, c);
  }

  getBinding(name) {
    const binding = this._bindings.get(name);
    assert(!binding || binding instanceof Binding, 'not a binding');
    return binding;
  }
}

exports.Binding = Binding;
exports.Scope = Scope;
