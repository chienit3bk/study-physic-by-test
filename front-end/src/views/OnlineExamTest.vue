<template lang="pug">
.online-exam
  Page.pb-5(
    full-width,
    :title="$t('online_exam.title')",
    :subtitle="`${exam.time} ${$t('common.minute')}`",
    :breadcrumbs="[{content: 'OnlineExam', url: '/online-exam'}]",
  )
    Layout(v-if="data.questions.length")
      LayoutSection.sticky-block(:one-half="true")
        Card
          template(#title)
            Text(as="h4" variant="heading2xl" alignment="center") {{ $t('online_exam.question') }}
          CardSection
            Stack
              Button(
                v-for="(question, index) in data.questions",
                :primary="question.have_answer",
                @click="handleButtonChangeQuestion(question.id)",
              ) {{index + 1}}
          CardSection
            CountDownBox(
              :time="1000*60*exam.time",
            )
          Stack.pb-4(distribution="center")
            Button(primary, @click="handleSubmitAnswer") {{ $t('online_exam.submit_answer') }}

        Card.mt-4
          template(#title)
            Text(as="h4" variant="heading2xl" alignment="center") {{ $t('online_exam.current_question') }}
          CardSection
            Question(
              :id="currentQuestion.id",
              :number="currentQuestion.number",
              :question="currentQuestion.question",
              :answers="currentQuestion.answers",
              :instructions="currentQuestion.instructions",
              :level="currentQuestion.level",
              :tags="currentQuestion.tags"
              :current-answer="currentAnswers[currentQuestionIndex] || null",
              :is-view-only="false",
              @update-answers="handleAnswerChange"
            )
            Stack.pb-4(distribution="center")
              Pagination(
                :has-previous="disabledPaginationButton.prev",
                :has-next="disabledPaginationButton.next",
                :nextKeys="['']",
                :previousKeys="['j']",
                :nextTooltip="$t('online_exam.next_question')",
                :previousTooltip="$t('online_exam.prev_question')",
                @previous="showPrevQuestion",
                @next="showNextQuestion",
              ) {{ currentQuestion.number }}

      LayoutSection
        Card
          template(#title)
            Text(as="h3" variant="heading2xl" alignment="center") {{ $t('online_exam.exam_title') }}
          CardSection(
            v-for="question, index in data.questions",
            :key="index",
          )
            Question(
              :id="question.id",
              :number="question.number",
              :question="question.question",
              :answers="question.answers",
              :instructions="question.instructions",
              :level="question.level",
              :tags="question.tags",
              :current-answer="currentAnswers[index] || null"
              :is-view-only="true",,
            )

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

</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Question, CountDownBox } from '@/components/online-exam';
import type { QuestionType } from '@/types';
import { questionsFake } from './dataFake';

const route = useRoute();
const isShowSubmitAnswerModal = ref(false);
const isShowNotFillAllQuestion = ref(false);
const currentQuestionIndex = ref(0);
const currentAnswers = ref<Record<string | number, any>>({});
const exam = reactive({ id: '', time: 0 });

const data = reactive<Record<string, QuestionType[]>>({questions: []});

const disabledPaginationButton = computed(() => {
  return {
    prev: currentQuestionIndex.value !== 0,
    next: currentQuestionIndex.value !== data.questions.length -1 };
});

const currentQuestion = computed(() => {
  return { ...data.questions[currentQuestionIndex.value]};
});

onMounted(() => {
  if (route.params?.id) {
    exam.id = route.params.id as string;
    exam.time = parseInt(route.params.time as string);
    data.questions = questionsFake.map(question => ({...question, have_answer: false}));
  }
});

const handleAnswerChange = (newAnswer: Record<string, string>): void => {
  currentAnswers.value[currentQuestionIndex.value] = newAnswer.answer;
  const questionUpdate = data.questions.find(question => question.id === newAnswer.id);

  if (questionUpdate) {
    questionUpdate.have_answer = true;
  }
};

const handleButtonChangeQuestion = (questionId: string) => {
  const index = data.questions.findIndex((question: QuestionType) => question.id === questionId);

  currentQuestionIndex.value = index;
};

const toggleModalSubmitAnswer = () => {
  isShowSubmitAnswerModal.value = !isShowSubmitAnswerModal.value;
};

const handleSubmitAnswer = () => {
  toggleModalSubmitAnswer();

  const isFillAllQuestions = data.questions.some(question => question. have_answer);

  if (!isFillAllQuestions) {
    isShowNotFillAllQuestion.value = true;
  }
};

const showPrevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value -= 1;
  }
};

const showNextQuestion = () => {
  if (currentQuestionIndex.value < data.questions.length - 1) {
    currentQuestionIndex.value += 1;
  }
};


const calculatePoints = () => {
  return;
};
</script>
