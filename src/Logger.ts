import { isPlainObject } from 'lodash';

import { LoggerAdapter } from './adapters/LoggerAdapter';

enum SupportedLogLevels {
  Silent = 'silent',
  System = 'system',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug'
}

const LOG_LEVEL_PRIORITIES = {
  [SupportedLogLevels.Silent]: 0,
  [SupportedLogLevels.System]: 1,
  [SupportedLogLevels.Error]: 2,
  [SupportedLogLevels.Warn]: 3,
  [SupportedLogLevels.Info]: 4,
  [SupportedLogLevels.Debug]: 5,
};

interface ConstructorParams {
  logLevel: string,
  adapter: LoggerAdapter,
  prefix: string,
}

class Logger {
  protected readonly priority: number;

  private readonly adapter: LoggerAdapter;

  private readonly prefix: string;

  constructor({ logLevel, adapter, prefix }: ConstructorParams) {
    this.priority = LOG_LEVEL_PRIORITIES[logLevel];
    this.adapter = adapter;

    this.prefix = prefix;
  }

  error(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Error]) {
      this.adapter.log(...this.formatArgs('error', args));
    }
  }

  warn(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Warn]) {
      this.adapter.log(...this.formatArgs('warn', args));
    }
  }

  info(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Info]) {
      this.adapter.log(...this.formatArgs('info', args));
    }
  }

  debug(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Debug]) {
      this.adapter.log(...this.formatArgs('debug', args));
    }
  }

  system(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.System]) {
      this.adapter.log(...this.formatArgs('system', args));
    }
  }

  private formatArgs(levelPrefix: string, args: Array<any>) {
    let formattedArgs = [];
    formattedArgs.push(this.getFormattedDate());
    formattedArgs.push(`[${this.prefix}]`);

    formattedArgs.push(`[${levelPrefix.toUpperCase()}]`);

    formattedArgs = [
      ...formattedArgs,
      ...args.map((anArg) => (isPlainObject(anArg) ? JSON.stringify(anArg) : anArg)),
    ];

    return formattedArgs;
  }

  private getFormattedDate(): string {
    const date = new Date();

    const month: string = ((date.getMonth() + 1).toString()).padStart(2, '0');
    const day: string = date.getDate().toString().padStart(2, '0');
    const hour: string = date.getHours().toString().padStart(2, '0');
    const min: string = date.getMinutes().toString().padStart(2, '0');
    const sec: string = date.getSeconds().toString().padStart(2, '0');
    const msec: string = date.getMilliseconds().toString().padStart(3, '0');

    const str = `(${date.getFullYear()}/${month}/${day} ${hour}:${min}:${sec}.${msec})`;

    return str;
  }
}

export {
  Logger,
  SupportedLogLevels,
};
