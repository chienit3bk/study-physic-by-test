<template lang="pug">
pre {{  question }}
Card(sectioned)
  CardSection Câu hỏi: {{ question.question }}
</template>
<script setup lang="ts">
interface Props {
  question: Record<string, any>;
}
defineProps<Props>();
</script>
