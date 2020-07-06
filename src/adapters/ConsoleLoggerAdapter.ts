/* eslint-disable no-console */
import { isPlainObject } from 'lodash';
import { LoggerAdapter, LogMessage } from './LoggerAdapter';

class ConsoleLoggerAdapter implements LoggerAdapter {
  log(message: LogMessage) {
    console.log(...this.formatMessage(message));
  }

  private formatMessage(message: LogMessage) {
    let formattedArgs = [];
    formattedArgs.push(this.formatDate(message.date));
    if (message.prefix !== undefined) {
      formattedArgs.push(`[${message.prefix}]`);
    }
    formattedArgs.push(`[${message.level.toUpperCase()}]`);

    formattedArgs = [
      ...formattedArgs,
      ...message.args.map((anArg) => (isPlainObject(anArg) || Array.isArray(anArg) ? JSON.stringify(anArg) : anArg)),
    ];

    return formattedArgs;
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

export default ConsoleLoggerAdapter;
