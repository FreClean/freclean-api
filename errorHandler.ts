import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) logger.error(err.message, { stack: err.stack });
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }
  const message = err instanceof Error ? err.message : 'Unexpected error';
  logger.error(message, { err });
  return res.status(500).json({ error: 'Internal server error' });
}
