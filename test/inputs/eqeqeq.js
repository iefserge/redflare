// TEST: strict equals known results
__STATIC_ASSERT(true === true);
__STATIC_ASSERT(true !== false);
__STATIC_ASSERT(0 === 0);
__STATIC_ASSERT(0 !== 1);
__STATIC_ASSERT('abc' === 'abc');
__STATIC_ASSERT('abc' !== 'ab');
__STATIC_ASSERT('abc' !== 'abcd');
```
```;

// TEST: strict equals unknown results
__STATIC_ASSERT(__BOOLEAN__ === __BOOLEAN__);
__STATIC_ASSERT(__NUMBER__ === __NUMBER__);
__STATIC_ASSERT(__STRING__ === __STRING__);
```
input:2:0:error: static assertion result is unknown
input:3:0:error: static assertion result is unknown
input:4:0:error: static assertion result is unknown
```;
