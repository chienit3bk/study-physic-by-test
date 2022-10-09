<template lang="pug">
CardSection
  template(#title) {{question.number}}
  p {{ question.question }}
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

const emit = defineEmits(['updateAnswers']);
const question = {
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
};

const user_answer = ref('');
const choices = question.answers.map((answer: string) => {
  return {
    label: answer,
    value: answer,
  };
});

const handleAnswerChange = () => {
  const newAnswer = {
    id: question.id,
    answer: user_answer.value,
  };

  emit('updateAnswers', newAnswer);
};
</script>
