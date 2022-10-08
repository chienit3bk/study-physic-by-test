<template lang="pug">
.online-exam
  Page(
    full-width,
    title="Online Exam",
    subtitle="50 minutes",
    :breadcrumbs="[{content: 'DashBoard', url: '/'}]",
  )
    Layout
      LayoutSection(:one-third="true")
        Select(
          placeholder="Chọn dạng bài bạn muốn kiểm tra",
          v-model="examType",
          :options="options",
        )
          template(#label) Chọn dạng bài kiểm tra
      LayoutSection(full-width)
        Grid
          GridCell(:column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }")
            ExamTest
          GridCell(:column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }")
            ExamTest
          GridCell(:column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }")
            ExamTest
    //- Layout
    //-   LayoutSection
    //-     Card
    //-       template(#title)
    //-         Text(as="h3" variant="heading2xl" alignment="center") Đề thi
    //-       CardSection
    //-         Question
    //-       CardSection
    //-         Question
    //-       CardSection
    //-         Question
    //-       CardSection
    //-         Question
    //-   LayoutSection.sticky-block(:one-third="true")
    //-     Card
    //-       template(#title)
    //-         Text(as="h4" variant="heading2xl" alignment="center") Câu hỏi
    //-       CardSection
    //-         Stack
    //-           Button(v-for="(question, index) in questions") {{index + 10}}
    //-       CardSection
    //-         CountDownBox.qsc2-drawer-header__timer(
    //-           :time="60*60*20*50",
    //-         )

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Question, CountDownBox, ExamTest } from '@/components/online-exam';
const examType = ref('');
const options = [
  { "label": "Chương 1: Dao động cơ", "value": "chuong1" },
  { "label": "Chương 2: Sóng cơ", "value": "chuong2" },
  { "label": "Chương 3: Điện xoay chiều", "value": "chuong3" },
];
const questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>
