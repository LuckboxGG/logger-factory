

import { LoggerFactory, LogLevels, Adapters } from '../src/LoggerFactory';

const infoLoggerFactory = new LoggerFactory({ logLevel: LogLevels.Info, adapter: Adapters.Console });
const infoLogger = infoLoggerFactory.create('InfoClassname');

infoLogger.info('This INFO message will be displayed!');
infoLogger.debug('This DEBUG message will NOT be displayed!');

const debugLoggerFactory = new LoggerFactory({ logLevel: LogLevels.Debug, adapter: Adapters.Console });
const debugLogger = debugLoggerFactory.create('DebugClassname');

const debugObj = { foo: 'bar' };

debugLogger.info('This INFO message will be displayed!');
debugLogger.debug('This DEBUG message will also be displayed, along with an object!', debugObj);

class CustomError extends Error {}
debugLogger.error(new CustomError('Custom error'));
