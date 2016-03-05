// TEST: module scope function declaration hoisting
__STATIC_ASSERT(foo() === 'foo');
function foo() {
  return 'foo';
}
```
```;

// TEST: function scope function declaration hoisting
__STATIC_ASSERT(foo() === 'bar');
function foo() {
  return bar();
  function bar() {
    return 'bar';
  }
}
```
```;

// TEST: block scope function declaration hoisting
__STATIC_ASSERT(foo() === 'bar');
function foo() {
  if (true) {
    return bar();

    function bar() {
      return 'bar';
    }
  }

  return 'foo';
}
```
```;

// TEST: return function from function
__STATIC_ASSERT(typeof foo() === 'function');
__STATIC_ASSERT(foo()() === 'bar');
function foo() {
  return bar;
  function bar() {
    return 'bar';
  }
}
```
```;
