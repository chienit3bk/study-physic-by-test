<template lang="pug">
CardSection
  template(#title) {{ number }}
  p {{ question }}

  ChoiceList(
    :id="id",
    :name="id",
    v-model="user_answer",
    :choices="choices",
    @change="handleAnswerChange"
  )
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';

interface Props {
  id: string,
  number: string,
  question: string,
  answers: Record<string, any>,
  instructions?: string,
  level: string,
  tags: string[],
  trueAnswer?: string,
  currentAnswer?: string | null,
  isSubmited?: boolean,
}

const props = defineProps<Props>();

const questionTimeStart = ref<number>(0);

onMounted(() => {
  questionTimeStart.value = new Date().getTime();
});

const emit = defineEmits(['updateAnswers']);

const user_answer = ref<string>(props.currentAnswer || '');

const choices = props.answers.map((answer: string) => {
  return {
    label: answer,
    value: answer,
  };
});

const handleAnswerChange = () => {
  const timeDoing = new Date().getTime() - questionTimeStart.value;
  const newAnswer = {
    id: props.id,
    answer: user_answer.value,
    questionTime: timeDoing > 10000 ? timeDoing - 2000 : timeDoing,
  };

  emit('updateAnswers', newAnswer);
};

onUpdated(() => {
  questionTimeStart.value = new Date().getTime();
});

</script>
