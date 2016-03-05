'use strict';
const test = require('ava');
const Reporter = require('../../lib/reporter');
const SourceFile = require('../../lib/source-file');

const src = new SourceFile('input.js', `
  function foo(x) {
    return 10 + bar(x);
  }

  function bar(x) {
    return x +
      'hello world';
  }

  function baz(x) {
    return 10 +
      'hello' +
      ', ' +
      'world';
  }
`);

test('print 1-line error code snippet', t => {
  const r = new Reporter();
  const node = {
    loc: {
      start: { line: 3, column: 4 },
      end: { line: 3, column: 10 }
    }
  };
  r.log(src, node, 'UNCAUGHT_EXCEPTION', 'okok');

  t.same(r.toText(), 'input.js:3:4:error: uncaught exception: okok\n');

  const expected = `input.js:3:4
 1|
 2|   function foo(x) {
 3|     return 10 + bar(x);
  |     ^^^^^^
  |     error: uncaught exception: okok
 4|   }
 5|
`;

  const out = r.toPrettyText({ noColor: true });
  t.same(out, expected);
});

test('should print 2-line error code snippet', t => {
  const r = new Reporter();
  const node = {
    loc: {
      start: { line: 7, column: 4 },
      end: { line: 8, column: 19 }
    }
  };
  r.log(src, node, 'UNCAUGHT_EXCEPTION', 'okok');

  t.same(r.toText(), 'input.js:7:4:error: uncaught exception: okok\n');

  const expected = `input.js:7:4
  5|
  6|   function bar(x) {
  7|     return x +
   |     ^^^^^^^^^^
  8|       'hello world';
   | ^^^^^^^^^^^^^^^^^^^
   | error: uncaught exception: okok
  9|   }
 10|
`;

  const out = r.toPrettyText({ noColor: true });
  t.same(out, expected);
});

test('should print multiline error code snippet', t => {
  const r = new Reporter();
  const node = {
    loc: {
      start: { line: 12, column: 4 },
      end: { line: 15, column: 14 }
    }
  };
  t.false(r.hasErrors());
  r.log(src, node, 'UNCAUGHT_EXCEPTION', 'okok');
  t.true(r.hasErrors());

  t.same(r.toText(), 'input.js:12:4:error: uncaught exception: okok\n');

  const expected = `input.js:12:4
 10|
 11|   function baz(x) {
 12|     return 10 +
   |     ^^^^^^^^^^^
 13|       'hello' +
   | ^^^^^^^^^^^^^^^
 14|       ', ' +
   | ^^^^^^^^^^^^
 15|       'world';
   | ^^^^^^^^^^^^^^
   | error: uncaught exception: okok
 16|   }
 17|
`;

  const out = r.toPrettyText({ noColor: true });
  t.same(out, expected);
});
