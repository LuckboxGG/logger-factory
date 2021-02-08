import ConsoleLoggerAdapter from './adapters/ConsoleLoggerAdapter';
import SentryLoggerAdapter, { SentryConfig, SentrySettings } from './adapters/SentryLoggerAdapter';
import assert from 'assert';
import { Logger, SupportedLogLevels } from './Logger';
import { CommonAdapterSettings, LoggerAdapter, LoggerAdapterConfig } from './adapters/LoggerAdapter';

enum SupportedAdapters {
  Console = 'console',
  Sentry = 'sentry',
}

type AdapterSettings = CommonAdapterSettings | SentrySettings

interface ConstructorParams {
  adapters: Array<AdapterSettings>,
}

class LoggerFactory {
  private readonly logLevel: SupportedLogLevels;
  private readonly adapters: Array<LoggerAdapter>;

  constructor({
    adapters = [],
  }: ConstructorParams) {
    this.adapters = [];
    const supportedAdapterValues = Object.values(SupportedAdapters) as Array<string>;
    for (const adapter of adapters) {
      assert(
        supportedAdapterValues.includes(adapter.name),
        `Invalid adapter - ${adapter}. Supported: ${supportedAdapterValues}`,
      );
      assert(adapter.config);

      switch (adapter.name) {
        case SupportedAdapters.Console:
          this.adapters.push(new ConsoleLoggerAdapter(adapter.config as LoggerAdapterConfig));
          break;
        case SupportedAdapters.Sentry:
          this.adapters.push(new SentryLoggerAdapter(adapter.config as SentryConfig));
          break;
      }
    }
  }

  create(prefix?: string): Logger {
    if (prefix !== undefined) {
      assert(typeof prefix === 'string' && prefix.length > 0, `Invalid prefix provided - ${prefix}. It must be non-empty string or undefined`);
    }

    return new Logger({
      adapters: this.adapters,
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
