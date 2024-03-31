import winston from 'winston';
import { randomBytes } from 'crypto';
// import formatHTTPLoggerResponse from "./httpForamatter";
import apiConfig from '../config/api_config';

const appVersion = process.env.npm_package_version;
const generateLogId = (): string => randomBytes(16).toString('hex');

const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green'
});

export const logger = winston.createLogger({
  level: apiConfig.NODE_ENV === 'dev' ? 'debug' : 'error',
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        logId: generateLogId(),
        timestamp,
        appInfo: {
          appVersion,
          environment: process.env.NODE_ENV,
          proccessId: process.pid
        },
        message,
        data
      };

      // indenting logs for better readbility
      return JSON.stringify(response, null, 2);
    })
  ),

  transports: [new winston.transports.Console()]
});
