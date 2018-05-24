const winston = require('winston');

class Logger {
  constructor (filename) {
    this.logger = null;     
  }

  exist () {
    return this.logger !== null ? true : false;
  }

  create (filename) {
    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: `${filename}.log` })
      ]
    });
  }

  print (message) {
    this.logger.info(message);
  }
}

module.exports = Logger