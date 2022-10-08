<template lang="pug">

CardSection
  template(#title) Câu 1
  p {{ description }}
  ChoiceList(
    v-model="value",
    name="singleChoiceList",
    :choices="choices",
  )
</template>
<script setup lang="ts">
const value = 1;
const description = 'Một vật dao động điều hòa trên trục Ox quanh vị trí cân bằng O. Gọi A, ω và φ lần lượt là biên độ, tần số góc và pha ban đầu của dao động. Biểu thức li độ của vật theo thời gian t là';
const choices = [
  { label: 'A. x = Acos(ωt + φ).', value: 'a' },
  { label: 'B. x = ωcos(tφ + A). ', value: 'b' },
  { label: 'C. x = tcos(φA + ω)', value: 'c' },
  { label: 'D. x = φcos(Aω + t). ', value: 'd' },
];
</script>
