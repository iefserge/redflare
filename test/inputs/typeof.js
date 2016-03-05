// TEST: typeof results
__STATIC_ASSERT(typeof __NUMBER__ === 'number', 'typeof of any number is number');
__STATIC_ASSERT(typeof __STRING__ === 'string', 'typeof of any string is string');
__STATIC_ASSERT(typeof __BOOLEAN__ === 'boolean', 'typeof of any boolean is boolean');
__STATIC_ASSERT(typeof 10 === 'number', 'typeof of number is number');
__STATIC_ASSERT(typeof 'abc' === 'string', 'typeof of string is string');
__STATIC_ASSERT(typeof true === 'boolean', 'typeof of boolean is boolean');
__STATIC_ASSERT(typeof false === 'boolean', 'typeof of boolean is boolean');
__STATIC_ASSERT(typeof null === 'object', 'typeof of null is object');
__STATIC_ASSERT(typeof undefined === 'undefined', 'typeof of undefined is undefined');
__STATIC_ASSERT(typeof NaN === 'number', 'typeof of NaN is number');
__STATIC_ASSERT(typeof Infinity === 'number', 'typeof of Infinity is number');
__STATIC_ASSERT(typeof typeof 1 === 'string', 'typeof of typeof is string');
```
```;

// TEST: unary typeof reference error
__STATIC_ASSERT(typeof undf === 'number', 'typeof of any number is number');
```
input:2:23:error: uncaught exception: undf is not defined
```;
