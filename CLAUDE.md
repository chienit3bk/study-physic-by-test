# CLAUDE.md

Project context for Claude when working in **study-physic-by-test** — a physics
quiz / online-exam platform (Vietnamese UI).

## Architecture

Monorepo with two apps:

- **`back-end/`** — REST API. TypeScript (strict), Express 5, Sequelize 6, PostgreSQL.
  Source in `src/`, compiled to `dist/`. CommonJS modules, `nodenext` resolution.
- **`front-end/`** — SPA. Vue 3 + Vite + Polaris-Vue v2 + Pinia + vue-router +
  vue-i18n. Templates are **pug**. Fully typed with vue-tsc.
- **`back-end/database/`** — `schema.sql`, `seed.sql`, `ERD.mermaid` (docs; runtime
  schema is built by Sequelize migrations).

## Commands

Root (repo root — runs both apps via `--prefix`):
- `npm run setup` — copies each app's `.env.example` → `.env`, then installs both
- `npm run dev` — API (`dev:api`) + Web (`dev:web`) together via `concurrently`
- `npm run db:up` / `db:down` — PostgreSQL only, in Docker (host port 4002)
- `npm run db:migrate` | `db:seed` | `db:seed:sql` | `db:reset`
- `npm run up` / `down` — everything in Docker (API on host port 4000)
- `npm run typecheck` / `build` / `lint` — fan out to both apps

Backend (`cd back-end`):
- `npm run dev` — hot-reload dev server (tsx watch)
- `npm run build` / `npm start` — compile to `dist/` / run compiled
- `npm run typecheck` — `tsc --noEmit` (must stay clean)
- `npm run db:migrate` | `db:seed` | `db:seed:sql` | `db:reset`
- `docker compose up -d` — Postgres + API

Frontend (`cd front-end`):
- `npm run dev` — Vite dev server
- `npm run build` — production build (Vite)
- `npm run typecheck` — `vue-tsc --noEmit` (must be 0 errors)
- `npm run lint` — ESLint (flat config)

## Conventions (do not drift from these)

**Backend**
- Controllers are classes with `static` handlers returning `Promise<void>`; they use
  the shared `crud` helper (`src/controllers/BaseController.ts`) and `sendError`
  (`src/utils/http.ts`). Do **not** reintroduce `extends BaseController` (it clashed
  with strict TS) or `res.send(status, body)` (gone in Express 5).
- Models use the Sequelize `InferAttributes` pattern; association mixins are declared.
  Register new models in `src/models/index.ts` and add to the `ModelName` union.
- Routes use plain `/:id` (no inline regex params). API routes sit behind JWT auth;
  admin-only routes add the `admin` middleware.
- Config/secrets only through `src/config`; never hard-code. `.env` is git-ignored;
  `.env.example` is the checked-in template — never commit a real `.env`.

**Frontend**
- Templates in pug. Polaris-Vue v2: `TextField` requires `autoComplete`;
  `Select`/`OptionList` options are `{ label, value }[]`; `OptionList` uses
  `:selected` + `@change`. Icons: `@icons/<Name>Icon.svg?component` (v9 naming).
- Pinia: `defineStore('id', { ... })`. API via `@/bootstrap/api-interceptor`.
  i18n strings in `src/lang/vi.ts`, used as `$t('key')`.

## Definition of done
Type checks pass on both apps, the frontend `vite build` succeeds, new behaviour has
tests, and changes have been through the **code-reviewer** (and **security-auditor**
for anything touching auth/data). See `.claude/` for the agents and skills.
