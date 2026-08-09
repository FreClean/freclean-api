import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env';
import { validateBody } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';
import { list, create } from '../data/store';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  // Only 'customer' and 'entrepreneur' are self-registerable. Staff roles are
  // granted internally by an admin via PATCH /api/users/:id.
  role: z.enum(['customer', 'entrepreneur']).default('customer'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/register', validateBody(registerSchema), async (req, res, next) => {
  const { email, password, fullName, role } = req.body as z.infer<typeof registerSchema>;
  const existing = list('users').find((u) => u.email === email);
  if (existing) return next(new AppError(409, 'An account with this email already exists.'));

  const passwordHash = await bcrypt.hash(password, 12);
  const user = create('users', { email, fullName, role, passwordHash });
  const { passwordHash: _omit, ...safeUser } = user;
  res.status(201).json({ data: safeUser });
});

authRouter.post('/login', validateBody(loginSchema), async (req, res, next) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;
  const user = list('users').find((u) => u.email === email);
  if (!user) return next(new AppError(401, 'Invalid email or password.'));

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return next(new AppError(401, 'Invalid email or password.'));

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
  res.json({ data: { token, user: { id: user.id, email: user.email, role: user.role } } });
});
