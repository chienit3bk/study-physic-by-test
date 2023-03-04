<template lang="pug">
.user-profile
  Page(:title="$t('user_profile.title')")
    Layout
      LayoutSection(one-half)
        Card(sectioned)
          CardSection
            template(#title) {{ $t('user_profile.name') }}
            CardSubsection {{ user.name }}

          CardSection
            template(#title) {{ $t('user_profile.gmail') }}
            CardSubsection {{ user.gmail }}

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

    .mt-3
      UserHistory(v-if="!isAdmin" :userExam="userExam")
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useAuthStore } from '@/stores';
import { UserHistory } from '@/components';

const isAdmin = inject('isAdmin', false);
const user = {
  name: 'chien',
  gmail: 'chien@gmail.com',
  phone: '0123456789',
  address: 'Hai Ba Trung, Hà Nội',
  total_time: '',
  average_score: '',
}
const userExam = [
  {
    id: 1,
    time: 50,
    average_point: 7.8,
  },
  {
    id: 1,
    time: 50,
    average_point: 7.8,
  },
  {
    id: 1,
    time: 50,
    average_point: 7.8,
  },
  {
    id: 1,
    time: 50,
    average_point: 7.8,
  }
]
</script>
