import { SupportedLogLevels } from '../Logger';
import { LogLevels } from '../LoggerFactory';

type Config = {
  logLevel: LogLevels;
  skipTimestamps?: boolean;
}

const LogLevelPriorities = {
  [SupportedLogLevels.Silent]: 0,
  [SupportedLogLevels.System]: 1,
  [SupportedLogLevels.Error]: 2,
  [SupportedLogLevels.Warn]: 3,
  [SupportedLogLevels.Info]: 4,
  [SupportedLogLevels.Debug]: 5,
};

interface LogMessage {
  args: Array<>,
  level: SupportedLogLevels,
  prefix?: string,
  date: Date,
}

interface Interface {
  logLevel: number;
  log(message: LogMessage): void,
}

class LoggerAdapter implements Interface {
  public readonly logLevel: number;
  public readonly skipTimestamps: boolean;

  constructor(props: Config) {
    this.logLevel = LogLevelPriorities[props.logLevel];
    this.skipTimestamps = props.skipTimestamps;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(message: LogMessage): void {
    throw new Error('Abstract!');
  }
}

export {
  LoggerAdapter,
  Interface as LoggerAdapterInterface,
  LogMessage,
  Config as LoggerAdapterConfig,
  LogLevelPriorities,
};
