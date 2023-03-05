<template lang="pug">
Page(
  :full-width="false",
  :title="$t('user_history.list_exam')",
  subtitle="Kết quả các bài kiểm tra mà học sinh đã làm."
  :breadcrumbs="[{content: 'DashBoard', url: '/'} ]",
)
  Card(sectioned)
    IndexTable(
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
        IndexTableCell {{ exam.time }}
        IndexTableCell {{ exam.total_question }}
        IndexTableCell {{ exam.total_true_answer }}
        IndexTableCell {{ exam.average_point }}
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
  const userExam = [
  {
    id: 1,
    time: 50,
    total_question: 40,
    total_true_answer: 30,
    average_point: 7.5,
  },
  {
    id: 1,
    time: 40,
    total_question: 28,
    total_true_answer: 25,
    average_point: 9,
  },
  {
    id: 1,
    time: 20,
    total_question: 15,
    total_true_answer: 9,
    average_point: 6,
  },
  {
    id: 1,
    time: 50,
    total_question: 50,
    total_true_answer: 40,
    average_point: 8,
  }
]

  const isLoading = ref<boolean>(false);
  const userResults = ref<Record<string, any>[]>(userExam)

  const headings = [
    { title: 'Mã bài thi' },
    { title: 'Thời gian' },
    { title: 'Số câu hỏi' },
    { title: 'Số câu trả lời đúng' },
    { title: 'Điểm' },
  ]
  </script>
