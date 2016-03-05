// TEST: two strings addition no error
function foo(x) {
  return String(x * 10) + 'hello';
}

__STATIC_ASSERT(foo(20) === '200hello');
```
```;

// TEST: one unknown string addition no error
function foo(x) {
  return x + 'hello';
}

__STATIC_ASSERT(typeof foo(__STRING__) === 'string');
```
```;

// TEST: two unknown strings addition no error
function foo(x) {
  return x + __STRING__;
}

__STATIC_ASSERT(typeof foo(__STRING__) === 'string');
```
```;

// TEST: number and string addition error
function foo(x) {
  return x * 10 + 'hello';
}

foo(20);
```
input:3:9:error: concatenation of number and string without explicit conversion
```;

// TEST: number and boolean addition error
function foo(x, y) {
  return x * 10 + y;
}

foo(20, true);
```
input:3:9:error: addition of number and boolean without explicit conversion
```;
