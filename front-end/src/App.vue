<template lang="pug">
AppProvider
  router-view
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useAuthStore, useTagStore, useDocumentStore } from '@/stores';
import { useRouter } from 'vue-router';

const axios: any = inject('axios');
const router = useRouter();

const auth = useAuthStore();
const { getTags } = useTagStore();
const { getDocuments } = useDocumentStore();

const storageToken = localStorage.getItem('session_token');

if (storageToken) {
  auth.setuseAuthStore(storageToken);
  axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
} else {
  router.push({ name: 'login'});
}
getTags();
getDocuments();
</script>

<style lang="scss">
@import '@/scss/app.scss';
</style>
