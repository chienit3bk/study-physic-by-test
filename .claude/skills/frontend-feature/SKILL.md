---
name: frontend-feature
description: Scaffold a frontend feature for study-physic-by-test — a Vue 3 view or component (pug template + Polaris-Vue), an optional Pinia store, a route, and an API call through the axios interceptor. Use when adding a screen, component, or client-side data flow.
---

# Add a frontend feature

Frontend lives in `front-end/` (Vue 3 + Vite + Polaris-Vue v2 + Pinia + vue-router,
fully typed with vue-tsc). **Templates are written in pug.**

## Component / view — `src/components/...` or `src/views/...`
```vue
<template lang="pug">
Page(title="My feature")
  Card
    TextField(autoComplete="off" v-model="name" label="Name")
</template>

<script setup lang="ts">
import { ref } from 'vue';
const name = ref('');
</script>
```
Conventions:
- Polaris-Vue v2: `TextField` requires `autoComplete`; `Select`/`OptionList` options are
  `{ label, value }[]`; `OptionList` uses `:selected` + `@change` (no `v-model`).
- Register reusable components/views via the local `index.ts` barrel files.
- Import SVG icons from the Polaris set: `import XIcon from '@icons/XIcon.svg?component';`
  (use the v9 `*Icon` names — `Major`/`Minor` suffixes were removed).

## Pinia store — `src/stores/thing.ts`
Always use the id-first signature (Pinia 3):
```ts
import { defineStore } from 'pinia';
import axios from '@/bootstrap/api-interceptor';

export const useThingStore = defineStore('thing', {
  state: () => ({ things: [] as Record<string, any>[] }),
  actions: {
    async fetch() { this.things = await axios.get('/api/things'); },
  },
});
```
Export it from `src/stores/index.ts`.

## API calls
Use `@/bootstrap/api-interceptor` (axios instance). It prepends `VITE_API_URL`,
attaches the Bearer token, unwraps `response.data`, and redirects to `/logout` on 401.

## Route — `src/router/index.ts`
Add the route under the authenticated `AppLayout` children (or top-level for public
pages). Names are kebab-case.

## i18n
Use `$t('key')` in templates (global injection is on). Add strings to `src/lang/vi.ts`.

## Verify
```bash
cd front-end
npx vue-tsc --noEmit    # must be 0 errors
npx vite build          # must succeed
```
