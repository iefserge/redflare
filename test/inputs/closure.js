// TEST: adder closure
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

__STATIC_ASSERT(add5(2) === 7);
__STATIC_ASSERT(add10(2) === 12);
__STATIC_ASSERT(add5(11) === 16);
__STATIC_ASSERT(add10(11) === 21);
```
```;

// TEST: counter closure
function makeCounter() {
  let count = 0;
  return function() {
    count = count + 1;
    return count;
  };
}

const counter = makeCounter();
__STATIC_ASSERT(counter() === 1);
__STATIC_ASSERT(counter() === 2);
__STATIC_ASSERT(counter() === 3);
```
```;
