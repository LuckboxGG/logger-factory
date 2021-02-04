/* eslint-disable no-console */
import * as Sentry from '@sentry/node';
import { LoggerAdapter, LogMessage } from './LoggerAdapter';
import MessageFormatter from '../MessageFormatter';

type Config = {
  dsn: string;
  tracesSampleRate: number;
  environment: string;
}

class SentryLoggerAdapter implements LoggerAdapter {
  constructor(props: Config) {
    Sentry.init({
      dsn: props.dsn,
      tracesSampleRate: props.tracesSampleRate,
      environment: props.environment,
      debug: true,
    });
  }

  log(message: LogMessage) {
    const messageFormatter = new MessageFormatter();
    const formattedMessage = messageFormatter.format(message).join();
    Sentry.setTag('prefix', message.prefix);
    Sentry.captureMessage(formattedMessage);
    // todo sentry implementation
  }
}

export default SentryLoggerAdapter;
export {
  Config as SentryConfig,
};
