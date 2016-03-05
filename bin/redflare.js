#!/usr/bin/env node

'use strict';
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Program = require('../api').Program;
const SourceFile = require('../api').SourceFile;
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(chalk.red('error: no input script'));
  process.exit(1);
  return;
}

const mainFilePath = path.resolve(args[0]);
let mainFileContent = '';

try {
  mainFileContent = fs.readFileSync(mainFilePath, 'utf8');
} catch (e) {
  console.log(e);
  console.error(chalk.red('error: cannot read script file "' + mainFilePath + '"'));
  process.exit(1);
  return;
}

const main = new SourceFile(mainFilePath, mainFileContent);
const p = new Program(main);
const reporter = p.analyze();
const out = reporter.toPrettyText();

if (out) {
  console.log(out);
}

if (reporter.hasErrors()) {
  process.exit(1);
}
