import ConsoleLoggerAdapter from './adapters/ConsoleLoggerAdapter';
import assert from 'assert';
import { Logger, SupportedLogLevels } from './Logger';

interface ConstructorParams {
  logLevel: SupportedLogLevels,
  adapter: string,
}

enum SupportedAdapters {
  Console = 'console'
}

class LoggerFactory {
  private readonly logLevel: SupportedLogLevels;

  private readonly adapter: any;

  constructor({ logLevel, adapter }: ConstructorParams) {
    if (!Object.values(SupportedLogLevels).includes(logLevel)) {
      console.log(`Invalid loglevel provided - ${logLevel}, falling back to ${SupportedLogLevels.Silent}`);
      this.logLevel = SupportedLogLevels.Silent;
    } else {
      this.logLevel = logLevel as SupportedLogLevels;
    }

    const supportedAdapterValues = Object.values(SupportedAdapters) as Array<string>;
    assert(
      supportedAdapterValues.includes(adapter.toLowerCase()),
      `Invalid adapter - ${adapter}. Supported: ${Object.values(supportedAdapterValues).join(',')}`,
    );
    switch (adapter.toLowerCase()) {
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
