'use strict';
const Func = require('./func');
const assert = require('assert');
const ABSTRACT_VALUE_TYPE_ANY = 0;
const ABSTRACT_VALUE_TYPE_UNDEFINED = 1;
const ABSTRACT_VALUE_TYPE_NULL = 2;
const ABSTRACT_VALUE_TYPE_FUNCTION = 3;
const ABSTRACT_VALUE_TYPE_STRING = 4;
const ABSTRACT_VALUE_TYPE_BOOLEAN = 5;
const ABSTRACT_VALUE_TYPE_NUMBER = 6;

// ordered by value index
const typeNames = [
  'any',
  'undefined',
  'null',
  'function',
  'string',
  'boolean',
  'number'
];

class AbstractValue {
  constructor(type, hasValue, value) {
    this._type = type;
    this._hasValue = hasValue;
    this._value = value;
  }

  hasValue() {
    return this._hasValue;
  }

  value() {
    return this._value;
  }

  isAny() {
    return this._type === ABSTRACT_VALUE_TYPE_ANY;
  }

  isUndefined() {
    return this._type === ABSTRACT_VALUE_TYPE_UNDEFINED;
  }

  isNull() {
    return this._type === ABSTRACT_VALUE_TYPE_NULL;
  }

  isFunction() {
    return this._type === ABSTRACT_VALUE_TYPE_FUNCTION;
  }

  isString() {
    return this._type === ABSTRACT_VALUE_TYPE_STRING;
  }

  isNumber() {
    return this._type === ABSTRACT_VALUE_TYPE_NUMBER;
  }

  isBoolean() {
    return this._type === ABSTRACT_VALUE_TYPE_BOOLEAN;
  }

  toTypeString() {
    return typeNames[this._type];
  }

  withoutValue() {
    return new AbstractValue(this._type, false, null);
  }

  convertToBoolean() {
    if (this.isAny()) {
      return this.constructor.makeAnyBoolean();
    }

    if (this.isFunction()) {
      return this.constructor.makeBoolean(true);
    }

    if (this.hasValue()) {
      return this.constructor.makeBoolean(Boolean(this.value()));
    }

    return this.constructor.makeAnyBoolean();
  }

  static makeAny() {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_ANY, false, null);
  }

  static makeUndefined() {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_UNDEFINED, true, void 0);
  }

  static makeNull() {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_NULL, true, null);
  }

  static makeFunction(func) {
    assert(func instanceof Func);
    return new AbstractValue(ABSTRACT_VALUE_TYPE_FUNCTION, true, func);
  }

  static makeAnyString() {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_STRING, false, null);
  }

  static makeString(str) {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_STRING, true, String(str));
  }

  static makeAnyBoolean() {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_BOOLEAN, false, null);
  }

  static makeBoolean(bool) {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_BOOLEAN, true, Boolean(bool));
  }

  static makeAnyNumber() {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_NUMBER, false, null);
  }

  static makeNumber(num) {
    return new AbstractValue(ABSTRACT_VALUE_TYPE_NUMBER, true, Number(num));
  }

  static typeEquals(a, b) {
    if (a.isAny() || b.isAny()) {
      return false;
    }

    return a._type === b._type;
  }

  static makeFromValue(val) {
    if (typeof val === 'boolean') {
      return this.makeBoolean(val);
    }

    if (typeof val === 'number') {
      return this.makeNumber(val);
    }

    if (typeof val === 'string') {
      return this.makeString(val);
    }

    if (val === null) {
      return this.makeNull();
    }

    throw new Error('unknown value type', val);
  }

  /**
   * Implements The Strict Equality Comparison Algorithm
   * http://www.ecma-international.org/ecma-262/6.0/#sec-strict-equality-comparison
   *
   * Algorithm additionally needs to handle cases where types and/or values
   * are unknown. However, algorithm always returns boolean. In case it's not
   * possible to infer the result, anyBoolean value is returned.
   *
   * @param {AbstractValue} a First value to compare
   * @param {AbstractValue} b Second value to compare
   * @returns {AbstractValue} Strict comparison result
   */
  static strictEquals(a, b) {
    // Both values don't have a known type, immediately
    // return anyBoolean
    if (a.isAny() || b.isAny()) {
      return AbstractValue.makeAnyBoolean();
    }

    // At this point we know that both values have specific types and
    // if they are different, result would always be false
    if (a._type !== b._type) {
      return AbstractValue.makeBoolean(false);
    }

    // We're comparing the same type here, return true if it's
    // null or undefined
    if (a.isUndefined() || a.isNull()) {
      return AbstractValue.makeBoolean(true);
    }

    // Use actual === operator to compute the result of known values
    if (a.hasValue() && b.hasValue()) {
      return AbstractValue.makeBoolean(a.value() === b.value());
    }

    // In any other case we return unknown boolean
    return AbstractValue.makeAnyBoolean();
  }

  /*
   * Abstract operation ToBoolean converts argument to a value of type Boolean.
   * http://www.ecma-international.org/ecma-262/6.0/#sec-toboolean
   */
  static toBoolean(v) {
    if (v.isAny()) {
      // Return any boolean for any unknown input value
      return AbstractValue.makeAnyBoolean();
    }

    // null or undefined inputs result in true
    if (v.isNull() || v.isUndefined()) {
      return AbstractValue.makeBoolean(true);
    }

    // Pass booleans through
    if (v.isBoolean()) {
      return v;
    }

    if (v.isString()) {
      if (v.hasValue()) {
        // Apply Boolean() to actual strings
        return AbstractValue.makeBoolean(Boolean(v.value()));
      }

      return AbstractValue.makeAnyBoolean();
    }

    if (v.isNumber()) {
      if (v.hasValue()) {
        // Apply Number() to actual numbers
        return AbstractValue.makeBoolean(Number(v.value()));
      }

      return AbstractValue.makeAnyBoolean();
    }

    // Anything else (Object, Symbol) results in true
    return AbstractValue.makeBoolean(true);
  }

  /**
   * Logical NOT operator (!)
   * http://www.ecma-international.org/ecma-262/6.0/#sec-logical-not-operator
   */
  static logicalNot(v) {
    const bool = AbstractValue.toBoolean(v);
    if (bool.hasValue()) {
      return AbstractValue.makeBoolean(!bool.value());
    }

    return AbstractValue.makeAnyBoolean();
  }

  /**
   * Compute supervalue that represents both values at the same time.
   * Those expressions are valid:
   * SUPERVALUE(X, X) = X
   * SUPERVALUE(ANY, X) = ANY
   * SUPERVALUE(X, ANY) = ANY
   * SUPERVALUE(X, Y) = ANY
   *
   * @param {AbstractValue} a First value
   * @param {AbstractValue} b Second value
   * @returns {AbstractValue} Result
   */
  static superValue(a, b) {
    if (!this.typeEquals(a, b)) {
      return AbstractValue.makeAny();
    }

    if (a.hasValue() && b.hasValue() && a.value() === b.value()) {
      return a;
    }

    return a.withoutValue();
  }
}

module.exports = AbstractValue;
