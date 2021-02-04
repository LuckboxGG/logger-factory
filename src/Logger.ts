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
  adapters: Array<LoggerAdapter>,
  prefix?: string,
}

class Logger {
  protected readonly priority: number;

  private readonly adapters: Array<LoggerAdapter>;

  private readonly prefix?: string;

  constructor({ logLevel, prefix, adapters }: ConstructorParams) {
    this.priority = LOG_LEVEL_PRIORITIES[logLevel];
    this.adapters = adapters;
    this.prefix = prefix;
  }

  error(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Error]) {
      for (const adapter of this.adapters) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Error));
      }
    }
  }

  warn(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Warn]) {
      for (const adapter of this.adapters) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Warn));
      }
    }
  }

  info(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Info]) {
      for (const adapter of this.adapters) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Info));
      }
    }
  }

  debug(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Debug]) {
      for (const adapter of this.adapters) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Info));
      }
    }
  }

  system(...args: Array<any>) {
    if (this.priority >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.System]) {
      for (const adapter of this.adapters) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.System));
      }
    }
  }

  private constructLogMessage(args: Array<any>, level: SupportedLogLevels) {
    return {
      args,
      level,
      date: new Date(),
      prefix: this.prefix,
    };
  }
}

export {
  Logger,
  SupportedLogLevels,
};
