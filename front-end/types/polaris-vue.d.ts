// Registers @ownego/polaris-vue components as Vue GlobalComponents so that
// vue-tsc type-checks them inside templates. v2 ships these at dist/volar.d.ts;
// the package's exports map blocks the bare type-reference path, so we point
// at the file directly.
/// <reference path="../node_modules/@ownego/polaris-vue/dist/volar.d.ts" />
