<template lang="pug">
Page(
  :full-width="false",
  :title="$t('user_history.list_exam')",
  subtitle="Kết quả các bài kiểm tra mà học sinh đã làm."
  :breadcrumbs="[{content: 'DashBoard', url: '/'} ]",
)
  Card(sectioned)
    IndexTable(
      :key="String(isLoading)"
      :item-count="userResults.length",
      :headings="headings",
      :selectable="false",
    )
      IndexTableRow(
        v-for="exam, index in userResults",
        :key="exam.id",
        :id="exam.id",
        :position="index",
      )
        IndexTableCell {{ exam.id }}
        IndexTableCell {{ exam.totalTime }} phút
        IndexTableCell {{ exam.totalQuestion }}
        IndexTableCell {{ exam.totalTrueQuestion }}
        IndexTableCell {{ exam.score }}
  //- .mt-3
  //-   Stack(distribution="center", alignment="center")
  //-     Pagination(
  //-       :key="String(isLoading)",
  //-       :has-previous="hasPreviousPage",
  //-       :has-next="hasNextPage",
  //-       @previous="handlePressPagination(metaData.current_page - 1)",
  //-       @next="handlePressPagination(metaData.current_page + 1)",
  //-     )
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { useAuthStore } from '@/stores';
import ViewMinor from '@icons/ViewMinor.svg?component';

const axios: any = inject('axios');
const userId = computed(() => useAuthStore().id);
const isLoading = ref<boolean>(false);
const userResults = ref<Record<string, any>[]>([])

const headings = [
  { title: 'Mã bài thi' },
  { title: 'Thời gian' },
  { title: 'Số câu hỏi' },
  { title: 'Số câu trả lời đúng' },
  { title: 'Điểm' },
]

async function getExamsResult() {
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }

  axios.get(`/api/results`)
    .then((examResult: Record<string, any>[]) => {
      userResults.value = examResult.filter((result: Record<string, any>) => result.UserId === userId.value);
    })
}

getExamsResult();
</script>
