'use strict';
/*
 * This loads tests from each file in the "inputs/" directory. File
 * can contain multiple tests, they are separated by three backticks and
 * a semicolon "```;". JavaScript source inputs and analyzer outputs
 * are separated by three backticks "```". This way syntax highlighting
 * works in any editor that supports ES6.
 *
 * Optionally, each test can contain comment line "// TEST: <name>"
 * that specifies test name to display.
 *
 * Format:
 *
 * // TEST: test1
 * <js code input>
 * ```
 * <expected outputs>
 * ```;
 *
 * // TEST: test2
 * <js code input>
 * ```
 * <expected outputs>
 * ```;
 */

const test = require('ava');
const fs = require('fs');
const chalk = require('chalk');
const util = require('util');
const path = require('path');
const Program = require('../lib/program');
const SourceFile = require('../lib/source-file');
const files = fs.readdirSync(path.resolve(__dirname, 'inputs'));
const testFiles = files
  .filter(file => file !== 'index.js');
  // .filter(x=>x==='throw.js');

testFiles.forEach(file => {
  const stats = fs.statSync(path.resolve(__dirname, 'inputs', file));
  if (!stats.isFile()) {
    return;
  }

  const name = file.replace(/\.js$/, '');

  test(name, t => {
    const originalConsoleLog = console.log;
    const logs = [];
    console.log = function(...args) {
      logs.push(args);
    };

    const content = fs.readFileSync(path.resolve(__dirname, 'inputs', file), 'utf-8');
    const testContent = content.split('```;');

    testContent.map(c => {
      const trimmed = c.trimLeft();
      if (trimmed.length === 0) {
        return;
      }

      const lines = trimmed.split('\n');
      const separatorLine = lines.indexOf('```');
      if (separatorLine === -1) {
        throw new Error('invalid test format in "' + file + '"');
      }

      const inputLines = lines.slice(0, separatorLine);
      const testName = inputLines
        .filter(ln => ln.startsWith('// TEST: '))
        .map(ln => ln.slice(9)).join(' ');

      const input = inputLines.join('\n');
      const output = lines.slice(separatorLine + 1).join('\n');
      const src = new SourceFile('input', input);
      const p = new Program(src);
      const report = p.analyze();
      t.same(report.toText().trim(), output.trim(), testName || 'actual output matches expected');
    });

    console.log = originalConsoleLog;
    logs.forEach(args => console.log(
      chalk.gray('    ' + file) + ' ' +
      chalk.yellow(args.map(arg => util.format(arg)).join(' '))
    ));
  });
});
