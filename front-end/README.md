# Front-end — study-physic-by-test

Single-page app for the physics quiz platform. **Vue 3 + Vite + Polaris-Vue + Pinia +
vue-router + vue-i18n.** Templates are written in **pug**; the codebase is fully typed
and checked with vue-tsc.

## Requirements
- Node.js ≥ 20

## Setup
```bash
cd front-end
npm install
# set VITE_API_URL in .env (e.g. http://localhost:4000)
```

## Run
```bash
npm run dev        # Vite dev server (default http://localhost:3600)
```

## Scripts
| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run typecheck` | `vue-tsc --noEmit` (must be 0 errors) |
| `npm run build:check` | Type-check **and** build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint (flat config) |

## Structure
```
front-end/
├── src/
│   ├── main.ts            # app bootstrap (pinia, router, i18n, Polaris)
│   ├── App.vue
│   ├── router/            # vue-router routes
│   ├── stores/            # Pinia stores (defineStore('id', {...}))
│   ├── views/ · components/   # pages and UI (pug + Polaris-Vue)
│   ├── layout/            # AppLayout
│   ├── bootstrap/         # axios interceptor (auth, baseURL, 401 handling)
│   ├── lang/              # vue-i18n setup + vi.ts messages
│   ├── configs/ · services/ · scss/
│   └── types.ts
├── types/                 # ambient .d.ts (env, svg, polaris-vue global components)
├── vite.config.ts · tsconfig.json · eslint.config.js
└── index.html
```

## Conventions
- **Templates use pug** (`<template lang="pug">`).
- **Polaris-Vue v2:** `TextField` requires `autoComplete`; `Select`/`OptionList`
  options are `{ label, value }[]`; `OptionList` uses `:selected` + `@change`.
  Icons: `import X from '@icons/<Name>Icon.svg?component'` (v9 `*Icon` names).
- **Pinia 3:** `defineStore('id', { ... })`.
- **API:** call through `@/bootstrap/api-interceptor` (adds the Bearer token, unwraps
  `response.data`, redirects to `/logout` on 401).
- **i18n:** `$t('key')` in templates; add strings to `src/lang/vi.ts`.

Keep `npm run typecheck` at 0 errors. See `../CLAUDE.md` and `../.claude/` for the full
conventions, agents, and skills.
