<template lang="pug">
.online-exam
  Page.pb-5(
    full-width,
    :title="$t('online_exam.title')",
    :subtitle="`${exam.time} ${$t('common.minute')}`",
    :breadcrumbs="[{content: 'OnlineExam', url: '/online-exam'}]",
  )
    Banner(
      v-if="!isSubmited"
      title="Không tải lại trang lúc làm bài thi",
      status="warning"
    )
    Layout.mt-2(v-if="data.questions.length")
      LayoutSection.sticky-block(:one-half="true")
        Card
          template(#title)
            Text(as="h4" variant="heading2xl" alignment="center") {{ $t('online_exam.question') }}
          CardSection
            Stack
              Button(
                v-for="(question, index) in data.questions",
                :primary="!!question.current_answer",
                @click="handleButtonChangeQuestion(question, index)",
              ) {{index + 1}}
          CardSection
            CountDownBox(
              :time="1000*60*exam.time",
            )
          Stack.pb-4(distribution="center")
            Button(primary, @click="requestSubmitAnswer", :disabled="isSubmited ") {{ $t('online_exam.submit_answer') }}

        Card.mt-4(v-if="!isSubmited")
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
              :tags="currentQuestion.tags",
              :current-answer="currentQuestion.current_answer || null",
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
        Card(v-else)
          template(#title)
            Text(as="h3" variant="heading2xl" alignment="center") Kết quả
            CardSection
              Stack(vertical)
                TextStyle(variation="strong") Số câu đúng: {{ numberTrueAnswer() }}
                TextStyle(variation="strong") Thời gian làm bài:
                TextStyle(variation="negative") Điểm số: {{  numberTrueAnswer() / data.questions.length * 10 }}

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
              :number="`Câu ${index + 1}`",
              :question="question.question",
              :answers="question.answers",
              :instructions="question.instructions",
              :level="question.level",
              :tags="question.tags",
              :current-answer="question.current_answer || null"
              :is-view-only="true",
              :true-answer="currentQuestion.true_answer",
              :is-submited="isSubmited",
            )

Modal(
  :open="isShowSubmitAnswerModal",
  :primary-action="{ content: $t('online_exam.submit_answer'), onAction: handleSubmitAnser }",
  :secondary-actions="[{content: $t('online_exam.back_to_exam'), onAction: toggleModalSubmitAnswer }]",
  @close="toggleModalSubmitAnswer",
)
  template(#title)
    span {{ $t('online_exam.sure_to_submit') }}
  template(#content v-if="isShowNotFillAllQuestion")
    Card(sectioned)
      span {{ $t('online_exam.not_fill_all_question')}}

</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Question, CountDownBox } from '@/components/online-exam';
import type { QuestionType } from '@/types';
import { questionsFake } from './dataFake';

const route = useRoute();
const isShowSubmitAnswerModal = ref<boolean>(false);
const isShowNotFillAllQuestion = ref<boolean>(false);
const isSubmited = ref<boolean>(false);
const currentQuestionIndex = ref<number>(0);
const currentQuestion = ref<Record<string, any>>({});

const exam = reactive({ id: '', time: 0 });
const data = reactive<Record<string, QuestionType[]>>({questions: []});

const disabledPaginationButton = computed(() => {
  return {
    prev: currentQuestionIndex.value !== 0,
    next: currentQuestionIndex.value !== data.questions.length -1 };
});

const showPrevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value -= 1;
    currentQuestion.value = data.questions[currentQuestionIndex.value];
  }
};

const showNextQuestion = () => {
  if (currentQuestionIndex.value < data.questions.length - 1) {
    currentQuestionIndex.value += 1;
    currentQuestion.value = data.questions[currentQuestionIndex.value];
  }
};


onMounted(() => {
  if (route.params?.id) {
    exam.id = route.params.id as string;
    exam.time = parseInt(route.params.time as string);
    data.questions = questionsFake;
    currentQuestion.value = data.questions[0];
  }
});

const handleAnswerChange = (newAnswer: Record<string, any>): void => {
  currentQuestion.value.current_answer = newAnswer.answer;
  const questionUpdate = data.questions.find(question => question.id === newAnswer.id);

  if (questionUpdate) {
    questionUpdate.current_answer = newAnswer.answer;
  }
};

const handleButtonChangeQuestion = (question: Record<string, any>, index: number) => {
  currentQuestionIndex.value = index;
  currentQuestion.value = question;
};

const toggleModalSubmitAnswer = () => {
  isShowSubmitAnswerModal.value = !isShowSubmitAnswerModal.value;
};

const requestSubmitAnswer = () => {
  toggleModalSubmitAnswer();

  const isFillAllQuestions = data.questions.some(question => question.current_answer);

  if (!isFillAllQuestions) {
    isShowNotFillAllQuestion.value = true;
  }
};

const numberTrueAnswer = () => {
  return data.questions.reduce((sum, question) => {
    if (question.current_answer === question.true_answer) {
      return sum + 1;
    }

    return sum;
  }, 0)

}

const handleSubmitAnser = () => {
  isSubmited.value = true;
}



const calculatePoints = () => {
  return;
};

</script>
