'use strict';

const log = require('./LoggerFactory');
import konstanta from "./test";

const logger = new log({ logLevel: 'info' });
const testLogger = logger.create( { prefix: 'test' } );

testLogger.info('This INFO message will be displayed!');
testLogger.debug('This DEBUG message will NOT be displayed!');
console.log(konstanta);
