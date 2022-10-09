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
        Grid
          GridCell(:column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }")
            Select(
              :placeholder="$t('select_exam.choose_type')",
              v-model="examType",
              :options="TYPE_OPTIONS",
            )
              template(#label) {{ $t('select_exam.type') }}
          GridCell(:column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }")
            Select(
              :placeholder="$t('select_exam.choose_level')",
              v-model="examLevel",
              :options="LEVELS",
            )
              template(#label) {{ $t('select_exam.level')}}
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
import { TYPE_OPTIONS, LEVELS } from '@/configs/onlineExam';
const examType = ref('');
const examLevel = ref('');

const questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>
