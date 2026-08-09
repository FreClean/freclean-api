import { z } from 'zod';

export const userCreateSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum([
    'founder',
    'management',
    'finance',
    'operations',
    'product_management',
    'cleaning_staff',
    'support',
    'entrepreneur',
    'customer',
  ]),
});
export const userUpdateSchema = userCreateSchema.partial();

export const customerCreateSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  address: z.string().optional(),
});
export const customerUpdateSchema = customerCreateSchema.partial();

export const serviceCreateSchema = z.object({
  name: z.string().min(2),
  category: z.enum(['residential', 'airbnb', 'office', 'hotel', 'kitchen', 'specialized']),
  status: z.enum(['active', 'in_development', 'planned']).default('planned'),
});
export const serviceUpdateSchema = serviceCreateSchema.partial();

export const bookingCreateSchema = z.object({
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledFor: z.string().datetime(),
  address: z.string().min(3),
  teamId: z.string().uuid().optional(),
  status: z
    .enum(['requested', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .default('requested'),
});
export const bookingUpdateSchema = bookingCreateSchema.partial();

export const orderCreateSchema = z.object({
  customerId: z.string().uuid(),
  items: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() }))
    .min(1),
  status: z.enum(['pending', 'paid', 'fulfilled', 'cancelled', 'refunded']).default('pending'),
});
export const orderUpdateSchema = orderCreateSchema.partial();

export const productCreateSchema = z.object({
  sku: z.string().min(2),
  name: z.string().min(2),
  category: z.enum(['cleaning', 'household', 'fragrance', 'professional']),
  lifecycleStatus: z.enum(['development', 'prototype', 'available', 'discontinued', 'planned']),
  retailPrice: z.number().nonnegative().nullable().optional(),
  wholesalePrice: z.number().nonnegative().nullable().optional(),
});
export const productUpdateSchema = productCreateSchema.partial();

export const inventoryCreateSchema = z.object({
  productId: z.string().uuid(),
  quantityOnHand: z.number().int().nonnegative(),
  location: z.string().min(2),
});
export const inventoryUpdateSchema = inventoryCreateSchema.partial();

export const staffCreateSchema = z.object({
  userId: z.string().uuid(),
  position: z.string().min(2),
  teamId: z.string().uuid().optional(),
});
export const staffUpdateSchema = staffCreateSchema.partial();

export const teamCreateSchema = z.object({
  name: z.string().min(2),
  memberIds: z.array(z.string().uuid()).default([]),
});
export const teamUpdateSchema = teamCreateSchema.partial();

export const entrepreneurCreateSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['applied', 'training', 'active', 'inactive']).default('applied'),
  startedAt: z.string().datetime().optional(),
});
export const entrepreneurUpdateSchema = entrepreneurCreateSchema.partial();

export const paymentCreateSchema = z.object({
  orderId: z.string().uuid().optional(),
  bookingId: z.string().uuid().optional(),
  method: z.enum(['cash', 'card', 'web3']),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  web3: z
    .object({
      network: z.literal('celo'),
      asset: z.string(),
      walletAddress: z.string(),
      txHash: z.string().optional(),
    })
    .optional(),
  status: z
    .enum([
      'requested',
      'pending',
      'detected',
      'verified',
      'confirmed',
      'failed',
      'expired',
      'refunded',
    ])
    .default('requested'),
});
export const paymentUpdateSchema = paymentCreateSchema.partial();

export const assetCreateSchema = z.object({
  assetName: z.string(),
  symbol: z.string(),
  network: z.literal('celo'),
  contractAddress: z.string().nullable(),
  decimals: z.number().int().nullable(),
  status: z.enum(['in_development', 'testing', 'enabled', 'disabled']),
  paymentEnabled: z.boolean().default(false),
  verificationDate: z.string().datetime().nullable().optional(),
  notes: z.string().optional(),
});
export const assetUpdateSchema = assetCreateSchema.partial();

export const reviewCreateSchema = z.object({
  customerId: z.string().uuid(),
  bookingId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});
export const reviewUpdateSchema = reviewCreateSchema.partial();

export const notificationCreateSchema = z.object({
  userId: z.string().uuid(),
  channel: z.enum(['email', 'sms', 'push']),
  message: z.string().min(1),
  status: z.enum(['queued', 'sent', 'failed']).default('queued'),
});
export const notificationUpdateSchema = notificationCreateSchema.partial();
