# Back-end — study-physic-by-test API

REST API for the physics quiz platform. **TypeScript + Express 5 + Sequelize 6 + PostgreSQL.**

## Requirements
- Node.js ≥ 20
- PostgreSQL 16 (or Docker)

## Setup
```bash
cd back-end
npm install
# configure .env (see table below)
```

### Environment (`.env`)
| Variable | Description |
| --- | --- |
| `DB_HOST` `DB_PORT` `DB_DATABASE` `DB_USERNAME` `DB_PASSWORD` | PostgreSQL connection |
| `JWT_SECRET` | Secret for signing access tokens (use a long random value) |
| `JWT_EXPIRES_IN` | Access-token lifetime (default `1d`) |
| `PORT` | API port (default `3000`) |

## Run

### With Docker (recommended)
```bash
docker compose up -d
```
Starts PostgreSQL and the API. The API container waits for the DB, runs migrations,
and seeds demo data automatically. API is exposed on **http://localhost:4000**.

### Locally
```bash
npm run db:migrate     # create tables (needs a running Postgres)
npm run db:seed        # insert demo data
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
| `npm run db:seed` | Seed demo data |
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
