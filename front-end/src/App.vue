<template lang="pug">
AppProvider
  AppLayout
    router-view
</template>

<script setup lang="ts">
import { AppLayout } from '@/layout';
</script>

<style lang="scss">
@import '@/scss/app.scss';
</style>
