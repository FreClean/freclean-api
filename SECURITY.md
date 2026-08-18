# Security Policy for freclean-api

## Reporting a vulnerability

Email **freclean7@gmail.com** with details. Do not open a public issue for unpatched vulnerabilities.

## What this API already does

- Passwords hashed with bcrypt (cost factor 12), never stored or logged in plaintext.
- JWT-based authentication (`requireAuth`) on every route under `/api`.
- Role-based access control (`requireRole`) per resource and per HTTP method.
- Input validation on every write via Zod schemas; malformed bodies are rejected before touching the data layer.
- Rate limiting on all routes (default: 300 requests / 15 minutes / IP).
- Security headers via `helmet`.
- An audit log entry is written for every successful mutating request (`src/middleware/auditLog.ts`).
- `.env` is git-ignored; only `.env.example` (no real secrets) is committed.
- The server refuses to start in production with the placeholder `JWT_SECRET`.

## What is not yet implemented

- Persistent storage (currently an in-memory demo store; see `src/data/store.ts`). Do not deploy this as-is to production.
- Secret management via a vault/KMS (currently relies on environment variables only).
- Dependency vulnerability scanning in CI (add a `npm audit` or Dependabot step before production use).
- Multi-signature approval for treasury-related endpoints (see `freclean-docs` treasury policy).

## Wallet & payment data

Web3 payment records store network, asset, amount, wallet address, and transaction hash only. Private keys and seed phrases are never accepted, stored, or logged by this API.
