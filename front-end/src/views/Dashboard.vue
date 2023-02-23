<template lang="pug">
.dashboard
  Page(
    title="Các bài kiểm tra đánh giá năng lực",
    :full-width="false",
  )
    Card
      Tabs(:tabs="tabs" :selected="selectedTab" @select="handleTabChange")
        CardSection(:title="tabs[selectedTab].content")
          Grid
            GridCell(
              v-for="exam in exams"
              :key="exam.id",
              :column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }"
            )
              ExamTest(
                :id="exam.id",
                :title="exam.title",
                :numberQuestion="exam.number_question",
                :time="exam.time",
                :type="exam.type",
                :points="exam.points",
                @get-and-show-questions="getAndShowQuestions"
              )
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ExamTest } from '@/components/online-exam';
import { examTestsFake } from './dataFake';

const router = useRouter();

const selectedTab = ref(0);

const handleTabChange = (selectedTabIndex: number) => {
  selectedTab.value = selectedTabIndex;
};
const tabs = [
  {
    id: 'all',
    content: 'Toàn bộ',
    accessibilityLabel: 'Tất cả các bài thi',
    panelID: 'all',
  },
  {
    id: '2',
    content: '15 phút',
    panelID: '2',
  },
  {
    id: '3',
    content: '30 phút',
    panelID: '3',
  },
  {
    id: '4',
    content: '50 phút',
    panelID: '4 ',
  },
];

const exams = ref<Record<string, any>[]>(examTestsFake);

const getAndShowQuestions = (dataExam: Record<string, number>) => {
  router.push({name: 'online-exam-test', params: { id: dataExam.id , time: dataExam.time }});
};


// Created
</script>
