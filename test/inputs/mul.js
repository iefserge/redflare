// TEST: multiplication of two numbers no error
function foo(x) {
  return x * 10;
}

__STATIC_ASSERT(foo(100) === 1000);
```
```;

// TEST: multiplication of unknow number and number no error
function foo(x) {
  return x * 10;
}

__STATIC_ASSERT(typeof foo(__NUMBER__) === 'number');
```
```;

// TEST: multiplication of two unknown numbers no error
function foo(x) {
  return x * __NUMBER__;
}

__STATIC_ASSERT(typeof foo(__NUMBER__) === 'number');
```
```;

// TEST: multiplication of string and number error
function foo(x) {
  return x * 10;
}

foo('Hello, world!');
```
input:3:9:error: multiplication of string and number
```;
