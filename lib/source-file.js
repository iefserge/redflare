'use strict';
const acorn = require('acorn');
const fs = require('fs');

/**
 * JavaScript source file that has name and content.
 */
class SourceFile {
  /**
   * Construct new file using filename and content strings.
   *
   * @param {string} filename File name, usually full file path.
   * @param {string} content File content, JavaScript code.
   */
  constructor(filename, content) {
    this._filename = filename;
    this._content = content;
    this._lines = content.split('\n');
    this._ast = null;
  }

  /**
   * Get filename.
   * @returns {string} File name.
   */
  filename() {
    return this._filename;
  }

  /**
   * Get array of source code lines.
   * @returns {string[]} Source code lines.
   */
  lines() {
    return this._lines;
  }

  /**
   * Parse source and return abstract syntax tree.
   * @returns {object} Abstract syntax tree.
   */
  ast() {
    if (!this._ast) {
      this._ast = acorn.parse(this._content, {
        ecmaVersion: 6,
        locations: true
      });
    }

    return this._ast;
  }
}

module.exports = SourceFile;
