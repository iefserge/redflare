'use strict';
const interpreter = require('./interpreter');
const Reporter = require('./reporter');

/**
 * Program is a graph of source files linked together by
 * import/export/require references. Main source file is the
 * entry point of the program.
 */
class Program {
  /**
   * Create new program with the specific entry point source
   * file.
   *
   * @param {SourceFile} mainSourceFile Entry point source.
   */
  constructor(mainSourceFile) {
    this._mainSourceFile = mainSourceFile;
  }

  /**
   * Run static analyzer on the program. Returns reporter instance
   * that collects results.
   */
  analyze() {
    const reporter = new Reporter();
    const main = this._mainSourceFile;

    try {
      interpreter({ source: main, reporter });
    } catch (e) {
      console.log(reporter.toPrettyText());
      throw e;
    }

    return reporter;
  }
}

module.exports = Program;
