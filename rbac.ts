import { NextFunction, Request, Response } from 'express';
import { Role } from '../core/roles';
import { AppError } from './errorHandler';

/** Restricts a route to the given roles. Requires requireAuth to have run first. */
export function requireRole(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required.'));
    }
    if (allowed.length === 0) {
      return next(new AppError(403, 'This action has no permitted roles configured.'));
    }
    if (!allowed.includes(req.user.role)) {
      return next(new AppError(403, `Role '${req.user.role}' is not permitted to perform this action.`));
    }
    next();
  };
}
