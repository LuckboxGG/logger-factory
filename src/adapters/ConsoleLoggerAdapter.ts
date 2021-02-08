/* eslint-disable no-console */
import { LoggerAdapter, LogMessage } from './LoggerAdapter';

class ConsoleLoggerAdapter extends LoggerAdapter {
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
      ...message.args.map((anArg) => this.serializeDataIfNecessary(anArg)),
    ];

    return formattedArgs;
  }
}

export default ConsoleLoggerAdapter;
