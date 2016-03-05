'use strict';
const chalk = require('chalk');
const acorn = require('acorn');
const pad = require('pad');
const assert = require('assert');
const LF = '\n';

const PRINT_LINES_COUNT = 2;

const MESSAGES = {
  UNCAUGHT_EXCEPTION: 'uncaught exception: $0',
  INCOMPATIBLE_TYPES_MULT: 'multiplication of $0 and $1',
  INCOMPATIBLE_TYPES_SUB: 'subtraction of $0 and $1',
  INCOMPATIBLE_TYPES_DIV: 'division of $0 by $1',
  INCOMPATIBLE_TYPES_CONCAT: 'concatenation of $0 and $1 without explicit conversion',
  INCOMPATIBLE_TYPES_ADD: 'addition of $0 and $1 without explicit conversion',
  INCOMPATIBLE_TYPES_COND_RESULT: 'conditional expression results in incompatible $0 and $1',
  DIV_ZERO: 'division by zero',
  INVOCATION_INVALID_ARGUMENTS_NUMBER: 'invalid number of arguments $0, expected $1',
  INVOCATION_INVALID_ARGUMENTS_NUMBER_OR: 'invalid number of arguments $0, expected $1 or $2',
  CONVERSION_NUMBER_FAIL: '$0 can not be converted to a number',
  STATIC_ASSERT_INVALID_MESSAGE: 'static assertion message is not a string',
  STATIC_ASSERT_UNKNOWN: 'static assertion result is unknown',
  STATIC_ASSERT_FAIL: 'static assertion failed',
  STATIC_ASSERT_FAIL_MESSAGE: 'static assertion failed "$0"',
  ID_NOT_DEFINED: '$0 is not defined'
};

class Reporter {
  constructor() {
    this._messages = [];
  }

  log(source, node, type /* , ...args */) {
    const args = Array.prototype.slice.call(arguments, 3);
    assert(type && MESSAGES[type], 'invalid message type');
    var msg = MESSAGES[type];
    args.forEach((arg, index) => void (msg = msg.replace('$' + index, arg)));
    this._messages.push({ source, node, text: msg, type: 'error' });
  }

  hasErrors() {
    return this._messages.length > 0;
  }

  toPrettyText(opts) {
    opts = opts || {};

    let out = '';

    function line(v) {
      if (opts.noColor) {
        v = chalk.stripColor(v);
      }

      out += v.trimRight() + LF;
    }

    this._messages.forEach(msg => {
      const node = msg.node;
      const lines = msg.source.lines();
      const loc = node.loc.start;
      const locStart = node.loc.start;
      const locEnd = node.loc.end;
      const errorLineCount = locEnd.line - locStart.line + 1;

      const itStart = Math.max(locStart.line - 1 - PRINT_LINES_COUNT, 0);
      const itEnd = Math.min(locStart.line - 1 + errorLineCount + PRINT_LINES_COUNT, lines.length);
      const maxNumberLength = String(itEnd).length + 1;

      const lineSeparator = '| ';
      const emptyPadding = chalk.blue(pad(maxNumberLength, '') + lineSeparator);

      line(chalk.bold.underline(msg.source.filename() + ':' + loc.line + ':' + loc.column));

      for (let i = itStart; i < itEnd; i++) {
        line(chalk.blue(pad(maxNumberLength, String(i + 1)) + lineSeparator) + lines[i]);

        if (i >= locStart.line - 1 && i < locStart.line - 1 + errorLineCount) {
          if (errorLineCount === 1) {
            line(emptyPadding + ' '.repeat(locStart.column) +
              chalk.bold('^'.repeat(locEnd.column - locStart.column)));
            line(emptyPadding + ' '.repeat(locStart.column) + chalk.red(`${msg.type}: ${msg.text}`));
          } else {
            if (i === locStart.line - 1) {
              line(emptyPadding + ' '.repeat(locStart.column) +
                chalk.bold('^'.repeat(lines[i].length - locStart.column)));
            } else if (i === locStart.line - 1 + errorLineCount - 1) {
              line(emptyPadding + chalk.bold('^'.repeat(locEnd.column)));
              line(emptyPadding + chalk.red(`${msg.type}: ${msg.text}`));
            } else {
              line(emptyPadding + chalk.bold('^'.repeat(lines[i].length)));
            }
          }
        }
      }
    });

    return out;
  }

  toText() {
    let result = '';
    this._messages.forEach(msg => {
      const node = msg.node;
      const loc = node.loc.start;
      result += `${msg.source.filename()}:${String(loc.line)}:${String(loc.column)}:${msg.type}: ${msg.text}\n`;
    });

    return result;
  }
}

module.exports = Reporter;
