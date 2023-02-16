<template lang="pug">
Card(sectioned)
  template(#title) {{ $t('user_history.list_exam') }}
  IndexTable(
    :item-count="userExam.length",
    :headings="headings",
    :selectable="false",
  )
    IndexTableRow(
      v-for="exam, index in userExam",
      :key="exam.id",
      :id="exam.id",
      :position="index",
    )
      IndexTableCell {{ exam.id }}
      IndexTableCell {{ exam.time }}
      IndexTableCell {{ exam.average_point }}
      IndexTableCell
        Stack
          Button(
            plain,
            :icon="ViewMinor",
          )
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
import { ref } from 'vue';
import ViewMinor from '@icons/ViewMinor.svg?component';

interface Props {
  userExam: Record<string, any>[];
}
const props = defineProps<Props>();

const isLoading = ref<boolean>(false);

const headings = [
  { title: 'Mã bài thi' },
  { title: 'Thời gian' },
  { title: 'Điểm' },
  { title: 'Hành động' },
]
</script>
