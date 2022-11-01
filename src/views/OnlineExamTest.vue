<template lang="pug">
.online-exam
  Page.pb-5(
    full-width,
    :title="$t('online_exam.title')",
    :subtitle="`${exam.time} ${$t('common.minute')}`",
    :breadcrumbs="[{content: 'OnlineExam', url: '/online-exam'}]",
  )
    Layout(v-if="questions.length")
      LayoutSection.sticky-block(:one-half="true")
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
              :time="1000*60*exam.time",
            )
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
              @update-answers="handleAnswerChange"
            )
            Stack.pb-4(distribution="center")
              Pagination(
                has-previous
                has-next
                :nextKeys="['']"
                :previousKeys="['j']"
                :nextTooltip="$t('online_exam.next_question')"
                :previousTooltip="$t('online_exam.prev_question')"
                @previous="showPrevQuestion"
                @next="showNextQuestion"
              ) {{ currentQuestion.number }}

      LayoutSection
        Card
          template(#title)
            Text(as="h3" variant="heading2xl" alignment="center") {{ $t('online_exam.exam_title') }}
          CardSection(
            v-for="question, index in questions",
            :key="index",
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

</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Question, CountDownBox } from '@/components/online-exam';
import { questionsFake } from './dataFake';

const route = useRoute();
const isShowSubmitAnswerModal = ref(false);
const isShowNotFillAllQuestion = ref(false);

const questions = reactive(questionsFake);
const currentQuestion = reactive(questions[0]);
const currenAnswers = reactive({});
const exam = reactive({
  id: '',
  time: 0,
});

onMounted(() => {
  if (route.params?.id) {
    exam.id = route.params.id as string;
    exam.time = parseInt(route.params.time as string);
    Object.assign(questions, questionsFake);
  }
});

const handleAnswerChange = (newAnswer: Record<string, string>): void => {
  Object.assign(currenAnswers, newAnswer);

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

const showPrevQuestion = () => {
  return;
};

const showNextQuestion = () => {
  return;
};



const calculatePoints = () => {
  return;
};
</script>
