import winston from 'winston';

export const log = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'blockchainEvents' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
});

export const httpLog = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'eventProcessor' },
    transports: [
      new winston.transports.File({ filename: 'http.log'}),
    ],
});