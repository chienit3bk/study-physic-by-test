import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/** Logs each request's method, path, status and duration via winston. */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
}

export default requestLogger;
