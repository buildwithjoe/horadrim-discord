const pino = require('pino');
const Transport = require('./PinoTransport');

class Pino {
  constructor(client) {
    const redact = {
      paths: ['user.password', 'req.headers.authorization']
    };
    const config = {
      level: 'info',
      redact: redact
    };
    this.logger = pino(config, new Transport(client));
  }

  info(...args) {
    this.logger.info(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }
  warn(...args) {
    this.logger.warn(...args);
  }
}

module.exports = Pino;
