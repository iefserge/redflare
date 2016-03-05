// TEST: computed division result
function foo(x, y) {
  return x / y;
}

__STATIC_ASSERT(foo(10, 2) === 5);
```
```;

// TEST: division two unknown numbers
function foo(x, y) {
  return x / y;
}

__STATIC_ASSERT(typeof foo(__NUMBER__, __NUMBER__) === 'number');
```
```;

// TEST: division by zero error
function foo(x, y) {
  return String(x * 10 / y) + 'bb';
}

foo(10, 10 - 10);
```
input:3:16:error: division by zero
```;

// TEST: division by unknown number by zero error
function foo(x, y) {
  return x / y;
}

foo(__NUMBER__, 10 - 2 * 5);
```
input:3:9:error: division by zero
```;

// TEST: division string by number
function foo(x, y) {
  return x / y;
}

foo('hello', 10);
```
input:3:9:error: division of string by number
```;

// TEST: division number by string
function foo(x, y) {
  return x / y;
}

foo(10, 'ab');
```
input:3:9:error: division of number by string
```;

// TEST: division of two unknown incompatible values
function foo(x, y) {
  return x / y;
}

foo(__NUMBER__, __STRING__);
```
input:3:9:error: division of number by string
```;

// TEST: division of two unknown strings
function foo(x, y) {
  return x / y;
}

foo(__STRING__, __STRING__);
```
input:3:9:error: division of string by string
```;
