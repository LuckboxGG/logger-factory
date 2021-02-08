[![Build Status](https://travis-ci.org/LuckboxGG/logger-factory.svg?branch=master)](https://travis-ci.org/LuckboxGG/logger-factory)

[![Coverage Status](https://coveralls.io/repos/github/LuckboxGG/logger-factory/badge.svg?branch=master)](https://coveralls.io/github/LuckboxGG/logger-factory?branch=master)

# Logger Factory

This logger factory produces Logger instances that can have different prefixes,
but all share the same logging level that is set for the LoggerFactory instance. 
Note that logging level is configured per adapter, i.e. you can be more verbose with one adapter
and less verbose for another.

### Usage

The following example creates a LoggerFactory instance, using only a console adapter with log level `info`,
and that instance is used to create two Logger instances with `Classname` and `Classname2` prefixes respectively.

```
const LoggerFactory = require('./LoggerFactory');

const infoLoggerFactory = new LoggerFactory({
    adapters: [{
        name: Adapters.Console,
        config: {
            logLevel: 'info'
        }
    }]
});
const infoLogger = infoLoggerFactory.create('Classname');
const anotherInfoLogger = infoLoggerFactory.create('Classname2');
```

The following example creates a LoggerFactory instance, using only two adapters - console and sentry, with log levels `info` and `warn` respectively,
meaning that all messages above info will only be logged via the Console adapter, while warn and above will also be logged via Sentry adapter.
After that, similarly to our previous example, that LoggerFactory instance is used to create two Logger instances with `Classname` and `Classname2` prefixes respectively.

```
const LoggerFactory = require('./LoggerFactory');

const infoLoggerFactory = new LoggerFactory({
    adapters: [
        {
            name: Adapters.Console,
            config: {
                logLevel: 'info'
            }
        },
        {
            name: Adapters.Sentry,
            config: {
              logLevel: 'warn',
              dsn: 'https://5637ee1e65504e02b1ba62255ac1f23a@youserver.com/6',
              tracesSampleRate: 1.0,
              environment: 'testing',
            }
        }
    ]
});
const infoLogger = infoLoggerFactory.create('Classname');
const anotherInfoLogger = infoLoggerFactory.create('Classname2');
```

### LoggerFactory methods

- `constructor ({ adapters })` - Creates an instance LoggerFactory instance with the requested array of adapters. List of the supported adapters,
  along with their configuration requirements, follows below.
- `create(prefix?: string)` - Creates an instance of the logger, using already specified adapters.

### Adapters

The following is a list of all supported adapters, along wit an example usage of each of them. 
The possible logging levels are the same for each of the adapters and are listed below this list.

Default configuration (works for all adapters):

- `skipTimestamps` Whether to include the timestamps in the logged message. Can be turned off if using kubernetes, 
  since it has integrated functionality to timestamp all messages. Defaults to false.
- `logLevel` - The minimum logging level that will be logged with that adapter.

#### Console adapter

Console adapter has no additional configuration.

```
const LoggerFactory = require('./LoggerFactory');

const infoLoggerFactory = new LoggerFactory({
    adapters: [{
        name: Adapters.Console,
        config: {
            logLevel: 'info'
        }
    }]
});
const infoLogger = infoLoggerFactory.create('Classname');
const anotherInfoLogger = infoLoggerFactory.create('Classname2');
```

#### Sentry adapter

Sentry has the following additional configuration settings:

- `dsn` - Client key, used by Sentry to determine where to send the event to
- `environment` - Used to separate errors from different environments
- `debug` - Whether to enable Sentry adapter in debug mode (NOTE: even in debug mode, not working Sentry server
  will not crash the code).  Defaults to false.

```
const LoggerFactory = require('./LoggerFactory');

const infoLoggerFactory = new LoggerFactory({
    adapters: [{
        name: Adapters.Sentry,
        config: {
          logLevel: 'warn',
          dsn: 'https://5637ee1e65504e02b1ba62255ac1f23a@yoursentryserver.com/6',
          environment: 'testing',
          debug: false,
        }
    }]
});
const infoLogger = infoLoggerFactory.create('Classname');
const anotherInfoLogger = infoLoggerFactory.create('Classname2');
```

### Log levels

The following log levels are supported, listed from least verbose to the most verbose:

- `off` - Nothing is logged
- `system` - System messages (used via `.system()`) are logged
- `error` - Error messages (used via `.error()`) are logged
- `warn` - Warn messages (used via `.warn()`) are logged
- `info` - Info messages (used via `.info()`) are logged
- `debug` - Debug messages (used via `.debug()`) are logged

Note that in all cases, when setting a value, all less-verbose types of messages are also logged,
for example if you set `warn` as log level, `off`, `system` and `error` are also logged.

### Logger Methods

The following methods can be called on a Logger instance:

- `system(message)` - The provided `message` is logged via `console.log` if the configured log level allows
- `error(message)` - The provided `message` is logged via `console.error` if the configured log level allows
- `warn(message)` - The provided `message` is logged via `console.warn` if the configured log level allows
- `info(message)` - The provided `message` is logged via `console.info` if the configured log level allows
- `debug(message)` - The provided `message` is logged via `console.log` if the configured log level allows
- `clear` - Console is cleared

