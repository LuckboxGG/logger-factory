/* eslint-disable no-console */
import { LoggerAdapter } from './LoggerAdapter';

class ConsoleLoggerAdapter implements LoggerAdapter {
  log(...args: Array<any>) {
    console.log(...args);
  }
}

export default ConsoleLoggerAdapter;
