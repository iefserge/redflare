'use strict';
const test = require('ava');
const syntax = require('../../syntax');

test('__STATIC_ASSERT does nothing at runtime', t => {
  __STATIC_ASSERT();
  __STATIC_ASSERT(1, 2, 3, 4);
  __STATIC_ASSERT(true === false);
});

test('Special values are not available at runtime', t => {
  t.throws(() => {
    __NUMBER__;
  });

  t.throws(() => {
    __STRING__;
  });

  t.throws(() => {
    __BOOLEAN__;
  });
});
