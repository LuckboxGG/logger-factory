import * as Sentry from '@sentry/node';
import { partition } from 'lodash';
import { LoggerAdapter, LogMessage, LoggerAdapterConfig } from './LoggerAdapter';
import { LogLevels } from '../LoggerFactory';

type Config = LoggerAdapterConfig & {
  dsn: string;
  environment: string;
  debug?: boolean;
}

class SentryLoggerAdapter extends LoggerAdapter {
  constructor(params: Config) {
    super(params);
    Sentry.init({
      dsn: params.dsn,
      tracesSampleRate: 1,
      environment: params.environment,
      debug: Boolean(params.debug),
    });
  }

  public log(message: LogMessage): void {
    const [ errors, messagesAndObjects ] = partition(message.args, (anArg) => anArg instanceof Error);

    Sentry.setTag('prefix', message.prefix);

    if (messagesAndObjects.length > 0) {
      const severity = this.mapLogLevelToSeverity(message.level);
      if (!severity) {
        return;
      }
      let formattedArgs = [];
      if (!this.skipTimestamps) {
        formattedArgs.push(this.formatDate(message.date));
      }

      formattedArgs = [
        ...formattedArgs,
        ...messagesAndObjects.map((anArg) => this.serializeDataIfNecessary(anArg)),
      ];
      Sentry.captureMessage(formattedArgs.join(' '), severity);
    }

    if (errors.length > 0) {
      for (const anError of errors) {
        Sentry.captureException(anError);
      }
    }
  }

  private mapLogLevelToSeverity(logLevel: LogLevels) {
    switch (logLevel) {
      case LogLevels.Warn:
        return Sentry.Severity.Warning;
      case LogLevels.Error:
        return Sentry.Severity.Error;
      case LogLevels.Info:
        return Sentry.Severity.Info;
      case LogLevels.Debug:
        return Sentry.Severity.Debug;
      case LogLevels.System:
        return Sentry.Severity.Log;
    }
  }
}

export default SentryLoggerAdapter;
export {
  Config as SentryAdapterConfig,
};
