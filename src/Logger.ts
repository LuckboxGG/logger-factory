import { LoggerAdapter, LOG_LEVEL_PRIORITIES } from './adapters/LoggerAdapter';

enum SupportedLogLevels {
  Silent = 'silent',
  System = 'system',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug'
}

interface ConstructorParams {
  logLevel: string,
  adapters: Array<LoggerAdapter>,
  prefix?: string,
}

class Logger {
  protected readonly priority: number;

  private readonly adapters: Array<LoggerAdapter>;

  private readonly prefix?: string;

  constructor({ prefix, adapters }: ConstructorParams) {
    this.adapters = adapters;
    this.prefix = prefix;
  }

  error(...args: Array<any>) {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Error]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Error));
      }
    }
  }

  warn(...args: Array<any>) {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Warn]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Warn));
      }
    }
  }

  info(...args: Array<any>) {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Info]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Info));
      }
    }
  }

  debug(...args: Array<any>) {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.Debug]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Debug));
      }
    }
  }

  system(...args: Array<any>) {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LOG_LEVEL_PRIORITIES[SupportedLogLevels.System]) {
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
