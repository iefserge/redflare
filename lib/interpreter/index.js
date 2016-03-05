'use strict';
const block = require('./block');
const Stack = require('./stack');
const builtins = require('./builtins');
const Scope = require('./scope').Scope;

module.exports = function(opts) {
  const source = opts.source;
  const reporter = opts.reporter;
  const stack = new Stack();

  const state = { source, reporter, stack, globalScope: null };
  builtins.setupContext(state);
  stack.pushFunctionScope(state.globalScope);
  const maybeResult = block.evaluateBlock(state, source.ast())[1];
  stack.popFunctionScope();

  if (maybeResult && maybeResult.isException()) {
    const data = maybeResult.data();
    reporter.log(data.source, data.node, 'UNCAUGHT_EXCEPTION', maybeResult.exceptionValue().value());
  }
};
