<template lang="pug">
.online-exam
  Page(
    :full-width="true"
    title="Online Exam"
    subtitle="50 minutes"
    :breadcrumbs="[{content: 'DashBoard', url: '/'}]"
  )
    Layout
      LayoutSection()
        Card
          template(#title)
            Text(as="h3" variant="heading2xl" alignment="center") Đề thi
          CardSection
            Question
          CardSection
            Question
          CardSection
            Question
          CardSection
            Question
      LayoutSection.sticky-block(:one-third="true")
        Card
          template(#title)
            Text(as="h4" variant="heading2xl" alignment="center") Câu hỏi
          CardSection
            Stack
              Button(v-for="(question, index) in questions") {{index + 10}}
</template>

<script setup lang="ts">
import { Question } from '@/components/online-exam';
const questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>
