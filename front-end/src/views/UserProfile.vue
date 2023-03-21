<template lang="pug">
.user-profile
  Page(:title="$t('user_profile.title')")
    Layout
      LayoutSection(one-half)
        Card(sectioned)
          CardSection
            template(#title) {{ $t('user_profile.name') }}
            CardSubsection {{ useStore.name }}

          CardSection
            template(#title) {{ $t('user_profile.gmail') }}
            CardSubsection {{ useStore.email }}

          CardSection
            template(#title) {{ $t('user_profile.phone') }}
            CardSubsection {{ user.phone ||'-' }}

          CardSection
            template(#title) {{ $t('user_profile.address') }}
            CardSubsection {{ user.address || '-'}}
      LayoutSection(one-half)
        Card(sectioned)
          CardSection
            template(#title) {{ $t('user_profile.total_time') }}
            CardSubsection {{ user.total_time || '-' }}
          CardSection
            template(#title) {{ $t('user_profile.average_score') }}
            CardSubsection {{ user.average_score || '-' }}

</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useAuthStore } from '@/stores';

const useStore = useAuthStore();
console.log(useStore);

const user = {
  name: 'chien',
  gmail: 'chien@gmail.com',
  phone: '0123456789',
  address: 'Bình Xuyên, Vĩnh Phúc',
  total_time: '300',
  average_score: '6.8',
}
</script>
