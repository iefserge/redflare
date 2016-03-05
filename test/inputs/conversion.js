// TEST: conversion to boolean
__STATIC_ASSERT(typeof Boolean(__BOOLEAN__) === 'boolean');
__STATIC_ASSERT(typeof Boolean(__STRING__) === 'boolean');
__STATIC_ASSERT(typeof Boolean(__NUMBER__) === 'boolean');
__STATIC_ASSERT(Boolean(true) === true);
__STATIC_ASSERT(Boolean(false) === false);
__STATIC_ASSERT(Boolean('') === false);
__STATIC_ASSERT(Boolean('abc') === true);
__STATIC_ASSERT(Boolean(0) === false);
__STATIC_ASSERT(Boolean(1) === true);
```
```;

// TEST: conversion to string
__STATIC_ASSERT(typeof String(__BOOLEAN__) === 'string');
__STATIC_ASSERT(typeof String(__STRING__) === 'string');
__STATIC_ASSERT(typeof String(__NUMBER__) === 'string');
```
```;

// TEST: conversion to number
__STATIC_ASSERT(typeof Number(__BOOLEAN__) === 'number');
__STATIC_ASSERT(typeof Number(__STRING__) === 'number');
__STATIC_ASSERT(typeof Number(__NUMBER__) === 'number');
```
```;

// TEST: conversion argument errors
Number(__NUMBER__, 1, 2, 3);
Number(__NUMBER__, 1, 2);
Number();
String(__STRING__, 1, 2, 3);
String(__STRING__, 1, 2);
String();
Boolean(__BOOLEAN__, 1, 2, 3);
Boolean(__BOOLEAN__, 1, 2);
Boolean();
```
input:2:0:error: invalid number of arguments 4, expected 1
input:3:0:error: invalid number of arguments 3, expected 1
input:4:0:error: invalid number of arguments 0, expected 1
input:5:0:error: invalid number of arguments 4, expected 1
input:6:0:error: invalid number of arguments 3, expected 1
input:7:0:error: invalid number of arguments 0, expected 1
input:8:0:error: invalid number of arguments 4, expected 1
input:9:0:error: invalid number of arguments 3, expected 1
input:10:0:error: invalid number of arguments 0, expected 1
```;

// TEST: conversion failure
Number(null);
```
input:2:0:error: null can not be converted to a number
```;
