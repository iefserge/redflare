// TEST: logical not
__STATIC_ASSERT(!true === false);
__STATIC_ASSERT(!1 === false);
__STATIC_ASSERT(!'abc' === false);
__STATIC_ASSERT(!!true === true);
__STATIC_ASSERT(!!1 === true);
__STATIC_ASSERT(!!'abc' === true);
__STATIC_ASSERT(!!!false === true);
__STATIC_ASSERT(!!!0 === true);
__STATIC_ASSERT(!!!'' === true);
```
```;
