# FreClean API

Backend API for the FreClean ecosystem — authentication, customers, bookings, orders, products, inventory, staff/teams, entrepreneurs, payments (cash/card/Web3), reviews, notifications, reports, analytics, and audit logs.

Part of the FreClean ecosystem (see `freclean-website`, `freclean-admin`, `freclean-dapp`, `freclean-payment`, `freclean-docs`).

## Status

**In development.** Runs against an in-memory demo data store (`src/data/store.ts`) so the API is fully runnable and testable without a database. Swap in a real persistence layer (PostgreSQL, via `freclean-data`) before production use — the CRUD factory (`src/core/createCrudRouter.ts`) is written so that swap doesn't require touching route logic.

## Tech stack

Node.js + TypeScript + Express, `zod` for validation, `jsonwebtoken` + `bcryptjs` for auth, `winston` for logging, `helmet` + `express-rate-limit` for baseline security, `jest` + `supertest` for tests.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:4000
```

```bash
npm test            # run the test suite
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run build        # compile to dist/
```

## API structure

All business routes are mounted under `/api`. Auth routes are under `/auth`. Health check at `/health`.

| Path | Resource | Notes |
|---|---|---|
| `/auth/register`, `/auth/login` | Auth | Self-registration limited to `customer` / `entrepreneur` roles |
| `/api/users` | Users | Staff role changes require `founder` or `management` |
| `/api/customers` | Customers | |
| `/api/services` | Services | |
| `/api/bookings` | Bookings | |
| `/api/orders` | Orders | |
| `/api/products` | Products | Lifecycle status: development / prototype / available / discontinued / planned |
| `/api/inventory` | Inventory | |
| `/api/staff` | Staff | |
| `/api/teams` | Cleaning teams | |
| `/api/entrepreneurs` | Entrepreneur program | |
| `/api/payments` | Payments | Custom router — see below |
| `/api/assets` | Supported Celo assets registry | Finance-role access only |
| `/api/reviews` | Reviews | |
| `/api/notifications` | Notifications | |
| `/api/reports` | Reports | Read-only |
| `/api/analytics` | Analytics | Read-only |
| `/api/audit` | Audit log | Read-only, `founder`/`management` only |

Every resource above supports `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`, gated by role (see `src/core/roles.ts`).

## Payments: status transitions

`/api/payments` cannot jump straight to `confirmed`. Status must advance one step at a time:

```
requested → pending → detected → verified → confirmed
```

or move to a terminal state: `failed`, `expired`, `refunded`. A Web3 payment cannot be confirmed without a transaction hash. See `src/modules/payments.ts`.

## Authentication & roles

Send `Authorization: Bearer <token>` on every `/api/*` request. Roles: `founder`, `management`, `finance`, `operations`, `product_management`, `cleaning_staff`, `support`, `entrepreneur`, `customer`. Permission tables live in `src/core/roles.ts` and are applied per resource in `src/modules/index.ts`.

## Data integrity rule

No invented business facts. Seed data in `src/data/store.ts` is explicitly marked `_demo: true` and documented as **DEMO DATA — NOT REAL CUSTOMER DATA**. The Supported Assets Registry (`/api/assets`) ships empty/placeholder until a real Celo asset is verified — see `freclean-payment` and `freclean-docs`.

## Roadmap for this repo

- [ ] Replace in-memory store with PostgreSQL (`freclean-data`)
- [ ] Wire `freclean-payment`'s Celo verification service into the payments transition endpoint
- [ ] Add `npm audit` / Dependabot to CI
- [ ] Add integration tests for every resource, not just auth/health
- [ ] Add OpenAPI/Swagger documentation

## Security

See [`SECURITY.md`](./SECURITY.md).

## License

Not provided.
