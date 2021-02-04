import ConsoleLoggerAdapter from './adapters/ConsoleLoggerAdapter';
import SentryLoggerAdapter, { SentryConfig } from './adapters/SentryLoggerAdapter';
import assert from 'assert';
import { Logger, SupportedLogLevels } from './Logger';
import { LoggerAdapterConfig } from './adapters/LoggerAdapter';

enum SupportedAdapters {
  Console = 'console',
  Sentry = 'sentry',
}

type AdapterSomethingBetterNamed = {
  name: SupportedAdapters;
  config?: SentryConfig | LoggerAdapterConfig;
}

interface ConstructorParams {
  adapters: Array<AdapterSomethingBetterNamed>,
}

class LoggerFactory {
  private readonly logLevel: SupportedLogLevels;

  private adapters: Array<any>;

  constructor({
    adapters = [],
  } = {} as ConstructorParams) {
    this.adapters = [];
    for (const adapter of adapters) {
      const supportedAdapterValues = Object.values(SupportedAdapters) as Array<string>;
      assert(
        supportedAdapterValues.includes(adapter.name),
        `Invalid adapter - ${adapter}. Supported: ${supportedAdapterValues}`,
      );
      switch (adapter.name) {
        case SupportedAdapters.Console:
          this.adapters.push(new ConsoleLoggerAdapter(adapter.config as LoggerAdapterConfig));
          break;
        case SupportedAdapters.Sentry:
          if (!adapter.config) {
            throw new Error('Adapter config required!');
          }
          this.adapters.push(new SentryLoggerAdapter(adapter.config as SentryConfig));
          break;
      }
    }
  }

  create(prefix?: string) {
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
