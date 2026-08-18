import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validateBody } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';
import { get, list, create, update } from '../data/store';
import { paymentCreateSchema } from './schemas';
import { z } from 'zod';

/**
 * Payment status must move forward through a fixed sequence. This guards
 * against skipping straight to "confirmed" without passing through
 * verification via docs/PAYMENT-ARCHITECTURE.md in freclean-docs.
 */
const STATUS_ORDER = [
  'requested',
  'pending',
  'detected',
  'verified',
  'confirmed',
] as const;
const TERMINAL_FAILURES = ['failed', 'expired', 'refunded'] as const;

const transitionSchema = z.object({
  status: z.enum([...STATUS_ORDER, ...TERMINAL_FAILURES]),
  txHash: z.string().optional(),
});

export const paymentsRouter = Router();
paymentsRouter.use(requireAuth);

paymentsRouter.get('/', requireRole('founder', 'management', 'finance', 'operations'), (_req, res) => {
  res.json({ data: list('payments') });
});

paymentsRouter.get('/:id', requireRole('founder', 'management', 'finance', 'operations'), (req, res, next) => {
  const record = get('payments', req.params.id);
  if (!record) return next(new AppError(404, `payment ${req.params.id} not found.`));
  res.json({ data: record });
});

paymentsRouter.post(
  '/',
  requireRole('founder', 'management', 'finance', 'operations'),
  validateBody(paymentCreateSchema),
  (req, res) => {
    const record = create('payments', { ...req.body, status: 'requested' });
    res.status(201).json({ data: record });
  },
);

paymentsRouter.post(
  '/:id/transition',
  requireRole('founder', 'management', 'finance'),
  validateBody(transitionSchema),
  (req, res, next) => {
    const payment = get('payments', req.params.id);
    if (!payment) return next(new AppError(404, `payment ${req.params.id} not found.`));

    const { status: nextStatus, txHash } = req.body as z.infer<typeof transitionSchema>;
    const currentIndex = STATUS_ORDER.indexOf(payment.status);
    const nextIndex = STATUS_ORDER.indexOf(nextStatus as (typeof STATUS_ORDER)[number]);

    const isForwardStep = nextIndex !== -1 && nextIndex === currentIndex + 1;
    const isTerminalFailure = (TERMINAL_FAILURES as readonly string[]).includes(nextStatus);

    if (!isForwardStep && !isTerminalFailure) {
      return next(
        new AppError(
          409,
          `Cannot move payment from '${payment.status}' directly to '${nextStatus}'. Status must advance one step at a time, or move to a terminal failure state.`,
        ),
      );
    }

    if (nextStatus === 'confirmed' && payment.method === 'web3' && !txHash && !payment.web3?.txHash) {
      return next(new AppError(422, 'A verified Web3 payment requires a transaction hash before it can be confirmed.'));
    }

    const updated = update('payments', req.params.id, {
      status: nextStatus,
      web3: txHash ? { ...payment.web3, txHash } : payment.web3,
    });
    res.json({ data: updated });
  },
);
