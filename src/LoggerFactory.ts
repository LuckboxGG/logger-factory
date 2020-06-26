import ConsoleLoggerAdapter from './adapters/ConsoleLoggerAdapter';
import assert from 'assert';
import { Logger, SupportedLogLevels } from './Logger';

interface ConstructorParams {
  logLevel: SupportedLogLevels,
  adapter: string,
}

enum SupportedAdapters {
  Console = 'console',
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
    this.logLevel = logLevel as SupportedLogLevels;

    const providedAdapter = adapter.toString().toLowerCase();
    const supportedAdapterValues = Object.values(SupportedAdapters) as Array<string>;
    assert(
      supportedAdapterValues.includes(providedAdapter),
      `Invalid adapter - ${adapter}. Supported: ${supportedAdapterValues}`,
    );
    switch (providedAdapter) {
      case SupportedAdapters.Console:
        this.adapter = ConsoleLoggerAdapter; break;
    }
  }

  create(prefix: string) {
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
