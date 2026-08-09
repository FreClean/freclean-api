/**
 * DEMO DATA — NOT REAL CUSTOMER DATA
 *
 * This is an in-memory store used so the API is runnable and testable without
 * a database connection. Replace with a real persistence layer (e.g.
 * PostgreSQL via freclean-data) before any production use. Every seeded
 * record below is fictional and used only to demonstrate the API shape.
 */
import { v4 as uuid } from 'uuid';

export type Store = Record<string, Record<string, any>>;

export const RESOURCES = [
  'users',
  'customers',
  'services',
  'bookings',
  'orders',
  'products',
  'inventory',
  'staff',
  'teams',
  'entrepreneurs',
  'payments',
  'assets',
  'reviews',
  'notifications',
  'reports',
  'analytics',
  'audit',
] as const;

export type ResourceName = (typeof RESOURCES)[number];

const store: Store = Object.fromEntries(RESOURCES.map((r) => [r, {}]));

function seed(resource: ResourceName, records: Array<Record<string, any>>) {
  for (const record of records) {
    const id = record.id ?? uuid();
    store[resource][id] = { id, ...record, _demo: true };
  }
}

// Minimal seed data so endpoints return something meaningful in demos.
// All records are marked _demo: true and should never be presented as real.
seed('services', [
  { name: 'Airbnb turnover cleaning', category: 'residential', status: 'active' },
  { name: 'Office cleaning', category: 'commercial', status: 'active' },
]);

seed('products', [
  {
    sku: 'DEMO-MSC-750',
    name: 'FreClean Multi-Surface Cleaner 750ml',
    category: 'cleaning',
    lifecycleStatus: 'development',
    retailPrice: null,
  },
]);

seed('assets', [
  {
    assetName: 'Not provided',
    symbol: 'N/A',
    network: 'celo',
    contractAddress: null,
    decimals: null,
    status: 'in_development',
    paymentEnabled: false,
    verificationDate: null,
    notes: 'Placeholder row — no Celo asset has been verified for payments yet.',
  },
]);

export const db = store;

export function list(resource: ResourceName) {
  return Object.values(store[resource]);
}

export function get(resource: ResourceName, id: string) {
  return store[resource][id] ?? null;
}

export function create(resource: ResourceName, data: Record<string, any>) {
  const id = uuid();
  const record = { id, ...data, createdAt: new Date().toISOString() };
  store[resource][id] = record;
  return record;
}

export function update(resource: ResourceName, id: string, data: Record<string, any>) {
  if (!store[resource][id]) return null;
  store[resource][id] = { ...store[resource][id], ...data, updatedAt: new Date().toISOString() };
  return store[resource][id];
}

export function remove(resource: ResourceName, id: string) {
  if (!store[resource][id]) return false;
  delete store[resource][id];
  return true;
}
