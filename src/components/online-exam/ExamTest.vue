<template lang="pug">
Card
  template(#title) {{examTest.title}}
  CardSection
    Text(as="p" variant="bodyMd") {{ $t('exam_test.number_question') }} {{ examTest.number_question}}
    Text(as="p" variant="bodyMd") {{ $t('exam_test.test_time') }} {{ examTest.time}}
    Text(as="p" variant="bodyMd") {{ $t('exam_test.exam_type') }} {{ examTest.type}}

</template>
<script setup lang="ts">
const examTest = {
  "id": 1,
  "title": "Đề kiểm tra 15 phút chương 1: Dao động cơ - Đề số 01",
  "number_question": 10,
  "type": "Đề kiểm tra 15 phút",
  "time": 900,
  "tags": [
    "Dao động cơ",
    "Dao động",
  ],
  "points": "100",
};
</script>