function foo(value) {
  return 10 + value;
}

function bar(num) {
  return foo(11) + num * foo(5);
}

function baz() {
  return bar(3);
}

__STATIC_ASSERT(baz() === 66);
```
```;
