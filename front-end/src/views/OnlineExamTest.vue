<template lang="pug">
.online-exam
  Page.pb-5(
    full-width,
    :title="$t('online_exam.title')",
    :subtitle="`${data.time} ${$t('common.minute')}`",
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
                :key="index",
                :primary="!!question.current_answer",
                @click="handleButtonChangeQuestion(question, parseInt(index))",
              ) {{ parseInt(index) > 8 ? index + 1 : `0${parseInt(index) + 1}` }}
          CardSection
            CountDownBox(
              v-if="!isSubmited",
              :time="1000*60*data.time",
              @end-countdown="handleCountDownEnd",
              @submit="handleCountDownAbort"
            )
          Stack.pb-4(distribution="center")
            Button(primary, @click="requestSubmitAnswer", :disabled="isSubmited ") {{ $t('online_exam.submit_answer') }}

        Card.mt-4(v-if="!isSubmited")
          template(#title)
            Text(as="h4" variant="heading2xl" alignment="center") {{ $t('online_exam.current_question') }}
          CardSection
            Question(
              :key="currentQuestion.id",
              :id="String(currentQuestion.id)",
              :number="`Câu ${currentQuestionIndex + 1}`",
              :question="currentQuestion.description",
              :answers="currentQuestion.answer",
              :instructions="currentQuestion.instruction",
              :level="String(currentQuestion.level)",
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
                TextStyle(variation="strong") Thời gian làm bài: {{ ((timeDoing.end - timeDoing.start) / 1000 / 60).toFixed(2) }} phút
                TextStyle(variation="negative") Điểm số: {{  numberTrueAnswer() / data.questions.length * 10 }}
            CardSection
              template(#title) Tài liệu tham khảo
              Stack(vertical)
                StackItem(
                  v-for="document, index in documentStore.documents"
                  :key="String(index)",
                )
                  TextStyle(variation="strong") {{ document.title }}
                  p {{ document.content }}

      LayoutSection
        Card
          template(#title)
            Text(as="h3" variant="heading2xl" alignment="center") {{ $t('online_exam.exam_title') }}
          CardSection(
            v-for="question, index in data.questions",
            :key="index",
          )
            Question(
              :key="String(currentQuestion.id)",
              :id="String(question.id)",
              :number="`Câu ${index + 1}`",
              :question="question.description",
              :answers="question.answer",
              :instructions="question.instruction",
              :level="String(question.level)",
              :tags="question.tags",
              :current-answer="question.current_answer || null"
              :is-view-only="true",
              :true-answer="question.trueAnswer",
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
import { ref, reactive, computed, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useDocumentStore, useAuthStore } from '@/stores';
import { Question, CountDownBox } from '@/components/online-exam';

const axios: any = inject('axios');
const route = useRoute();

const documentStore = useDocumentStore();
const authStore = useAuthStore();

const isShowSubmitAnswerModal = ref<boolean>(false);
const isShowNotFillAllQuestion = ref<boolean>(false);
const isSubmited = ref<boolean>(false);
const currentQuestionIndex = ref<number>(0);
const currentQuestion = ref<Record<string, any>>({});
const timeDoing = ref({
  start: 0,
  end: 0,
})

const data: {
  questions: Record<string, any>,
  time: number,
} = reactive({
  questions: [],
  time: 0
});

const examId = computed(() => route.params.id);

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

const handleAnswerChange = (newAnswer: Record<string, any>): void => {
  currentQuestion.value.current_answer = newAnswer.answer;
  const questionUpdate = data.questions.find((question: any) => question.id == newAnswer.id);

  if (questionUpdate) {
    questionUpdate.current_answer = newAnswer.answer;
    questionUpdate.questionTime = newAnswer.questionTime;
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

  const isFillAllQuestions = data.questions.every((question: any) => question.current_answer);

  if (!isFillAllQuestions) {
    isShowNotFillAllQuestion.value = true;
  } else {
    isShowNotFillAllQuestion.value = false;
  }
};

const numberTrueAnswer = () => {
  return data.questions.reduce((sum: any, question: any) => {
    if (question.current_answer === question.trueAnswer) {
      return sum + 1;
    }

    return sum;
  }, 0)

}

// const getDocuments = () => {
//   const document = data.questions.map(question => question. )
// };
const handleCountDownEnd = () => {
  isSubmited.value = true;
  timeDoing.value.end = new Date().getTime();
}

const handleCountDownAbort = () => {
  console.log(1);

}

// Action for submit answer
const handleSubmitAnser = () => {
  isSubmited.value = true;
  timeDoing.value.end = new Date().getTime();
  isShowSubmitAnswerModal.value = false;
  createExamResult();
  handleCountDownAbort();
}

const createExamResult = async () => {
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
  const questionTimes = data.questions
    .filter((question: Record<string, any>) => {
      const time = question.questionTime;
      return time && time > 1000 && time < 300000
    })
    .map((question: Record<string, any>) => {
      return {
        id: question.id,
        time: question.questionTime,
      }
    })

  axios.post('/api/results', {
    UserId: authStore.id,
    totalQuestion: data.questions.length,
    totalTrueQuestion: numberTrueAnswer(),
    totalTime: data.time,
    score: (numberTrueAnswer() * 10 / data.questions.length).toFixed(2),
    ExamId: route.params.id,
    questions: questionTimes,
  });
}

const updateQuestionTime = async () => {

};

async function getExams() {
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }

  axios.get(`/api/exams/${route.params.id}`)
    .then((exam: Record<string, any>) => {
      data.questions = exam.Questions;
      data.time = exam.time / 60;
      currentQuestion.value = data.questions[0];
    })
}

onMounted(async () => {
  if (examId.value) {
    getExams();
    timeDoing.value.start = new Date().getTime();
  }
});
</script>
