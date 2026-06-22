import fs from 'node:fs';
import { createLogger, format, transports, type Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config';

const logDir = 'log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const baseFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

export const logger: Logger = createLogger({
  level: config.app.isDev ? 'debug' : 'info',
  format: baseFormat,
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), baseFormat),
    }),
    new DailyRotateFile({
      filename: `${logDir}/%DATE%-results.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
  exitOnError: false,
});

export default logger;
