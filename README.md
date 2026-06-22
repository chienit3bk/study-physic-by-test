# study-physic-by-test

A physics quiz / online-exam platform. Admins manage a tagged question bank and study
documents; students generate exams from chosen topics, take timed tests, and track
their results.

This repository is a monorepo with a **TypeScript REST API** and a **Vue 3 SPA**, both
on current major versions.

## Tech stack

| Area | Stack |
| --- | --- |
| **Back-end** | TypeScript (strict) · Express 5 · Sequelize 6 · PostgreSQL 16 · JWT auth (bcrypt) · winston |
| **Front-end** | Vue 3 · Vite · Polaris-Vue · Pinia · vue-router · vue-i18n · pug templates · SCSS |
| **Tooling** | Node ≥ 20 · tsx · vue-tsc · ESLint (flat config) · Docker Compose |

## Repository layout

```
study-physic-by-test/
├── back-end/        # REST API (TypeScript) — see back-end/README.md
│   └── database/    # schema.sql · seed.sql · ERD.mermaid
├── front-end/       # Vue 3 SPA — see front-end/README.md
├── .claude/         # Claude Code agents + skills — see .claude/README.md
├── CLAUDE.md        # project context & conventions for AI assistants
└── README.md        # you are here
```

## Quick start

### Prerequisites

- Node.js ≥ 20 and npm
- Docker (recommended for the database/API) — or a local PostgreSQL 16

### 1. Back-end

With Docker (starts PostgreSQL **and** the API, runs migrations + seeds automatically):

```bash
cd back-end
npm install
docker compose up -d        # API → http://localhost:4000
```

Or fully local (requires a running PostgreSQL configured in `back-end/.env`):

```bash
cd back-end
npm install
npm run db:migrate          # create tables
npm run db:seed             # demo data
npm run dev                 # API → http://localhost:3000
```

### 2. Front-end

```bash
cd front-end
npm install
# set VITE_API_URL in .env to the API URL (e.g. http://localhost:4000)
npm run dev                 # app → http://localhost:3600
```

### Demo accounts

After seeding, log in with any of these (password **`123456`**):

- `admin@test.com` — admin
- `student@test.com` — user
- `test0@test.com` — user

## Common commands

| | Back-end (`cd back-end`) | Front-end (`cd front-end`) |
| --- | --- | --- |
| Dev server | `npm run dev` | `npm run dev` |
| Build | `npm run build` | `npm run build` |
| Type-check | `npm run typecheck` | `npm run typecheck` |
| Lint | — | `npm run lint` |
| DB migrate / seed / reset | `npm run db:migrate` · `db:seed` · `db:reset` | — |

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
