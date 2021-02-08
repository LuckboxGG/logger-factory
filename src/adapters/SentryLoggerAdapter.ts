import * as Sentry from '@sentry/node';
import { partition } from 'lodash';
import { LoggerAdapter, LogMessage, LoggerAdapterConfig } from './LoggerAdapter';

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
    Sentry.setTag('logLevel', message.level);

    if (messagesAndObjects.length > 0) {
      let formattedArgs = [];
      if (!this.skipTimestamps) {
        formattedArgs.push(this.formatDate(message.date));
      }

      formattedArgs = [
        ...formattedArgs,
        ...messagesAndObjects.map((anArg) => this.serializeDataIfNecessary(anArg)),
      ];
      Sentry.captureMessage(formattedArgs.join(' '));
    }

    if (errors.length > 0) {
      for (const anError of errors) {
        Sentry.captureException(anError);
      }
    }
  }
}

export default SentryLoggerAdapter;
export {
  Config as SentryAdapterConfig,
};
