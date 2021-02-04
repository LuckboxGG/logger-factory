import ConsoleLoggerAdapter from './adapters/ConsoleLoggerAdapter';
import SentryLoggerAdapter, { SentryConfig } from './adapters/SentryLoggerAdapter';
import assert from 'assert';
import { Logger, SupportedLogLevels } from './Logger';

enum SupportedAdapters {
  Console = 'console',
  Sentry = 'sentry',
}

interface ConstructorParams {
  logLevel: SupportedLogLevels,
  adapter: SupportedAdapters,
  adapterConfig?: SentryConfig,
}

class LoggerFactory {
  private readonly logLevel: SupportedLogLevels;

  private readonly adapter: any;

  private readonly adapterConfig: SentryConfig;

  constructor({
    logLevel = SupportedLogLevels.Warn,
    adapter = SupportedAdapters.Console,
    adapterConfig,
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
      case SupportedAdapters.Sentry:
        if (!adapterConfig) {
          throw new Error('Adapter config required!');
        }
        this.adapter = SentryLoggerAdapter;
        this.adapterConfig = adapterConfig;
        break;
    }
  }

  create(prefix?: string) {
    if (prefix !== undefined) {
      assert(typeof prefix === 'string' && prefix.length > 0, `Invalid prefix provided - ${prefix}. It must be non-empty string or undefined`);
    }

    return new Logger({
      adapter: new this.adapter(this.adapterConfig),
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
