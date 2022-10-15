<template lang="pug">
.online-exam
  Page.pb-5(
    full-width,
    title="Online Exam",
    subtitle="50 minutes",
    :breadcrumbs="[isShowExam ? {content: 'OnlineExam', url: '/online-exam'} : {content: 'DashBoard', url: '/'} ]",
  )
    Layout(v-if="!isShowExam")
      LayoutSection
        Grid(
          :columns="{ xs: 1, sm: 4, md: 4, lg: 6, xl: 6 }"
        )
          GridCell
            Select(
              :placeholder="$t('select_exam.choose_type')",
              v-model="examChapter",
              :options="chapters",
            )
              template(#label) {{ $t('select_exam.chapter_label') }}
          GridCell(v-if="examChapter")
            Select(
              :placeholder="$t('select_exam.choose_type')",
              v-model="examChapterOptions",
              :options="chapterOptions",
            )
              template(#label) {{ $t('select_exam.chapter_options_label') }}
          GridCell(v-if="examChapterOptions")
            Select(
              :placeholder="$t('select_exam.choose_level')",
              v-model="examLevel",
              :options="LEVELS",
            )
              template(#label) {{ $t('select_exam.level_label')}}
      LayoutSection(full-width)
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
    Layout(v-else)
      LayoutSection
        Card
          template(#title)
            Text(as="h3" variant="heading2xl" alignment="center") {{ $t('online_exam.exam_title') }}
          CardSection(
            v-for="question in questions",
            :key="question.id",
          )
            Question(
              :id="question.id",
              :number="question.number",
              :question="question.question",
              :answers="question.answers",
              :instructions="question.instructions",
              :level="question.level",
              :tags="question.tags"
              @update-answers="handleAnswerChange"
            )

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
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Question, CountDownBox, ExamTest } from '@/components/online-exam';
import { CHAPTERS, LEVELS } from '@/configs/onlineExam';
import { questionsFake, examTestsFake } from './dataFake';

const examChapter = ref('');
const examChapterOptions = ref('');
const examLevel = ref('');
const isShowExam = ref(false);
const isShowSubmitAnswerModal = ref(false);
const isShowNotFillAllQuestion = ref(false);

const currenAnswers = reactive({});
const questions = reactive(questionsFake);
const exams = reactive(examTestsFake);

const chapters = CHAPTERS.map((chapter: Record<string, any>, index: number) => {
  return {
    label: `${index + 1}. ${chapter.name}`,
    value: chapter.id,
  };
});

const chapterOptions = computed(() => {
  const currentChapter = CHAPTERS.find((chapter: Record<string, any>) => chapter.id === examChapter.value);

  if (currentChapter) {
    return  currentChapter.options.map((option: string, index: number) => {
      return {
        label: `Dang ${index + 1}. ${option}`,
        value: option,
      };
    });
  }

  return [];
});

const handleAnswerChange = (newAnswer: Record<string, string>): void => {
  Object.assign(currenAnswers, newAnswer);

  const questionUpdate = questions.find(question => question.id === newAnswer.id);

  if (questionUpdate) {
    questionUpdate.disabled = true;
  }
};

const getAndShowQuestions = () => {
  isShowExam.value = true;
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
