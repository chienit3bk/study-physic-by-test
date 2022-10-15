<template lang="pug">
CardSection
  template(#title) {{number}}
  p {{ question }}
  ChoiceList(
    v-model="user_answer",
    name="singleChoiceList",
    :choices="choices",
    @change="handleAnswerChange"
  )
  Button(plain)
    TextStyle(variation="negative") Xem hướng dẫn
</template>
<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  id: string,
  number: string,
  question: string,
  answers: Record<string, any>,
  instructions: string,
  level: number,
  tags: string[],
}

const props = defineProps<Props>();

const emit = defineEmits(['updateAnswers']);

const user_answer = ref('');

const choices = props.answers.map((answer: string) => {
  return {
    label: answer,
    value: answer,
  };
});

const handleAnswerChange = () => {
  const newAnswer = {
    id: props.id,
    answer: user_answer.value,
  };

  emit('updateAnswers', newAnswer);
};
</script>
