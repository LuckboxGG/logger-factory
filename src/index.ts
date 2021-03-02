import { LoggerFactory, Adapters, LogLevels, ConsoleAdapterSettings, SentryAdapterSettings } from './LoggerFactory';
import { Logger } from './Logger';

function obfuscateSecret(value: string | number) {
  return `[SECRET]${value}[/SECRET]`;
}

function obfuscatePii(value: string | number) {
  return `[PII]${value}[/PII]`;
}

export {
  LoggerFactory,
  Adapters,
  LogLevels,
  Logger,
  ConsoleAdapterSettings,
  SentryAdapterSettings,
  obfuscateSecret,
  obfuscatePii,
};
