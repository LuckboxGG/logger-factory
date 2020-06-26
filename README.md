# Logger Factory

This logger factory produces Logger instances that can have different prefixes, 
but all share the same logging level that is set for the LoggerFactory instance.

### Usage

```
const LoggerFactory = require('./LoggerFactory');

const infoLoggerFactory = new LoggerFactory('info');
const infoLogger = infoLoggerFactory.create('Classname');
const anotherInfoLogger = infoLoggerFactory.create('Classname2');
```

This example creates a LoggerFactory instance of log level `info`, and that instance is used to 
create two Logger instances with `Classname` and `Classname2` prefixes respectively.

### LoggerFactory methods

- `create({ logLevel, adapter})` - Creates an instance of the requested adapter (specified by `adapter`, defaults to `console`) 
with the provided `logLevel` (defaults to `warn`). List of supported log levels is provided below in this README.  

### Adapters

Currently, only one adapter is supported - a console logger, that can be instanced by providing `console` 
as adapter value.

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

