// TEST: declare a var variable
function foo(x) {
  var a = 10, b = 20;
  var c = 30;
  return a + b + c + x;
}

__STATIC_ASSERT(foo(5) === 65);
```
```;

// TEST: variable hoisting from inner blocks
function foo(x) {
  var a = 10, b = 20;

  if (true) {
    var c = 30;
  }

  {
    var d = 5;

    {
      var e = 1;

      if (true) {
        var f = 2;
      }
    }
  }

  return a + b + c + x + d + e + f;
}

__STATIC_ASSERT(foo(5) === 73);
```
```;

// TEST: var without initialization is undefined
function foo() {
  var a, b, c;
  __STATIC_ASSERT(typeof a === 'undefined');
  __STATIC_ASSERT(typeof b === 'undefined');
  __STATIC_ASSERT(typeof c === 'undefined');
}

foo();
```
```;
