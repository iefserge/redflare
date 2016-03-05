// TEST: function expression
const x = function() { return 'ok' }
__STATIC_ASSERT(x() === 'ok');
```
```;

// TEST: function expression summ
const x = function(a, b) { return a + b }
__STATIC_ASSERT(x(1, 5) === 6);
```
```;

// TEST: two functions
const x = function(a, b) { return a + b }
const y = function(a, b) { return a - b }
__STATIC_ASSERT(x(1, 5) + y(5, 1) === 10);
```
```;

// TEST: return function from function
function foo() {
  const a = 10;
  return function() {
    return a;
  }
}

__STATIC_ASSERT(foo()() === 10);
```
```;
