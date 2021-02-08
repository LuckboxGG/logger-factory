import { SupportedLogLevels } from '../Logger';
import { LogLevels, Adapters } from '../LoggerFactory';

type Config = {
  logLevel: LogLevels;
  skipTimestamps?: boolean;
}

type Settings = {
  name: Adapters,
  config: Config,
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
  args: Array<any>,
  level: SupportedLogLevels,
  prefix?: string,
  date: Date,
}

interface Interface {
  logLevel: number;
  log(message: LogMessage): void,
}

class LoggerAdapter {
  public readonly logLevel: number;
  public readonly skipTimestamps: boolean;

  constructor(params: Config) {
    this.logLevel = LogLevelPriorities[params.logLevel];
    this.skipTimestamps = params.skipTimestamps;
  }

  protected formatDate(date: Date): string {
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

export {
  LoggerAdapter,
  Interface as LoggerAdapterInterface,
  LogMessage,
  Config as LoggerAdapterConfig,
  Settings as CommonAdapterSettings,
  LogLevelPriorities,
};
