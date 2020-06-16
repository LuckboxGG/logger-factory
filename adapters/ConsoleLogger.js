/* eslint-disable no-console */
'use strict';

const AbstractLogger = require('../AbstractLogger');

class ConsoleLogger extends AbstractLogger {
  error() {
    if (this._logLevel.weight >= ConsoleLogger.LEVELS.ERROR.weight) {
      console.error(...this._formatArgs(['[ERROR]', ...arguments]));
    }
  }

  warn() {
    if (this._logLevel.weight >= ConsoleLogger.LEVELS.WARN.weight) {
      console.warn(...this._formatArgs(['[WARN]', ...arguments]));
    }
  }

  debug() {
    if (this._logLevel.weight >= ConsoleLogger.LEVELS.DEBUG.weight) {
      console.log(...this._formatArgs(['[DEBUG]', ...arguments]));
    }
  }

  info() {
    if (this._logLevel.weight >= ConsoleLogger.LEVELS.INFO.weight) {
      console.info(...this._formatArgs(['[INFO]', ...arguments]));
    }
  }

  system() {
    if (this._logLevel.weight >= ConsoleLogger.LEVELS.SYSTEM.weight) {
      console.log(...this._formatArgs(['[SYSTEM]', ...arguments]));
    }
  }

  clear() {
    console.clear();
  }
}

module.exports = ConsoleLogger;
