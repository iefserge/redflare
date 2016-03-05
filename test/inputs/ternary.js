// TEST: ternary known condition value
function foo(value) {
  return (value === 10) ? 10 : 5;
}

__STATIC_ASSERT(foo(10) === 10);
__STATIC_ASSERT(foo(7) === 5);
__STATIC_ASSERT(foo(5) === 5);
__STATIC_ASSERT(foo(11) === 5);
__STATIC_ASSERT(foo(0) === 5);
```
```;

// TEST: ternary incompatible results
function foo(value) {
  return value ? '10' : 10;
}

foo(__BOOLEAN__);
```
input:3:9:error: conditional expression results in incompatible string and number
```;

// TEST: ternary known result type no errors
function foo(value) {
  return value ? 10 : 5;
}

__STATIC_ASSERT(typeof foo(__BOOLEAN__) === 'number');
```
```;
