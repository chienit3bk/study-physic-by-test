<template lang="pug">
CardSection
  template(#title) {{ number }}
  p {{ question }}
  Stack.pt-3(v-if="isViewOnly" distribution="fillEvenly")
    Text(
      v-for="choice in choices",
      :key="choice.value",
      as="p",
      variant="bodyMd",
    )
      TextStyle(:variation="choice.value === currentAnswer ? 'strong' : undefined") {{ choice.label }}
  ChoiceList(
    v-else,
    :id="id",
    :name="id",
    v-model="user_answer",
    :choices="choices",
    @change="handleAnswerChange"
  )

  Button(plain)
    TextStyle(variation="negative") {{ $t('question.see_help_answer') }}
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';

interface Props {
  id: string,
  number: string,
  question: string,
  answers: Record<string, any>,
  instructions: string,
  level: string,
  tags: string[],
  isViewOnly: boolean,
  currentAnswer?: string | null,
}

const props = defineProps<Props>();
const questionTimeStart = ref<number>(0);

onMounted(() => {
  if (!props.isViewOnly) {
    questionTimeStart.value = new Date().getTime();
  }
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
