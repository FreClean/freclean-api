import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Auth flow', () => {
  const email = `demo-${Date.now()}@example.com`;
  const password = 'S3curePass!';

  it('registers a new customer', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password, fullName: 'Demo Customer', role: 'customer' });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe(email);
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('logs in and returns a JWT', async () => {
    const res = await request(app).post('/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(typeof res.body.data.token).toBe('string');
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/auth/login').send({ email, password: 'wrong' });
    expect(res.status).toBe(401);
  });
});

describe('RBAC', () => {
  it('rejects unauthenticated access to a protected resource', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(401);
  });
});
