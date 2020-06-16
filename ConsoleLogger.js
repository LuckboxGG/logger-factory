/* eslint-disable no-console */
'use strict';

const Logger = require('./Logger');

class ConsoleLogger extends Logger {
  error() {
    if (this._logLevel >= Logger.LOG_LEVELS_WEIGHT.ERROR) {
      console.error(...this._formatArgs(['[ERROR]', ...arguments]));
    }
  }

  warn() {
    if (this._logLevel >= Logger.LOG_LEVELS_WEIGHT.WARN) {
      console.warn(...this._formatArgs(['[WARN]', ...arguments]));
    }
  }

  debug() {
    if (this._logLevel >= Logger.LOG_LEVELS_WEIGHT.DEBUG) {
      console.log(...this._formatArgs(['[DEBUG]', ...arguments]));
    }
  }

  info() {
    if (this._logLevel >= Logger.LOG_LEVELS_WEIGHT.INFO) {
      console.info(...this._formatArgs(['[INFO]', ...arguments]));
    }
  }

  system() {
    if (this._logLevel >= Logger.LOG_LEVELS_WEIGHT.SYSTEM) {
      console.log(...this._formatArgs(['[SYSTEM]', ...arguments]));
    }
  }

  clear() {
    console.clear();
  }
}

module.exports = ConsoleLogger;
