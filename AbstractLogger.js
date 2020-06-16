/* eslint-disable no-unused-vars */
'use strict';

const assert = require('assert');

class AbstractLogger {
  static get LOG_LEVELS() {
    return {
      OFF: 'off',
      SYSTEM: 'system',
      ERROR: 'error',
      WARN: 'warn',
      INFO: 'info',
      DEBUG: 'debug',
    };
  }

  static get LOG_LEVELS_WEIGHT() {
    return {
      OFF: 0,
      SYSTEM: 1,
      ERROR: 2,
      WARN: 3,
      INFO: 4,
      DEBUG: 5,
    };
  }

  constructor({ prefix, logLevel: providedLogLevel } = {}) {
    this._prefix = '';

    if (prefix !== undefined) {
      assert(typeof prefix === 'string');
      this._prefix = prefix;
    }

    const logLevels = Object.values(AbstractLogger.LOG_LEVELS);
    assert(logLevels.includes(providedLogLevel), `Invalid logLevel provided - ${providedLogLevel}. Possible values: ${logLevels.join(', ')}`);

    const index = Object.values(AbstractLogger.LOG_LEVELS).indexOf(providedLogLevel);
    const key = Object.keys(AbstractLogger.LOG_LEVELS)[index];

    this._logLevel = AbstractLogger.LOG_LEVELS_WEIGHT[key];
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
}

module.exports = AbstractLogger;
