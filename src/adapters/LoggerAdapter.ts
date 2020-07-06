import { SupportedLogLevels } from '../Logger';

interface LogMessage {
  args: Array<any>,
  level: SupportedLogLevels,
  prefix: string,
  date: Date,
}

interface LoggerAdapter {
  log(message: LogMessage): void,
}

export {
  LoggerAdapter,
  LogMessage,
};
