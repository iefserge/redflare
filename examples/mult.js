'use strict';

/* Define simple function the multiplies its argument by 10 */
function foo(x) {
  return 10 * x;
}

/* This should pass (multiplicaton of two numbers) */
let value = foo(5);

/* Value is known during static analysis, we can ensure it's correct */
__STATIC_ASSERT(value === 50);

/* This should NOT pass (multiplicaton of string and a number is an error) */
foo('hello');
