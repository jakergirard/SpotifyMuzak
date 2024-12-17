import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export class Logger {
  static info(message, ...args) {
    logger.info(message, ...args);
  }

  static error(message, error) {
    logger.error(message, { error: error?.message, stack: error?.stack });
  }

  static warn(message, ...args) {
    logger.warn(message, ...args);
  }
}