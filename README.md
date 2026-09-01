# study-physic-by-test

A physics quiz / online-exam platform. Admins manage a tagged question bank and study
documents; students generate exams from chosen topics, take timed tests, and track
their results.

This repository is a monorepo with a **TypeScript REST API** and a **Vue 3 SPA**, both
on current major versions.

## Run locally in 5 commands

```bash
git clone git@github.com:chienit3bk/study-physic-by-test.git && cd study-physic-by-test
npm install && npm run setup      # root tools + copies .env.example -> .env + installs both apps
npm run db:up                     # PostgreSQL 16 in Docker (localhost:4002)
npm run db:migrate && npm run db:seed && npm run db:seed:sql
npm run dev                       # API http://localhost:3000 · Web http://localhost:3600
```

## Tech stack

| Area | Stack |
| --- | --- |
| **Back-end** | TypeScript (strict) · Express 5 · Sequelize 6 · PostgreSQL 16 · JWT auth (bcrypt) · winston |
| **Front-end** | Vue 3 · Vite · Polaris-Vue · Pinia · vue-router · vue-i18n · pug templates · SCSS |
| **Tooling** | Node ^20.19 or ≥22.12 · tsx · vue-tsc · ESLint (flat config) · Docker Compose |

## Repository layout

```
study-physic-by-test/
├── back-end/        # REST API (TypeScript) — see back-end/README.md
│   └── database/    # schema.sql · seed.sql · ERD.mermaid
├── front-end/       # Vue 3 SPA — see front-end/README.md
├── .claude/         # Claude Code agents + skills — see .claude/README.md
├── package.json     # root runner scripts (setup, db:*, dev, build, typecheck)
├── CLAUDE.md        # project context & conventions for AI assistants
└── README.md        # you are here
```

## Quick start

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (see `.nvmrc`) and npm
- Docker (recommended for the database/API) — or a local PostgreSQL 16

### Root scripts (recommended)

```bash
npm install            # root devDependencies (concurrently)
npm run setup          # copies each app's .env.example -> .env, then npm install in both
npm run db:up          # start only PostgreSQL (Docker), host port 4002
npm run db:migrate     # create tables
npm run db:seed        # demo users
npm run db:seed:sql    # demo tags/questions/documents (idempotent, via psql)
npm run dev            # runs API (dev:api) and Web (dev:web) together
```

Edit `back-end/.env` (JWT secrets especially) and `front-end/.env` (`VITE_API_URL`) after
`npm run setup` creates them from the `.env.example` templates.

### Alternative: everything in Docker

Runs PostgreSQL **and** the API in containers; the API waits for the DB, runs
migrations, and seeds automatically.

```bash
cp back-end/.env.example back-end/.env   # DB_HOST/DB_PORT are overridden by compose for the container
npm run up                               # API → http://localhost:4000
```

Point the front-end at the containerized API and run it on the host:

```bash
# in front-end/.env
VITE_API_URL=http://localhost:4000
npm run dev:web                          # app → http://localhost:3600
```

### Ports

| Service | Port |
| --- | --- |
| Front-end (Vite dev server) | 3600 |
| Back-end API — host run (`npm run dev:api`) | 3000 |
| Back-end API — Docker (`npm run up`) | 4000 (host) → 3000 (in-network) |
| PostgreSQL — host (`npm run db:up`) | 4002 (host) → 5432 (in-network) |

### Environment

`.env` files are git-ignored; each app ships a `.env.example` template — never commit `.env`.

| Variable | App | Default | Required? |
| --- | --- | --- | --- |
| `DB_HOST` | back-end | `127.0.0.1` | Yes — `localhost` for host runs, `physic-test-postgres` in Docker |
| `DB_PORT` | back-end | `5432` | Yes — `4002` for host runs against `db:up` |
| `DB_DATABASE` | back-end | `study_physic_by_test` | Yes |
| `DB_USERNAME` | back-end | `study_physic_by_test` | Yes |
| `DB_PASSWORD` | back-end | none | Yes |
| `JWT_SECRET` | back-end | `''` (logs an error at startup if unset) | Yes |
| `JWT_EXPIRES_IN` | back-end | `1d` | No |
| `REFRESH_TOKEN_SECRET` | back-end | a hardcoded fallback — override it | Yes |
| `REFRESH_TOKEN_EXPIRES_IN` | back-end | `2d` | No |
| `SALT_ROUND` | back-end | `10` | No |
| `PORT` | back-end | `DEV_APP_PORT` or `3000` | No |
| `APP_NAME` | back-end | `iLrn` | No |
| `NODE_ENV` | back-end | `development` | No |
| `VITE_API_URL` | front-end | none | Yes — API base URL the SPA calls |

### Demo accounts

`npm run db:seed` creates the user accounts below (password **`123456`** for all);
`npm run db:seed:sql` additionally inserts sample tags, questions, and documents.

| Email | Role |
| --- | --- |
| `admin@test.com` | admin |
| `student@test.com` | user |
| `test0@test.com` | user |
| `test1@test.com` | user |
| `test2@test.com` | user |

### Troubleshooting

- **`physic-test-postgres` container fails to start / `POSTGRES_DB` unset warnings** —
  `back-end/.env` is missing; the compose file reads `DB_DATABASE`/`DB_USERNAME`/
  `DB_PASSWORD` from it. Run `npm run setup` (or `cp back-end/.env.example back-end/.env`) first.
- **`getaddrinfo ENOTFOUND physic-test-postgres`** — you're running the API on the host
  with a Docker-style `DB_HOST`. Host runs need `DB_HOST=localhost` and `DB_PORT=4002`
  (the `.env.example` default); that hostname only resolves inside the compose network.
- **Port already in use** — something else is bound to 3000/3600/4000/4002; stop it or
  change the relevant port.
- **Vite refuses to start on Node 20.0–20.18** — front-end/root `engines` require
  `^20.19.0` or `>=22.12.0`; run `nvm install 22 && nvm use 22` (see `.nvmrc`).
- **`npm run db:reset` wipes data** — it runs `migrate:undo:all` before re-migrating and
  seeding; don't run it against data you want to keep.
- **Reset the Postgres volume** — stop the DB (`npm run db:down`) and delete
  `back-end/data` (the bind-mounted volume), then `npm run db:up` again.
- **Docker not running** — `npm run db:up` / `npm run up` need the Docker daemon; start
  Docker Desktop/OrbStack first.

## Common commands

| | Root | Back-end (`cd back-end`) | Front-end (`cd front-end`) |
| --- | --- | --- | --- |
| Setup | `npm run setup` | `npm install` | `npm install` |
| Dev server | `npm run dev` (both) · `dev:api` · `dev:web` | `npm run dev` | `npm run dev` |
| Build | `npm run build` | `npm run build` | `npm run build` |
| Type-check | `npm run typecheck` | `npm run typecheck` | `npm run typecheck` |
| Lint | `npm run lint` | — | `npm run lint` |
| DB up / down | `npm run db:up` · `db:down` | `docker compose up -d` | — |
| DB migrate / seed / reset | `npm run db:migrate` · `db:seed` · `db:seed:sql` · `db:reset` | `npm run db:migrate` · `db:seed` · `db:seed:sql` · `db:reset` | — |
| Everything in Docker | `npm run up` / `npm run down` | `docker compose up -d` | — |

## Documentation

- [`back-end/README.md`](./back-end/README.md) — API setup, scripts, endpoints, structure
- [`front-end/README.md`](./front-end/README.md) — SPA setup, scripts, conventions
- [`back-end/database/README.md`](./back-end/database/README.md) — schema, ERD, seed data
- [`CLAUDE.md`](./CLAUDE.md) — architecture and coding conventions
- [`.claude/README.md`](./.claude/README.md) — the agent suite and skills

## Working with Claude (agents & skills)

This project ships a [Claude Code](https://docs.claude.com/en/docs/claude-code) setup in
[`.claude/`](./.claude/README.md) to help develop and continuously improve the product:

**Agents** (a quality-focused self-improvement loop):

- **code-reviewer** — review changes before a PR (correctness, types, conventions)
- **test-writer** — bootstrap and grow the test suite
- **security-auditor** — audit auth, queries, and dependencies before releases

**Skills** (task playbooks Claude loads on demand):

- **add-api-resource** — scaffold a new backend entity + CRUD endpoints
- **database-workflow** — migrations, seeding, schema/ERD upkeep
- **frontend-feature** — scaffold a Vue view/component, store, and route

Invoke an agent by asking, e.g. *"Use the code-reviewer agent on my staged changes."*
Skills load automatically when your request matches.

## Development guidelines

- **Type safety first.** `npm run typecheck` must stay clean on both apps, and the
  front-end `vite build` must pass.
- **Back-end:** controllers are classes of `static` handlers that use the shared `crud`
  helper and `sendError`; models follow the Sequelize `InferAttributes` pattern; routes
  use plain `/:id` params; secrets only via `src/config` (never commit `.env`).
- **Front-end:** templates in pug; follow Polaris-Vue v2 prop rules (e.g. `TextField`
  needs `autoComplete`); Pinia stores use `defineStore('id', { ... })`; API calls go
  through the axios interceptor.
- **Definition of done:** types pass, behaviour is tested, and the change has been
  through the **code-reviewer** (and **security-auditor** for auth/data changes).

See [`CLAUDE.md`](./CLAUDE.md) for the complete conventions.

## Security note

`back-end/.env` and `front-end/.env` were tracked in git history before this change —
rotate `JWT_SECRET` (and `REFRESH_TOKEN_SECRET`) if you deployed with the committed value.
