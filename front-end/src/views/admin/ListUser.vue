<template lang="pug">
.user-list
  Page(
    full-width,
    :title="$t('list_user.title')",
    :subtitle="$t('list_user.subtitle')",
    :breadcrumbs="[{content: 'Dashboard', url: '/'}]"
  )
</template>
<script setup lang="ts">
</script>
