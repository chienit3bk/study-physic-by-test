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
      TextStyle(:variation="answerStyle(choice)") {{ choice.label }}
  ChoiceList(
    v-else,
    :id="id",
    :name="id",
    v-model="user_answer",
    :choices="choices",
    @change="handleAnswerChange"
  )
  Stack.mt-1(v-if="isSubmited" spacing="tight")
    Icon(v-if="currentAnswer === trueAnswer", :source="TickMinor", color="success")
    Icon(v-else, :source="CancelMinor", color="default")
    TextStyle(variation="negative") Đáp án: {{  trueAnswer }}

  Button(plain v-if="instructions && isSubmited" @click="isShowInstruction = !isShowInstruction") {{ $t('question.see_help_answer') }}
  Text(v-if="isShowInstruction" as="p", variant="bodyMd") {{ props.instructions }}
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import TickMinor from '@icons/TickMinor.svg?component';
import CancelMinor from '@icons/CancelMinor.svg?component';

interface Props {
  id: string,
  number?: string,
  question?: string,
  answers: Record<string, any>,
  instructions?: string,
  level?: string,
  tags?: string[],
  isViewOnly?: boolean,
  trueAnswer?: string,
  currentAnswer?: string | null,
  isSubmited?: boolean,
}

const props = defineProps<Props>();

const isShowInstruction = ref<boolean>(false);
const questionTimeStart = ref<number>(0);

const answerStyle = (choice: Record<string, any>) => {
  if (choice.value === props.currentAnswer) {
    return 'strong';
  }

  return undefined;
};

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
