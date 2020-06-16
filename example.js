'use strict';

const LoggerFactory = require('./LoggerFactory');

const infoLoggerFactory = new LoggerFactory({ logLevel: 'info' });
const infoLogger = infoLoggerFactory.create( { prefix: 'InfoClassname' } );

console.log(`Created a logger instance with level ${infoLogger.logLevel}`);

infoLogger.info('This INFO message will be displayed!');
infoLogger.debug('This DEBUG message will NOT be displayed!');

const debugLoggerFactory = new LoggerFactory({ logLevel: 'debug' });
const debugLogger = debugLoggerFactory.create( { prefix: 'DebugClassname' } );

debugLogger.info('This INFO message will be displayed!');
debugLogger.debug('This DEBUG message will also be displayed!');
