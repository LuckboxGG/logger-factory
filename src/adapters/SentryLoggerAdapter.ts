import * as Sentry from '@sentry/node';
import { isPlainObject, partition } from 'lodash';
import { LoggerAdapter, LogMessage, LoggerAdapterConfig } from './LoggerAdapter';

type Config = LoggerAdapterConfig & {
  dsn: string;
  environment: string;
  debug?: boolean;
}

type Settings = {
  name: 'sentry',
  config: Config,
}

class SentryLoggerAdapter extends LoggerAdapter {
  constructor(props: Config) {
    super(props);
    Sentry.init({
      dsn: props.dsn,
      tracesSampleRate: 1,
      environment: props.environment,
      debug: props.debug,
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
        ...messagesAndObjects.map((anArg) => (isPlainObject(anArg) || Array.isArray(anArg) ? JSON.stringify(anArg) : anArg)),
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
  Config as SentryConfig,
  Settings as SentrySettings,
};
