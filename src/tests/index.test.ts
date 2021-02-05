import { LoggerFactory, Adapters, LogLevels } from '../index';
import { AssertionError } from 'assert';
import * as Sentry from '@sentry/node';

describe('LoggerFactory', () => {
  const sentryAdapterSettings =  {
    name: Adapters.Sentry,
    config: {
      dsn: 'https://somerandomstring@sentry.yoursentryserver.com/42',
      tracesSampleRate: 1.0,
      environment: 'production',
      logLevel: LogLevels.Warn,
      debug: false,
    },
  };

  const consoleAdapterSettings = {
    name: Adapters.Console,
    config: {
      logLevel: LogLevels.Debug,
    },
  };

  const constructorParams = {
    adapters: [consoleAdapterSettings],
  };

  describe('Factory construction', () => {
    it('should not throw when calling without params', () => {
      expect(() => new LoggerFactory()).not.toThrow();
    });

    it.each([
      null, 'unknown',
    ])('should throw AssertionError when passing adapter - %s', (adapter) => {
      expect(() => new LoggerFactory({
        ...constructorParams,
        adapters: [{
          name: adapter as Adapters,
        }],
      })).toThrow(AssertionError);
    });

    it.each([
      Adapters.Console,
      Adapters.Sentry,
    ])('should throw when calling %s without adapterConfig', (adapter) => {
      expect(() => new LoggerFactory({
        ...constructorParams,
        adapters: [{
          name: adapter as Adapters,
        }],
      })).toThrow(AssertionError);
    });

    it(`should not throw when calling ${Adapters.Sentry} with adapterConfig`, () => {
      expect(() => new LoggerFactory({
        ...constructorParams,
        adapters: [sentryAdapterSettings],
      })).not.toThrow();
    });

    it('should call Sentry.init with the provided adapterConfig', () => {
      const spiedSentryInit = jest.spyOn(Sentry, 'init');

      expect(() => new LoggerFactory({
        ...constructorParams,
        adapters: [sentryAdapterSettings],
      })).not.toThrow();

      expect(spiedSentryInit).toHaveBeenCalledWith(expect.objectContaining({
        dsn: sentryAdapterSettings.config.dsn,
        tracesSampleRate: sentryAdapterSettings.config.tracesSampleRate,
        environment: sentryAdapterSettings.config.environment,
      }));
    });

    it.skip('should allow to init sentry in debug mode', () => {
      const spiedSentryInit = jest.spyOn(Sentry, 'init');

      expect(() => new LoggerFactory({
        ...constructorParams,
        adapters: [{
          ...sentryAdapterSettings,
          config: {
            ...sentryAdapterSettings.config,
            debug: true,
          },
        }],
      })).not.toThrow();

      expect(spiedSentryInit).toHaveBeenCalledWith(expect.objectContaining({
        debug: true,
      }));
    });
  });

  const consoleLoggerFactory = new LoggerFactory(constructorParams);
  const consoleLogger = consoleLoggerFactory.create('MyClass');

  describe('Logger creation', () => {
    it.each([
      null, '', 1,
    ])('should throw AssertionError when passing prefix - %s', (prefix) => {
      expect(() => consoleLoggerFactory.create(prefix as string)).toThrow(AssertionError);
    });

    it.each([
      undefined, 'MyClass', 'MyOtherClass',
    ])('should not throw AssertionError when passing prefix - %s', (prefix) => {
      expect(() => consoleLoggerFactory.create(prefix)).not.toThrow();
    });
  });

  const orderedLogLevels = [
    LogLevels.System,
    LogLevels.Error,
    LogLevels.Warn,
    LogLevels.Info,
    LogLevels.Debug,
  ];

  describe('Logging [console]*', () => {
    const spiedConsoleLog = jest.spyOn(console, 'log');

    afterEach(() => {
      spiedConsoleLog.mockClear();
    });

    for (const level of orderedLogLevels) {
      const index = orderedLogLevels.indexOf(level);
      const overlappedMethods = orderedLogLevels.slice(0, index + 1);
      const nonOverlappedMethods = orderedLogLevels.slice(index + 1);

      const customLevelLoggerFactory = new LoggerFactory({
        adapters: [{
          name: Adapters.Console,
          config: {
            logLevel: level,
          },
        }],
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
      adapters: [{
        name: Adapters.Console,
        config: {
          logLevel: LogLevels.Silent,
        },
      }],
    });
    const pointlessLogger = pointlessLoggerFactory.create('MyClass');

    it.each(orderedLogLevels)('should not call the console.log when calling logger.%s [off]', (method) => {
      pointlessLogger[method]('test');

      expect(spiedConsoleLog).not.toHaveBeenCalled();
    });

    it('should provide the formatted date as first param', () => {
      mockDate(new Date('Tue, 23 Jun 2020 14:34:56'));
      consoleLogger.info('test');
      restoreDate();

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[0]).toEqual('(2020/06/23 14:34:56.000)');
    });

    it('should provide the prefix as second param', () => {
      consoleLogger.info('test');

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[1]).toEqual('[MyClass]');
    });

    it('should not provide prefix when it is omitted', () => {
      mockDate(new Date('Tue, 23 Jun 2020 14:34:56'));
      const noPrefixLogger = consoleLoggerFactory.create();
      noPrefixLogger.info('test');
      restoreDate();

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[0]).toEqual('(2020/06/23 14:34:56.000)');
      expect(lastCallArgs[1]).toEqual('[INFO]');
      expect(lastCallArgs[2]).toEqual('test');
      expect(lastCallArgs.length).toEqual(3);
    });

    it('should provide the upper-cased level as third param', () => {
      consoleLogger.info('test');

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[2]).toEqual('[INFO]');
    });

    it('should provide the data as last params', () => {
      consoleLogger.info('te', 'st');

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[3]).toEqual('te');
      expect(lastCallArgs[4]).toEqual('st');
    });

    it.each([
      { bar: 'foo' },
      [1, 2, 3.14],
    ])('should stringify %p', (input) => {
      consoleLogger.info(input);

      const lastCallArgs = spiedConsoleLog.mock.calls.pop();
      expect(lastCallArgs[3]).toEqual(JSON.stringify(input));
    });
  });

  describe('Logging [sentry]*', () => {
    const spiedSentryCaptureMessage = jest.spyOn(Sentry, 'captureMessage');
    const spiedSentryCaptureException = jest.spyOn(Sentry, 'captureException');
    const spiedSentrySetTag = jest.spyOn(Sentry, 'setTag');

    afterEach(() => {
      spiedSentryCaptureMessage.mockClear();
      spiedSentryCaptureException.mockClear();
      spiedSentrySetTag.mockClear();
    });

    for (const level of orderedLogLevels) {
      const index = orderedLogLevels.indexOf(level);
      const overlappedMethods = orderedLogLevels.slice(0, index + 1);
      const nonOverlappedMethods = orderedLogLevels.slice(index + 1);

      const customLevelLoggerFactory = new LoggerFactory({
        adapters: [{
          ...sentryAdapterSettings,
          config: {
            ...sentryAdapterSettings.config,
            logLevel: level,
          },
        }],
      });
      const customLogger = customLevelLoggerFactory.create('MyClass');

      if (overlappedMethods.length) {
        it.each(overlappedMethods)(`should call the Sentry.captureMessage when calling logger.%s [${level}]`, (method) => {
          customLogger[method]('test');
          expect(spiedSentryCaptureMessage).toHaveBeenCalled();
        });
      }

      if (nonOverlappedMethods.length) {
        it.each(nonOverlappedMethods)(`should not call the Sentry.captureMessage when calling logger.%s [${level}]`, (method) => {
          customLogger[method]('test');
          expect(spiedSentryCaptureMessage).not.toHaveBeenCalled();
        });
      }
    }

    const pointlessLoggerFactory = new LoggerFactory({
      adapters: [{
        ...sentryAdapterSettings,
        config: {
          ...sentryAdapterSettings.config,
          logLevel: LogLevels.Silent,
        },
      }],
    });
    const pointlessLogger = pointlessLoggerFactory.create('MyClass');

    it.each(orderedLogLevels)('should not call the console.log when calling logger.%s [off]', (method) => {
      pointlessLogger[method]('test');

      expect(spiedSentryCaptureMessage).not.toHaveBeenCalled();
    });

    const sentryLoggerFactory = new LoggerFactory({
      adapters: [sentryAdapterSettings],
    });
    const sentryLogger = sentryLoggerFactory.create('SentryLogger');

    it('should contain the formatted date', () => {
      mockDate(new Date('Tue, 23 Jun 2020 14:34:56'));
      sentryLogger.warn('test');
      restoreDate();

      const [lastCallArgs] = spiedSentryCaptureMessage.mock.calls.pop();
      expect(lastCallArgs).toContain('(2020/06/23 14:34:56.000)');
    });

    it('should set the logLevel as a tag', () => {
      sentryLogger.warn('test');
      expect(spiedSentrySetTag).toHaveBeenCalledWith('logLevel', 'warn');
    });

    it('should set the prefix as a tag', () => {
      sentryLogger.warn('test');
      expect(spiedSentrySetTag).toHaveBeenCalledWith('prefix', 'SentryLogger');
    });

    it('should call captureMessage when logging plaintext', () => {
      sentryLogger.warn('te', 'st');
      expect(spiedSentryCaptureMessage).toHaveBeenCalled();
    });

    it('should contain the provided plaintext message', () => {
      sentryLogger.warn('te', 'st');

      const [lastCallArgs] = spiedSentryCaptureMessage.mock.calls.pop();
      expect(lastCallArgs).toContain('te');
      expect(lastCallArgs).toContain('st');
    });

    it('should call captureException when logging exceptions', () => {
      sentryLogger.error(new Error('Test!'));
      expect(spiedSentryCaptureException).toHaveBeenCalled();
    });

    it('should call both captureMessage and captureException if logging both text and exception', () => {
      sentryLogger.error('test', new Error('Test!'));
      expect(spiedSentryCaptureMessage).toHaveBeenCalled();
      expect(spiedSentryCaptureException).toHaveBeenCalled();
    });
  });

  describe('Multiple adapters', () => {
    const spiedConsoleLog = jest.spyOn(console, 'log');
    const spiedSentryCaptureMessage = jest.spyOn(Sentry, 'captureMessage');

    afterEach(() => {
      spiedSentryCaptureMessage.mockClear();
      spiedConsoleLog.mockClear();
    });

    it('should use all configured adapters', () => {
      const multiAdapterFactory = new LoggerFactory({
        adapters: [
          consoleAdapterSettings,
          sentryAdapterSettings,
        ],
      });
      const multiAdapterLogger = multiAdapterFactory.create('MyClass');
      multiAdapterLogger.warn('test');

      expect(spiedConsoleLog).toHaveBeenCalled();
      expect(spiedSentryCaptureMessage).toHaveBeenCalled();
    });

    it('should only call the adapters for which the configured min logLevel is higher than the message loglevel', () => {
      const multiAdapterFactory = new LoggerFactory({
        adapters: [
          consoleAdapterSettings,
          sentryAdapterSettings,
        ],
      });
      const multiAdapterLogger = multiAdapterFactory.create('MyClass');
      multiAdapterLogger.info('test');

      expect(spiedConsoleLog).toHaveBeenCalled();
      expect(spiedSentryCaptureMessage).not.toHaveBeenCalled();
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
