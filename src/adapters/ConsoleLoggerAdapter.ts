/* eslint-disable no-console */
import { isPlainObject } from 'lodash';
import { LoggerAdapter, LoggerAdapterInterface, LogMessage } from './LoggerAdapter';

class ConsoleLoggerAdapter extends LoggerAdapter implements LoggerAdapterInterface {
  public log(message: LogMessage): void {
    console.log(...this.formatMessage(message));
  }

  private formatMessage(message: LogMessage) {
    let formattedArgs = [];
    if (!this.skipTimestamps) {
      formattedArgs.push(this.formatDate(message.date));
    }
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
}

export default ConsoleLoggerAdapter;
