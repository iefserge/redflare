// TEST: assignment to var

var a = 10;
__STATIC_ASSERT(a === 10);
a = 20;
__STATIC_ASSERT(a === 20);
a = 50;
__STATIC_ASSERT(a === 50);

var b = 5;
a = b = 3;
__STATIC_ASSERT(a === 3);
__STATIC_ASSERT(b === 3);
```
```;

// TEST: const assignment error

const c = 2;
c = 5;
```
input:4:0:error: uncaught exception: assignment to constant variable
```;

// TEST: assignment to not defined variable

c = 5;
```
input:3:0:error: uncaught exception: c is not defined
```;
