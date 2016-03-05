'use strict';
const assert = require('assert');
const AbstractValue = require('./abstract-type');
const SourceFile = require('../source-file');
const VALUE_OR_EXCEPTION_VALUE = 0;
const VALUE_OR_EXCEPTION_EXCEPTION = 1;

/**
 * Object that represents result of the evaluated javascript statement,
 * block or function. Can either contain a resulting value or thrown exception value.
 */
class ValueOrException {
  constructor(type, value, data) {
    assert(type === VALUE_OR_EXCEPTION_VALUE || type === VALUE_OR_EXCEPTION_EXCEPTION, 'invalid type');
    assert(value instanceof AbstractValue, 'invalid value');
    this._type = type;
    this._value = value || null;
    this._data = data || null;
  }

  /**
   * Create new value.
   */
  static makeValue(v) {
    return new ValueOrException(VALUE_OR_EXCEPTION_VALUE, v);
  }

  /**
   * Create new thrown exception value.
   */
  static makeException(source, node, v) {
    assert(source instanceof SourceFile);
    return new ValueOrException(VALUE_OR_EXCEPTION_EXCEPTION, v, { source, node });
  }

  /**
   * Check if value is thrown exception value. There is no isValue alternative,
   * because it makes sense to check for exceptions consistently.
   */
  isException() {
    return this._type === VALUE_OR_EXCEPTION_EXCEPTION;
  }

  /**
   * Get value. isException should be used to access this value correctly.
   */
  value() {
    assert(this._type === VALUE_OR_EXCEPTION_VALUE, 'is not a value');
    return this._value;
  }

  /**
   * Get thrown exception value. isException should be used to access
   * this value correctly.
   */
  exceptionValue() {
    assert(this._type === VALUE_OR_EXCEPTION_EXCEPTION, 'is not an exception');
    return this._value;
  }

  /**
   * Get attached data
   */
  data() {
    return this._data;
  }
}

module.exports = ValueOrException;
