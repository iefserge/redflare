# Redflare

Experimental early work-in-progress JavaScript static analyzer tool.

Design goals:

* **Full program analyzer** Tool should work with the entire program codebase to produce the best results. This allows to track every call site of each function and highlight all the dead code.
* **No extra syntax** It shouldn't introduce any custom type definitions or annotations. Platform or library APIs should be defined using standard JavaScript.
* **Static assertions** Adds static assertions to JavaScript, a way to ensure conditions are always true without running the program.

## Installation

The fastest way to get started is to install Redflare CLI globally.

```bash
npm install redflare -g
```

## Usage

First, make sure you use modern version of Node like v4 or newer. Redflare needs program entry point as an input (for now there is no support for `require()` so all code needs to be in one file):

```bash
redflare index.js
```

Example:

```js
function foo(x) {
  return x / 5;
}

foo('string');
```

outputs:

```
index.js:2:9
 1| function foo(x) {
 2|   return x / 5;
  |          ^^^^^
  |          error: division of string by number
 3| }
 4|
```

## Static assertions

Redflare adds global static assertion function `__STATIC_ASSERT(expr[, message])`. Expression needs to evaluate into known at analysis-time truthy value or error will be reported. It's also useful to add type checks to the code.

```js
__STATIC_ASSERT(true);
__STATIC_ASSERT(true === true, 'this should be true');
__STATIC_ASSERT(typeof value === 'string', 'value should be a string');
__STATIC_ASSERT(typeof value === 'number' && value > 0, 'value should be a positive number');
```

## How does it work?

Redflare is an [abstract interpreter](https://en.wikipedia.org/wiki/Abstract_interpretation) JavaScript VM that operates on abstract values instead of an actual values. For example, `<any number>`, `<positive number>`, `<any boolean>` or just `<any>` are all valid abstract values.
JavaScript operators can be defined in terms of abstract values, like expression `(<any number> + <any number>)` results in another `<any number>`, so we can easily infer result values or types of expressions. As another example, `typeof <any number>` results in actual value `number`.

## Todo

- Add all the missing operators
- Loops (for, for-of, for-in, do-while, while)
- Objects/arrays/tuples
- More builtin functions
- require() / import
- Function side-effect analysis
- Event loop, setTimeout etc
- More consistent and configurable errors
- ES2015 support

## License

MIT
