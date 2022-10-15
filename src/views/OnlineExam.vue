<template lang="pug">
.online-exam
  Page.pb-5(
    full-width,
    title="Online Exam",
    subtitle="50 minutes",
    :breadcrumbs="[{content: 'DashBoard', url: '/'}]",
  )
    Layout
      LayoutSection
        Card
          template(#title)
            Text(as="h3" variant="heading2xl" alignment="center") {{ $t('online_exam.exam_title') }}
          CardSection
            Question(@update-answers="handleAnswerChange")
          CardSection
            Question(@update-answers="handleAnswerChange")
          CardSection
            Question(@update-answers="handleAnswerChange")
          CardSection
            Question(@update-answers="handleAnswerChange")
          Stack.pb-4(distribution="center")
            Button(primary, @click="handleSubmitAnswer") {{ $t('online_exam.submit_answer') }}
      Modal(
        :open="isShowSubmitAnswerModal",
        :primary-action="{ content: $t('online_exam.submit_answer') }",
        :secondary-actions="[{content: $t('online_exam.back_to_exam'), onAction: toggleModalSubmitAnswer }]",
        @close="toggleModalSubmitAnswer",
      )
        template(#title)
          span {{ $t('online_exam.sure_to_submit') }}
        template(#content)
          Card(sectioned)
            span(
              v-if="isShowNotFillAllQuestion"
            ) {{ $t('online_exam.not_fill_all_question')}}

      LayoutSection.sticky-block(:one-third="true")
        Card
          template(#title)
            Text(as="h4" variant="heading2xl" alignment="center") {{ $t('online_exam.question') }}
          CardSection
            Stack
              Button(
                v-for="(question, index) in questions"
                :disabled="question.disabled"
              ) {{index + 1}}
          CardSection
            CountDownBox(
              :time="60*60*20*50",
            )
    Layout
      LayoutSection(:one-third="true")
        Grid
          GridCell(:column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }")
            Select(
              :placeholder="$t('select_exam.choose_type')",
              v-model="examType",
              :options="chapters",
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Question, CountDownBox, ExamTest } from '@/components/online-exam';
import { CHAPTER, LEVELS } from '@/configs/onlineExam';

const examType = ref('');
const examLevel = ref('');
const isShowSubmitAnswerModal = ref(false);
const isShowNotFillAllQuestion = ref(false);

const chapters = CHAPTER.map((chapter, index) => {
  return {
    label: `${index + 1}. ${chapter.name}`,
    value: chapter.name,
  };
});

const currenAnswers = reactive({
  '1': '',
  '2': '',
  '3': '',
  '4': '',
});

const questions = reactive([
  {
    id: '1',
    number: 'Câu 1',
    question: "Một vật dao động điều hòa trên trục Ox quanh vị trí cân bằng O. Gọi A, ω và φ lần lượt là biên độ, tần số góc và pha ban đầu của dao động. Biểu thức li độ của vật theo thời gian t là",
    answers: [
      "A. x = Acos(ωt + φ).",
      "B. x = Acos(ωt + φ).",
      "C. x = Acos(ωt + φ).",
      "D. x = Acos(ωt + φ).",
    ],
    true_answer: "A. x = Acos(ωt + φ).",
    instructions: "",
    level: 3,
    tags: [
      "Dao động cơ",
      "Chương 1",
      "Dao động điều hòa",
    ],
    disabled: false,
  },
  {
    id: '2',
    number: 'Câu 2',
    question: "Một vật dao động điều hòa trên trục Ox quanh vị trí cân bằng O. Gọi A, ω và φ lần lượt là biên độ, tần số góc và pha ban đầu của dao động. Biểu thức li độ của vật theo thời gian t là",
    answers: [
      "A. x = Acos(ωt + φ).",
      "B. x = Acos(ωt + φ).",
      "C. x = Acos(ωt + φ).",
      "D. x = Acos(ωt + φ).",
    ],
    true_answer: "A. x = Acos(ωt + φ).",
    instructions: "",
    level: 3,
    tags: [
      "Dao động cơ",
      "Chương 1",
      "Dao động điều hòa",
    ],
  },
  {
    id: '3',
    number: 'Câu 3',
    question: "Một vật dao động điều hòa trên trục Ox quanh vị trí cân bằng O. Gọi A, ω và φ lần lượt là biên độ, tần số góc và pha ban đầu của dao động. Biểu thức li độ của vật theo thời gian t là",
    answers: [
      "A. x = Acos(ωt + φ).",
      "B. x = Acos(ωt + φ).",
      "C. x = Acos(ωt + φ).",
      "D. x = Acos(ωt + φ).",
    ],
    true_answer: "A. x = Acos(ωt + φ).",
    instructions: "",
    level: 3,
    tags: [
      "Dao động cơ",
      "Chương 1",
      "Dao động điều hòa",
    ],
    disabled: false,
  },
  {
    id: '4',
    number: 'Câu 4',
    question: "Một vật dao động điều hòa trên trục Ox quanh vị trí cân bằng O. Gọi A, ω và φ lần lượt là biên độ, tần số góc và pha ban đầu của dao động. Biểu thức li độ của vật theo thời gian t là",
    answers: [
      "A. x = Acos(ωt + φ).",
      "B. x = Acos(ωt + φ).",
      "C. x = Acos(ωt + φ).",
      "D. x = Acos(ωt + φ).",
    ],
    true_answer: "A. x = Acos(ωt + φ).",
    instructions: "",
    level: 3,
    tags: [
      "Dao động cơ",
      "Chương 1",
      "Dao động điều hòa",
    ],
    disabled: false,
  },
]);

const handleAnswerChange = (newAnswer: Record<string, any>): void => {
  currenAnswers[newAnswer.id] = newAnswer.answer;

  const questionUpdate = questions.find(question => question.id === newAnswer.id);

  if (questionUpdate) {
    questionUpdate.disabled = true;
  }
};

const toggleModalSubmitAnswer = () => {
  isShowSubmitAnswerModal.value = !isShowSubmitAnswerModal.value;
};

const handleSubmitAnswer = () => {
  toggleModalSubmitAnswer();

  const isFillAllQuestions = questions.some(question => question.disabled);

  if (!isFillAllQuestions) {
    isShowNotFillAllQuestion.value = true;
  }
};

const calculatePoints = () => {
  return;
};



</script>
