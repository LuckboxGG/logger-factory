import * as Sentry from '@sentry/node';
import { isPlainObject, partition } from 'lodash';
import { LoggerAdapter, LoggerAdapterInterface, LogMessage, LoggerAdapterConfig } from './LoggerAdapter';

type Config = LoggerAdapterConfig & {
  dsn: string;
  tracesSampleRate: number;
  environment: string;
  debug?: boolean;
}

class SentryLoggerAdapter extends LoggerAdapter implements LoggerAdapterInterface {
  constructor(props: Config) {
    super(props);
    Sentry.init({
      dsn: props.dsn,
      tracesSampleRate: props.tracesSampleRate,
      environment: props.environment,
      debug: props.debug,
    });
  }

  public log(message: LogMessage): void {
    let formattedArgs = [];
    if (!this.skipTimestamps) {
      formattedArgs.push(this.formatDate(message.date));
    }
    const [ exceptions, messagesAndObjects ] = partition(message.args, (anArg) => anArg instanceof Error);

    Sentry.setTag('prefix', message.prefix);
    Sentry.setTag('logLevel', message.level);

    if (messagesAndObjects.length > 0) {
      formattedArgs = [
        ...formattedArgs,
        ...messagesAndObjects.map((anArg) => (isPlainObject(anArg) || Array.isArray(anArg) ? JSON.stringify(anArg) : anArg)),
      ];
      Sentry.captureMessage(formattedArgs.join(' '));
    }

    if (exceptions.length > 0) {
      for (const anException of exceptions) {
        Sentry.captureException(anException);
      }
    }
  }

  private formatDate(date: Date): string {
    const month: string = ((date.getMonth() + 1).toString()).padStart(2, '0');
    const day: string = date.getDate().toString().padStart(2, '0');
    const hour: string = date.getHours().toString().padStart(2, '0');
    const min: string = date.getMinutes().toString().padStart(2, '0');
    const sec: string = date.getSeconds().toString().padStart(2, '0');
    const msec: string = date.getMilliseconds().toString().padStart(3, '0');

    const str = `(${date.getFullYear()}/${month}/${day} ${hour}:${min}:${sec}.${msec})`;

    return str;
  }
}

export default SentryLoggerAdapter;
export {
  Config as SentryConfig,
};
