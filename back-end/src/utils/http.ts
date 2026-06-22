import type { Response } from 'express';
import { AppError } from './error';
import { logger } from './logger';

/** Standardised error responder: never leaks stack traces to clients. */
export function sendError(res: Response, error: unknown, fallback = 'Something went wrong, please contact our support'): void {
  if (error instanceof AppError) {
    res.status(error.status).send({ message: error.message });
    return;
  }
  logger.error(error instanceof Error ? error.stack ?? error.message : String(error));
  res.status(500).send({ message: fallback });
}
