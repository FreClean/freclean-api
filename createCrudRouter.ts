import { Router } from 'express';
import { ZodSchema } from 'zod';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validateBody } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';
import { ResourceName, list, get, create, update, remove } from '../data/store';
import { ResourcePermissions } from './roles';

export interface CrudConfig {
  resource: ResourceName;
  permissions: ResourcePermissions;
  createSchema?: ZodSchema;
  updateSchema?: ZodSchema;
}

/**
 * Builds a standard REST router (list/get/create/update/delete) for one
 * FreClean resource, wired with auth, RBAC, and validation. Domain-specific
 * behavior (e.g. payment verification) is layered on top in that module's
 * own router; see src/modules/payments for an example.
 */
export function createCrudRouter(config: CrudConfig): Router {
  const { resource, permissions, createSchema, updateSchema } = config;
  const router = Router();

  router.use(requireAuth);

  router.get('/', requireRole(...permissions.read), (_req, res) => {
    res.json({ data: list(resource) });
  });

  router.get('/:id', requireRole(...permissions.read), (req, res, next) => {
    const record = get(resource, req.params.id);
    if (!record) return next(new AppError(404, `${resource} ${req.params.id} not found.`));
    res.json({ data: record });
  });

  router.post(
    '/',
    requireRole(...permissions.create),
    createSchema ? validateBody(createSchema) : (_req, _res, next) => next(),
    (req, res) => {
      const record = create(resource, req.body);
      res.status(201).json({ data: record });
    },
  );

  router.patch(
    '/:id',
    requireRole(...permissions.update),
    updateSchema ? validateBody(updateSchema) : (_req, _res, next) => next(),
    (req, res, next) => {
      const record = update(resource, req.params.id, req.body);
      if (!record) return next(new AppError(404, `${resource} ${req.params.id} not found.`));
      res.json({ data: record });
    },
  );

  router.delete('/:id', requireRole(...permissions.delete), (req, res, next) => {
    const ok = remove(resource, req.params.id);
    if (!ok) return next(new AppError(404, `${resource} ${req.params.id} not found.`));
    res.status(204).send();
  });

  return router;
}
