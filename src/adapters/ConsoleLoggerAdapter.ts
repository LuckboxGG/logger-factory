/* eslint-disable no-console */
import { LoggerAdapter } from './LoggerAdapter';

class ConsoleLoggerAdapter implements LoggerAdapter {
  log(...args) {
    console.log(...args);
  }
}

export default ConsoleLoggerAdapter;
