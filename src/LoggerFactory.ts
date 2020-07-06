import ConsoleLoggerAdapter from './adapters/ConsoleLoggerAdapter';
import assert from 'assert';
import { Logger, SupportedLogLevels } from './Logger';

enum SupportedAdapters {
  Console = 'console',
}

interface ConstructorParams {
  logLevel: SupportedLogLevels,
  adapter: SupportedAdapters,
}

class LoggerFactory {
  private readonly logLevel: SupportedLogLevels;

  private readonly adapter: any;

  constructor({
    logLevel = SupportedLogLevels.Warn,
    adapter = SupportedAdapters.Console,
  } = {} as ConstructorParams) {
    const supportedLogLevelValues = Object.values(SupportedLogLevels);
    assert(supportedLogLevelValues.includes(logLevel), `Invalid loglevel provided - ${logLevel}. Supported: ${supportedLogLevelValues}`);
    this.logLevel = logLevel;

    const supportedAdapterValues = Object.values(SupportedAdapters) as Array<string>;
    assert(
      supportedAdapterValues.includes(adapter),
      `Invalid adapter - ${adapter}. Supported: ${supportedAdapterValues}`,
    );
    switch (adapter) {
      case SupportedAdapters.Console:
        this.adapter = ConsoleLoggerAdapter;
        break;
    }
  }

  create(prefix: string) {
    assert(typeof prefix === 'string' && prefix.length > 0, `Invalid prefix provided - ${prefix}. It must be non-empty string`);

    return new Logger({
      adapter: new this.adapter(),
      logLevel: this.logLevel,
      prefix,
    });
  }
}

export {
  LoggerFactory,
  SupportedAdapters as Adapters,
  SupportedLogLevels as LogLevels,
};
