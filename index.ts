import { Router } from 'express';
import { createCrudRouter } from '../core/createCrudRouter';
import { fullStaffAccess, financeOnly, readOnlyReports } from '../core/roles';
import { paymentsRouter } from './payments';
import * as s from './schemas';

export const apiRouter = Router();

apiRouter.use(
  '/users',
  createCrudRouter({
    resource: 'users',
    permissions: { read: fullStaffAccess.read, create: ['founder', 'management'], update: ['founder', 'management'], delete: ['founder'] },
    createSchema: s.userCreateSchema,
    updateSchema: s.userUpdateSchema,
  }),
);

apiRouter.use(
  '/customers',
  createCrudRouter({
    resource: 'customers',
    permissions: fullStaffAccess,
    createSchema: s.customerCreateSchema,
    updateSchema: s.customerUpdateSchema,
  }),
);

apiRouter.use(
  '/services',
  createCrudRouter({
    resource: 'services',
    permissions: fullStaffAccess,
    createSchema: s.serviceCreateSchema,
    updateSchema: s.serviceUpdateSchema,
  }),
);

apiRouter.use(
  '/bookings',
  createCrudRouter({
    resource: 'bookings',
    permissions: fullStaffAccess,
    createSchema: s.bookingCreateSchema,
    updateSchema: s.bookingUpdateSchema,
  }),
);

apiRouter.use(
  '/orders',
  createCrudRouter({
    resource: 'orders',
    permissions: fullStaffAccess,
    createSchema: s.orderCreateSchema,
    updateSchema: s.orderUpdateSchema,
  }),
);

apiRouter.use(
  '/products',
  createCrudRouter({
    resource: 'products',
    permissions: {
      read: fullStaffAccess.read,
      create: ['founder', 'management', 'product_management'],
      update: ['founder', 'management', 'product_management'],
      delete: ['founder', 'management'],
    },
    createSchema: s.productCreateSchema,
    updateSchema: s.productUpdateSchema,
  }),
);

apiRouter.use(
  '/inventory',
  createCrudRouter({
    resource: 'inventory',
    permissions: {
      read: ['founder', 'management', 'operations', 'product_management'],
      create: ['founder', 'management', 'operations', 'product_management'],
      update: ['founder', 'management', 'operations', 'product_management'],
      delete: ['founder', 'management'],
    },
    createSchema: s.inventoryCreateSchema,
    updateSchema: s.inventoryUpdateSchema,
  }),
);

apiRouter.use(
  '/staff',
  createCrudRouter({
    resource: 'staff',
    permissions: {
      read: ['founder', 'management', 'operations'],
      create: ['founder', 'management'],
      update: ['founder', 'management', 'operations'],
      delete: ['founder', 'management'],
    },
    createSchema: s.staffCreateSchema,
    updateSchema: s.staffUpdateSchema,
  }),
);

apiRouter.use(
  '/teams',
  createCrudRouter({
    resource: 'teams',
    permissions: {
      read: ['founder', 'management', 'operations', 'cleaning_staff'],
      create: ['founder', 'management', 'operations'],
      update: ['founder', 'management', 'operations'],
      delete: ['founder', 'management'],
    },
    createSchema: s.teamCreateSchema,
    updateSchema: s.teamUpdateSchema,
  }),
);

apiRouter.use(
  '/entrepreneurs',
  createCrudRouter({
    resource: 'entrepreneurs',
    permissions: {
      read: ['founder', 'management', 'support', 'entrepreneur'],
      create: ['founder', 'management', 'support'],
      update: ['founder', 'management', 'support'],
      delete: ['founder', 'management'],
    },
    createSchema: s.entrepreneurCreateSchema,
    updateSchema: s.entrepreneurUpdateSchema,
  }),
);

apiRouter.use('/payments', paymentsRouter);

apiRouter.use(
  '/assets',
  createCrudRouter({
    resource: 'assets',
    permissions: financeOnly,
    createSchema: s.assetCreateSchema,
    updateSchema: s.assetUpdateSchema,
  }),
);

apiRouter.use(
  '/reviews',
  createCrudRouter({
    resource: 'reviews',
    permissions: {
      read: [...fullStaffAccess.read],
      create: ['customer', 'founder', 'management', 'support'],
      update: ['founder', 'management', 'support'],
      delete: ['founder', 'management'],
    },
    createSchema: s.reviewCreateSchema,
    updateSchema: s.reviewUpdateSchema,
  }),
);

apiRouter.use(
  '/notifications',
  createCrudRouter({
    resource: 'notifications',
    permissions: {
      read: ['founder', 'management', 'support'],
      create: ['founder', 'management', 'support', 'operations'],
      update: ['founder', 'management', 'support'],
      delete: ['founder', 'management'],
    },
    createSchema: s.notificationCreateSchema,
    updateSchema: s.notificationUpdateSchema,
  }),
);

apiRouter.use('/reports', createCrudRouter({ resource: 'reports', permissions: readOnlyReports }));
apiRouter.use('/analytics', createCrudRouter({ resource: 'analytics', permissions: readOnlyReports }));
apiRouter.use(
  '/audit',
  createCrudRouter({
    resource: 'audit',
    permissions: { read: ['founder', 'management'], create: [], update: [], delete: [] },
  }),
);
