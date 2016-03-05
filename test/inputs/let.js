// TEST: declare a let variable
function foo(x) {
  let a = 1;
  let b = 2;
  return a + b + x;
}

__STATIC_ASSERT(foo(5) === 8);
```
```;

// TEST: let variable hoisting
function foo(x) {
  let a = 10, b = 20;

  {
    let c = 5;
  }

  return a + b + c;
}

function bar(x) {
  let a = 10, b = 20;

  if (true) {
    let c = 30;
  }

  return a + b + c;
}

foo(5);
bar(5);
```
input:9:17:error: uncaught exception: c is not defined
```;

// TEST: let without initialization is undefined
function foo() {
  let a, b, c;
  __STATIC_ASSERT(typeof a === 'undefined');
  __STATIC_ASSERT(typeof b === 'undefined');
  __STATIC_ASSERT(typeof c === 'undefined');
}

foo();
```
```;
