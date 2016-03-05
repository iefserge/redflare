// TEST: subtraction of two numbers no error
function foo(x) {
  return x - 10;
}

__STATIC_ASSERT(foo(100) === 90);
```
```;

// TEST: subtraction of number and unknown number no error
function foo(x) {
  return x - __NUMBER__;
}

__STATIC_ASSERT(typeof foo(100) === 'number');
```
```;

// TEST: subtraction of two unknown numbers no error
function foo(x) {
  return x - __NUMBER__;
}

__STATIC_ASSERT(typeof foo(__NUMBER__) === 'number');
```
```;

// TEST: subtraction of string and number error
function foo(x) {
  return x - 10;
}

__STATIC_ASSERT(typeof foo('str') === 'number');
```
input:3:9:error: subtraction of string and number
```;

// TEST: subtraction of string and string error
function foo(x) {
  return x - 's';
}

__STATIC_ASSERT(typeof foo('str') === 'number');
```
input:3:9:error: subtraction of string and string
```;
