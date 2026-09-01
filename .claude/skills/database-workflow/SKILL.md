---
name: database-workflow
description: Database tasks for study-physic-by-test — run/create/undo Sequelize migrations, seed demo data, reset the DB, and keep database/schema.sql + ERD in sync. Use for any schema change, migration, or local DB setup.
---

# Database workflow

PostgreSQL via Sequelize. Config: `back-end/config/sequelize-cli.cjs` (CLI) and
`back-end/src/config/database.ts` (app). Connection comes from `back-end/.env`.

## Run the database (Docker)
```bash
cd back-end
docker compose up -d                          # starts Postgres (+ api). Healthcheck-gated.
docker compose up -d physic-test-postgres     # Postgres only (host port 4002)
```
The api container's `entrypoint.sh` waits for Postgres, runs migrations, and seeds.
From the repo root, `npm run db:up` is the DB-only command above.

## Common commands (run in back-end/)
| Task | Command |
| --- | --- |
| Apply pending migrations | `npm run db:migrate` |
| Undo all migrations | `npm run db:migrate:undo` |
| Seed demo users | `npm run db:seed` (idempotent — skips if `admin@test.com` exists) |
| Seed demo tags/questions/documents | `npm run db:seed:sql` (runs `database/seed.sql` via `psql`, `ON CONFLICT DO NOTHING`) |
| Full reset (undo → migrate → seed) | `npm run db:reset` |

## Create a new migration
```bash
cd back-end
npx sequelize-cli migration:generate --name add_column_x_to_things
```
Edit the generated file in `migrations/` (CommonJS, `up`/`down`). Keep it reversible.
Mirror the change in the model under `src/models/` and run `npx tsc --noEmit`.

## Keep documentation in sync
After a schema change, update:
- `database/schema.sql` — the consolidated DDL (tables, FKs, indexes).
- `database/ERD.mermaid` — the entity-relationship diagram.
- `database/seed.sql` — if columns/required data changed.

Validate `schema.sql` + `seed.sql` without a server using the in-memory emulator:
```bash
npm i -D pg-mem   # if needed
node -e "const {newDb}=require('pg-mem');const fs=require('fs');const db=newDb();db.public.none(fs.readFileSync('database/schema.sql','utf8'));console.log('schema OK')"
```

## Demo accounts (after seeding)
`admin@test.com` (admin) / `student@test.com` / `test0@test.com` / `test1@test.com` /
`test2@test.com` — all password `123456`.

## Known gap (not fixed here)
The `create_users_table` migration doesn't declare `email` as `UNIQUE`, even though
`database/schema.sql` does (`users_email_unique`). Follow-up migration, not part of
this change.
