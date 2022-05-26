import { LoggerAdapter, LogLevelPriorities } from './adapters/LoggerAdapter';

enum SupportedLogLevels {
  Silent = 'silent',
  System = 'system',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
}

interface ConstructorParams {
  logLevel: string,
  adapters: Array<LoggerAdapter>,
  prefix?: string,
}

class Logger {
  private readonly adapters: Array<LoggerAdapter>;

  private readonly prefix?: string;

  constructor({ prefix, adapters }: ConstructorParams) {
    this.adapters = adapters;
    this.prefix = prefix;
  }

  error(...args: Array<unknown>): void {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LogLevelPriorities[SupportedLogLevels.Error]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Error));
      }
    }
  }

  warn(...args: Array<unknown>): void {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LogLevelPriorities[SupportedLogLevels.Warn]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Warn));
      }
    }
  }

  info(...args: Array<unknown>): void {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LogLevelPriorities[SupportedLogLevels.Info]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Info));
      }
    }
  }

  debug(...args: Array<unknown>): void {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LogLevelPriorities[SupportedLogLevels.Debug]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.Debug));
      }
    }
  }

  system(...args: Array<unknown>): void {
    for (const adapter of this.adapters) {
      if (adapter.logLevel >= LogLevelPriorities[SupportedLogLevels.System]) {
        adapter.log(this.constructLogMessage(args, SupportedLogLevels.System));
      }
    }
  }

  private constructLogMessage(args: Array<unknown>, level: SupportedLogLevels) {
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
