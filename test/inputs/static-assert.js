// TEST: static assert call with 0 arguments
__STATIC_ASSERT();
```
input:2:0:error: invalid number of arguments 0, expected 1 or 2
```;

// TEST: static assert call with 3 arguments
__STATIC_ASSERT('a', 'b', 'c');
```
input:2:0:error: invalid number of arguments 3, expected 1 or 2
```;

// TEST: static assert true
__STATIC_ASSERT(true);
__STATIC_ASSERT(10);
__STATIC_ASSERT('hello');
__STATIC_ASSERT(0.5);
__STATIC_ASSERT(typeof __NUMBER__ === 'number');
__STATIC_ASSERT(typeof __STRING__ === 'string');
__STATIC_ASSERT(typeof __BOOLEAN__ === 'boolean');
__STATIC_ASSERT(typeof (__NUMBER__ + __NUMBER__) === 'number');
```
```;

// TEST: static assert false
__STATIC_ASSERT(false);
__STATIC_ASSERT('');
__STATIC_ASSERT(0);
```
input:2:0:error: static assertion failed
input:3:0:error: static assertion failed
input:4:0:error: static assertion failed
```;

// TEST: static assert expression true
__STATIC_ASSERT(10 === 5 + 4 + 1);
```
```;

// TEST: static assert expression false
__STATIC_ASSERT(10 === 5 + 5 + 1);
```
input:2:0:error: static assertion failed
```;

// TEST: static assert unknown
__STATIC_ASSERT(__NUMBER__);
```
input:2:0:error: static assertion result is unknown
```;

// TEST: static assert non-string message
__STATIC_ASSERT(true, 10);
```
input:2:0:error: static assertion message is not a string
```;

// TEST: static assert with message
__STATIC_ASSERT(false, 'this' + ' works: ' + String(true));
```
input:2:0:error: static assertion failed "this works: true"
```;
