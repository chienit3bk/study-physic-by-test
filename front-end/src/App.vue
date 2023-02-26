<template lang="pug">
AppProvider
  router-view
</template>

<script setup lang="ts">
import { authStore} from '@/stores';
import { useRouter } from 'vue-router';

const router = useRouter();

const auth = authStore();

if (localStorage.getItem('session_token')) {
  auth.setDefaultToken();
} else {
  router.push({ name: 'login'});
}

</script>

<style lang="scss">
@import '@/scss/app.scss';
</style>
