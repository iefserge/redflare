// TEST: if statement no errors
function foo(value) {
  if (value) {
    return 10;
  } else {
    return 5;
  }
}

__STATIC_ASSERT(foo(true) === 10);
__STATIC_ASSERT(foo(false) === 5);
__STATIC_ASSERT(typeof foo(__BOOLEAN__) === 'number');
```
```;

// TEST: two if statements no errors
function foo(v1, v2) {
  if (v1) {
    return 3;
  }

  if (v2) {
    return 10;
  } else {
    return 5;
  }
}

__STATIC_ASSERT(typeof foo(__BOOLEAN__, __BOOLEAN__) === 'number');
__STATIC_ASSERT(foo(true, true) === 3);
__STATIC_ASSERT(foo(true, false) === 3);
__STATIC_ASSERT(foo(false, true) === 10);
__STATIC_ASSERT(foo(false, false) === 5);
```
```;

// TEST: two if statements, second one is dead code
function foo(v1, v2) {
  if (v1) {
    return 3;
  } else {
    return 4;
  }

  if (v2) {
    return 'dead code 1';
  } else {
    return 'dead code 2';
  }

  return 'dead code';
}

__STATIC_ASSERT(typeof foo(__BOOLEAN__, __BOOLEAN__) === 'number');
__STATIC_ASSERT(foo(true, true) === 3);
__STATIC_ASSERT(foo(true, false) === 3);
__STATIC_ASSERT(foo(false, true) === 4);
__STATIC_ASSERT(foo(false, false) === 4);
```
```;

// TEST: nested if statements, dead string return
function foo(v1, v2) {
  if (v1) {
    if (v2) {
      return 10;
    } else {
      return 20;
    }

    // this is dead code return statement, it shouldn't affect
    // returned supervalue type
    return 'hello';
  }

  return 1;
}

__STATIC_ASSERT(typeof foo(__BOOLEAN__, __BOOLEAN__) === 'number');
__STATIC_ASSERT(foo(true, true) === 10);
__STATIC_ASSERT(foo(true, false) === 20);
__STATIC_ASSERT(foo(false, true) === 1);
__STATIC_ASSERT(foo(false, false) === 1);
```
```;

// TEST: nested if statements, valid string return
function foo(v1, v2) {
  if (v1) {
    if (v2) {
      return 10;
    } else {
    }

    // this is NOT a dead code return statement, it should cause
    // returned supervalue type to be "any", "typeof <any>" can
    // return any string, so static assert result is unknown
    return 'hello';
  }

  return 1;
}

__STATIC_ASSERT(typeof foo(__BOOLEAN__, __BOOLEAN__) === 'number');
```
input:18:0:error: static assertion result is unknown
```;
