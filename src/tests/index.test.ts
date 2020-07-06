import { LoggerFactory, Adapters, LogLevels } from '../index';
import { AssertionError } from 'assert';

describe('LoggerFactory', () => {
  const constructorParams = {
    logLevel: LogLevels.Debug,
    adapter: Adapters.Console,
  };

  describe('Factory construction', () => {
    it('should not throw when calling without params', () => {
      expect(() => new LoggerFactory()).not.toThrow();
    });

    it.each([
      null, 'unknown',
    ])('should throw AssertionError when passing level - %s', (level) => {
      expect(() => new LoggerFactory({
        ...constructorParams,
        logLevel: level as LogLevels,
      })).toThrow(AssertionError);
    });

    it.each([
      ...Object.values(LogLevels), undefined,
    ])('should not throw when passing level - %s', (level) => {
      expect(() => new LoggerFactory({
        ...constructorParams,
        logLevel: level,
      })).not.toThrow();
    });

    it.each([
      null, 'unknown',
    ])('should throw AssertionError when passing adapter - %s', (adapter) => {
      expect(() => new LoggerFactory({
        ...constructorParams,
        adapter: adapter as Adapters,
      })).toThrow(AssertionError);
    });

    it.each([
      ...Object.values(Adapters), undefined,
    ])('should not throw AssertionError when passing adapter - %s', (adapter) => {
      expect(() => new LoggerFactory({
        ...constructorParams,
        adapter: adapter as Adapters,
      })).not.toThrow();
    });
  });

  const loggerFactory = new LoggerFactory(constructorParams);
  const logger = loggerFactory.create('MyClass');

  describe('Logger creation', () => {
    it.each([
      null, '', 1,
    ])('should throw AssertionError when passing prefix - %s', (prefix) => {
      expect(() => loggerFactory.create(prefix as string)).toThrow(AssertionError);
    });

    it.each([
      undefined, 'MyClass', 'MyOtherClass',
    ])('should not throw AssertionError when passing prefix - %s', (prefix) => {
      expect(() => loggerFactory.create(prefix)).not.toThrow();
    });
  });

  describe('Logging [console]*', () => {
    const spiedConsoleLog = jest.spyOn(console, 'log');

    afterEach(() => {
      spiedConsoleLog.mockClear();
    });

    const orderedLogLevels = [
      LogLevels.System,
      LogLevels.Error,
      LogLevels.Warn,
      LogLevels.Info,
      LogLevels.Debug,
    ];

    for (const level of orderedLogLevels) {
      const index = orderedLogLevels.indexOf(level);
      const overlappedMethods = orderedLogLevels.slice(0, index + 1);
      const nonOverlappedMethods = orderedLogLevels.slice(index + 1);

      const customLevelLoggerFactory = new LoggerFactory({
        logLevel: level,
        adapter: Adapters.Console,
      });
      const customLogger = customLevelLoggerFactory.create('MyClass');

      if (overlappedMethods.length) {
        it.each(overlappedMethods)(`should call the console.log when calling logger.%s [${level}]`, (method) => {
          customLogger[method]('test');
          expect(spiedConsoleLog).toHaveBeenCalled();
        });
      }

      if (nonOverlappedMethods.length) {
        it.each(nonOverlappedMethods)(`should not call the console.log when calling logger.%s [${level}]`, (method) => {
          customLogger[method]('test');
          expect(spiedConsoleLog).not.toHaveBeenCalled();
        });
      }
    }

    const pointlessLoggerFactory = new LoggerFactory({
      logLevel: LogLevels.Silent,
      adapter: Adapters.Console,
    });
    const pointlessLogger = pointlessLoggerFactory.create('MyClass');

    it.each(orderedLogLevels)('should not call the console.log when calling logger.%s [off]', (method) => {
      pointlessLogger[method]('test');

      expect(spiedConsoleLog).not.toHaveBeenCalled();
    });

    it('should provide the formatted date as first param', () => {
      mockDate(new Date('Tue, 23 Jun 2020 14:34:56'));
      logger.info('test');
      restoreDate();

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[0]).toEqual('(2020/06/23 14:34:56.000)');
    });

    it('should provide the prefix as second param', () => {
      logger.info('test');

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[1]).toEqual('[MyClass]');
    });

    it('should not provide prefix when it is omitted', () => {
      mockDate(new Date('Tue, 23 Jun 2020 14:34:56'));
      const noPrefixLogger = loggerFactory.create();
      noPrefixLogger.info('test');
      restoreDate();

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[0]).toEqual('(2020/06/23 14:34:56.000)');
      expect(lastCallArgs[1]).toEqual('[INFO]');
      expect(lastCallArgs[2]).toEqual('test');
      expect(lastCallArgs.length).toEqual(3);
    });

    it('should provide the upper-cased level as third param', () => {
      logger.info('test');

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[2]).toEqual('[INFO]');
    });

    it('should provide the data as last params', () => {
      logger.info('te', 'st');

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[3]).toEqual('te');
      expect(lastCallArgs[4]).toEqual('st');
    });

    it.each([
      { bar: 'foo' },
      [1, 2, 3.14],
    ])('should stringify %p', (input) => {
      logger.info(input);

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[3]).toEqual(JSON.stringify(input));
    });
  });
});


let RealDate: any;
function mockDate(date: Date) {
  RealDate = Date;
  (global as any).Date = class extends RealDate {
    constructor() {
      super();
      return date;
    }
  };
}

function restoreDate() {
  global.Date = RealDate;
}
