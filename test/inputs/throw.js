// TEST: Throw statement
function foo() {
  throw 'error';
}

foo();
```
input:3:8:error: uncaught exception: error
```;

// TEST: Throw statement from inner block
function foo() {
  {
    throw 'error';
  }
}

foo();
```
input:4:10:error: uncaught exception: error
```;

// TEST: Throw statement from inner if
function foo() {
  if (true) {
    throw 'error';
  }
}

foo();
```
input:4:10:error: uncaught exception: error
```;

// TEST: Throw statement from inner blocks
function foo() {
  if (true) {
    if (true) {
      if (true) {
        throw 'error';
      } else {
        return 1;
      }
    } else {
      return 2;
    }
  } else {
    return 3;
  }
}

foo();
```
input:6:14:error: uncaught exception: error
```;
