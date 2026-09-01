# Back-end — study-physic-by-test API

REST API for the physics quiz platform. **TypeScript + Express 5 + Sequelize 6 + PostgreSQL.**

## Requirements
- Node.js ≥ 20
- PostgreSQL 16 (or Docker)

## Setup
```bash
cd back-end
npm install
cp .env.example .env
# generate a real secret instead of the placeholder:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# paste it into JWT_SECRET (and REFRESH_TOKEN_SECRET) in .env
```

### Environment (`.env`)
| Variable | Description |
| --- | --- |
| `DB_HOST` | Postgres host — `localhost` for host runs (`db:up` exposes 4002), overridden to `physic-test-postgres` by `docker-compose.yml` for the API container |
| `DB_PORT` | Postgres port — `4002` for host runs, overridden to `5432` in the container |
| `DB_DATABASE` `DB_USERNAME` `DB_PASSWORD` | PostgreSQL connection |
| `JWT_SECRET` | Secret for signing access tokens (use a long random value; logs an error at startup if unset) |
| `JWT_EXPIRES_IN` | Access-token lifetime (default `1d`) |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens (ships with an insecure fallback — override it) |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh-token lifetime (default `2d`) |
| `SALT_ROUND` | bcrypt cost factor (default `10`) |
| `PORT` | API port (default `3000`) |
| `APP_NAME` | Service name used in logs and `/health` (default `iLrn`) |
| `NODE_ENV` | `development` / `production` / `test` (default `development`) |

## Run

### With Docker (recommended)
```bash
docker compose up -d                          # Postgres + API
docker compose up -d physic-test-postgres     # Postgres only (for a host-run API)
```
`physic-test-postgres` exposes Postgres on host port **4002** (in-network `5432`) with
data persisted to `./data`. `physic-test-api` exposes the API on host port **4000**
(in-network `3000`); its `entrypoint.sh` waits for the DB, runs migrations, and seeds
demo data automatically (`environment:` in `docker-compose.yml` points it at
`physic-test-postgres:5432` regardless of what `DB_HOST`/`DB_PORT` say in `.env`).

### Locally
```bash
npm run db:migrate     # create tables (needs a running Postgres — e.g. db:up above)
npm run db:seed        # insert demo users
npm run db:seed:sql    # insert demo tags/questions/documents (idempotent)
npm run dev            # hot-reload dev server (default port 3000)
```

## Scripts
| Script | Purpose |
| --- | --- |
| `npm run dev` | Hot-reload dev server (`tsx watch`) |
| `npm run build` | Compile `src/` → `dist/` (`tsc`) |
| `npm start` | Run the compiled server (`node dist/app.js`) |
| `npm run typecheck` | Type-check only (`tsc --noEmit`) |
| `npm run db:migrate` / `db:migrate:undo` | Apply / undo migrations |
| `npm run db:seed` | Seed demo users (idempotent) |
| `npm run db:seed:sql` | Seed demo tags/questions/documents via `psql` (idempotent, `ON CONFLICT DO NOTHING`) |
| `npm run db:reset` | Undo all → migrate → seed |

## Structure
```
back-end/
├── src/
│   ├── app.ts             # HTTP bootstrap (connect DB, start server)
│   ├── server.ts          # Express app (middleware, routes)
│   ├── config/            # env + Sequelize config (typed)
│   ├── models/            # Sequelize models (InferAttributes) + index registry
│   ├── controllers/       # static handlers; BaseController exports the `crud` helper
│   ├── routes/            # api/ (JWT-protected) + web/ (auth) routers
│   ├── middleware/        # auth, admin, requestLogger
│   ├── utils/             # error, http (sendError), logger (winston)
│   └── types/             # Express request augmentation
├── migrations/            # Sequelize CLI migrations (CommonJS) — runtime schema source
├── seeders/               # demo data
├── database/              # schema.sql, seed.sql, ERD.mermaid (docs)
├── Dockerfile · docker-compose.yml · entrypoint.sh
└── tsconfig.json
```

## Demo accounts
`npm run db:seed` creates these accounts (password **`123456`** for all):

| Email | Role |
| --- | --- |
| `admin@test.com` | admin |
| `student@test.com` | user |
| `test0@test.com` | user |
| `test1@test.com` | user |
| `test2@test.com` | user |

## API overview
- Public (`/auth`): `POST /auth/sign-up`, `POST /auth/login`, `GET /auth/refresh`.
- Protected (`/api`, Bearer JWT): `users`, `questions`, `exams`, `tags`, `documents`,
  `results` — REST plus `POST /api/exams` (generate exam) and
  `POST /api/questions/list` (fetch by ids). `GET /health` returns service status.

## Conventions
Controllers are classes of `static` handlers using the shared `crud` helper and
`sendError`; models use the typed `InferAttributes` pattern; routes use plain `/:id`
params (Express 5). Keep `npm run typecheck` clean. See `../CLAUDE.md` and `../.claude/`
for full conventions, agents, and skills.

## Database
Schema docs, ER diagram, and standalone DDL live in [`database/`](./database/README.md).
The runtime schema is owned by the migrations in `migrations/`.
