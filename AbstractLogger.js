/* eslint-disable no-unused-vars */
'use strict';

const assert = require('assert');

class AbstractLogger {
  static get LEVELS() {
    return {
      OFF: {
        code: 'off',
        weight: 0,
      },
      SYSTEM: {
        code: 'system',
        weight: 1,
      },
      ERROR: {
        code: 'error',
        weight: 2,
      },
      WARN: {
        code: 'warn',
        weight: 3,
      },
      INFO: {
        code: 'info',
        weight: 4,
      },
      DEBUG: {
        code: 'debug',
        weight: 5,
      },
    }
  }

  constructor({ prefix, logLevel: providedLogLevel } = {}) {
    this._prefix = '';

    if (prefix !== undefined) {
      assert(typeof prefix === 'string');
      this._prefix = prefix;
    }

    this._logLevel = this._determineLogLevel(providedLogLevel);
  }

  debug(message) {
    throw new Error('Abstract method!');
  }

  error(message) {
    throw new Error('Abstract method!');
  }

  info(message) {
    throw new Error('Abstract method!');
  }

  warn(message) {
    throw new Error('Abstract method!');
  }

  system(message) {
    throw new Error('Abstract method!');
  }

  clear() {
    throw new Error('Abstract method!');
  }

  get logLevel() {
    return this._logLevel.code;
  }

  _formatArgs(args) {
    let formattedArgs = [];
    formattedArgs.push(this._getFormattedDate());

    if (this._prefix) {
      formattedArgs.push(`[${this._prefix}]`);
    }

    formattedArgs = [...formattedArgs, ...args];

    return formattedArgs;
  }

  _getFormattedDate() {
    let date = new Date();

    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let msec = date.getMilliseconds();

    month = (month < 10 ? '0' : '') + month;
    day = (day < 10 ? '0' : '') + day;
    hour = (hour < 10 ? '0' : '') + hour;
    min = (min < 10 ? '0' : '') + min;
    sec = (sec < 10 ? '0' : '') + sec;

    if (msec < 100) {
      if (msec < 10) {
        msec = '0' + msec;
      }

      msec = '0' + msec;
    }

    let str = `(${date.getFullYear()}/${month}/${day} ${hour}:${min}:${sec}.${msec})`;

    return str;
  }

  _determineLogLevel(providedLogLevel) {
    const foundLogLevel = Object.values(AbstractLogger.LEVELS).find(aLevel => aLevel.code === providedLogLevel);
    assert(foundLogLevel, `Invalid logLevel provided - ${providedLogLevel}. Possible values: ${this._getAllowedLogLevelValues()}`);

    return foundLogLevel;
  }

  _getAllowedLogLevelValues () {
    return Object.values(AbstractLogger.LEVELS).map((aLevel) => aLevel.code).join(', ');
  }
}

module.exports = AbstractLogger;
