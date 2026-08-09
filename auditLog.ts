import { NextFunction, Request, Response } from 'express';
import { create } from '../data/store';

const MUTATING = ['POST', 'PATCH', 'PUT', 'DELETE'];

/** Writes a lightweight audit trail entry for every mutating, authenticated request. */
export function auditLog(req: Request, res: Response, next: NextFunction) {
  if (!MUTATING.includes(req.method)) return next();
  res.on('finish', () => {
    if (res.statusCode >= 400) return;
    create('audit', {
      actorId: req.user?.id ?? 'anonymous',
      actorRole: req.user?.role ?? 'unknown',
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
    });
  });
  next();
}
