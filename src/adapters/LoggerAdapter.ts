import { isPlainObject } from 'lodash';
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
  [SupportedLogLevels.Debug]: 6,
};

interface LogMessage {
  args: Array<any>,
  level: SupportedLogLevels,
  prefix?: string,
  date: Date,
}

abstract class LoggerAdapter {
  public readonly logLevel: number;
  public readonly skipTimestamps: boolean;

  public constructor(params: Config) {
    this.logLevel = LogLevelPriorities[params.logLevel];
    this.skipTimestamps = Boolean(params.skipTimestamps);
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

  protected serializeDataIfNecessary(anArg: unknown): unknown {
    if (isPlainObject(anArg) || Array.isArray(anArg)) {
      // https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-521460510
      return JSON.stringify(anArg, (key, value) => (typeof value === 'bigint'
        ? value.toString()
        : value));
    }
    return anArg;
  }

  abstract log(message: LogMessage): void;
}


export {
  LoggerAdapter,
  LogMessage,
  Config as LoggerAdapterConfig,
  LogLevelPriorities,
};
