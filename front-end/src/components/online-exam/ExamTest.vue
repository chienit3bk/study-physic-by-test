<template lang="pug">
Card
  template(#title) {{ title }}
  CardSection
    Text(as="p" variant="bodyMd") {{ $t('exam_test.number_question') }} {{ numberQuestion }}
    Text(as="p" variant="bodyMd") {{ $t('exam_test.test_time') }} {{ `${time / 60 } ${$t('common.minute')}` }}
    Text(as="p" variant="bodyMd") {{ $t('exam_test.exam_type') }} {{ type }}
    Button(plain @click="getAndShowQuestions") {{ $t('exam_test.start')}}
</template>
<script setup lang="ts">

interface Props {
  id: number,
  title: string,
  numberQuestion: number,
  time: number,
  type: string,
  points: string,
}

const props = defineProps<Props>();

const emit = defineEmits(['getAndShowQuestions']);

const getAndShowQuestions = () => {
  const dataExam =  { id: props.id, time: props.time / 60 };
  emit('getAndShowQuestions', dataExam);
};

</script>
