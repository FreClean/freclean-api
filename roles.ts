/**
 * FreClean role-based access control.
 * Mirrors the roles defined for freclean-admin: Founder, Management, Finance,
 * Operations, Product Management, Cleaning Staff, Support — plus Entrepreneur
 * and Customer for external, non-admin accounts.
 */
export type Role =
  | 'founder'
  | 'management'
  | 'finance'
  | 'operations'
  | 'product_management'
  | 'cleaning_staff'
  | 'support'
  | 'entrepreneur'
  | 'customer';

export const ALL_STAFF_ROLES: Role[] = [
  'founder',
  'management',
  'finance',
  'operations',
  'product_management',
  'cleaning_staff',
  'support',
];

/** Resource-level permission: which roles may perform which action. */
export interface ResourcePermissions {
  read: Role[];
  create: Role[];
  update: Role[];
  delete: Role[];
}

export const fullStaffAccess: ResourcePermissions = {
  read: [...ALL_STAFF_ROLES, 'customer', 'entrepreneur'],
  create: ['founder', 'management', 'operations', 'support'],
  update: ['founder', 'management', 'operations', 'support'],
  delete: ['founder', 'management'],
};

export const financeOnly: ResourcePermissions = {
  read: ['founder', 'management', 'finance'],
  create: ['founder', 'finance'],
  update: ['founder', 'finance'],
  delete: ['founder'],
};

export const readOnlyReports: ResourcePermissions = {
  read: ['founder', 'management', 'finance', 'operations'],
  create: [],
  update: [],
  delete: [],
};
