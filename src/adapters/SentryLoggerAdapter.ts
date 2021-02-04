import * as Sentry from '@sentry/node';
import { isPlainObject } from 'lodash';
import { LogLevelPriorities, LoggerAdapter, LogMessage } from './LoggerAdapter';
import { LogLevels } from '../LoggerFactory';

type Config = {
  dsn: string;
  tracesSampleRate: number;
  environment: string;
  logLevel: LogLevels;
}

class SentryLoggerAdapter implements LoggerAdapter {
  public readonly logLevel: number;

  constructor(props: Config) {
    this.logLevel = LogLevelPriorities[props.logLevel];

    Sentry.init({
      dsn: props.dsn,
      tracesSampleRate: props.tracesSampleRate,
      environment: props.environment,
    });
  }

  public log(message: LogMessage) {
    let formattedArgs = [];
    formattedArgs.push(this.formatDate(message.date));
    formattedArgs = [
      ...formattedArgs,
      ...message.args.map((anArg) => (isPlainObject(anArg) || Array.isArray(anArg) ? JSON.stringify(anArg) : anArg)),
    ];

    Sentry.setTag('prefix', message.prefix);
    Sentry.setTag('logLevel', message.level);
    Sentry.captureMessage(formattedArgs.join(' '));
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
