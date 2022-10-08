<template lang="pug">

CardSection
  template(#title) {{question.number}}
  p {{ question.question }}
  ChoiceList(
    v-model="user_answer",
    name="singleChoiceList",
    :choices="choices",
  )
  Button(plain)
    TextStyle(variation="negative") Xem hướng dẫn
</template>
<script setup lang="ts">
import { ref } from 'vue';
const question = {
  id: 1,
  number: 'Câu 1',
  question: "Một vật dao động điều hòa trên trục Ox quanh vị trí cân bằng O. Gọi A, ω và φ lần lượt là biên độ, tần số góc và pha ban đầu của dao động. Biểu thức li độ của vật theo thời gian t là",
  answer: [
    "a",
    "b",
    "c",
    "d",
  ],
  true_answer: "a",
  Instructions: "",
  level: 3,
  tags: [
    "Dao động cơ",
    "Chương 1",
    "Dao động điều hòa",
  ],
};

const user_answer = ref('');
const choices = [
  { label: 'A. x = Acos(ωt + φ).', value: 'a' },
  { label: 'B. x = ωcos(tφ + A). ', value: 'b' },
  { label: 'C. x = tcos(φA + ω)', value: 'c' },
  { label: 'D. x = φcos(Aω + t). ', value: 'd' },
];
</script>
