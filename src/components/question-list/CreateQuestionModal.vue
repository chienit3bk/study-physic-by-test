<template lang="pug">
Modal(
  :open="showModalAddQuestion"
  @close="toggleModalAdd"
)
  template(#title)
    h1 Thêm hàng hóa

  template(#content)
    Card(sectioned)
      Form
        FormLayout
          TextField
            template(#label) Mã hàng hóa
          TextField
            template(#label) Tên hàng
          TextField
            template(#label) Số lượng
          TextField
            template(#label) Mã đối tác
          Button(primary submit) Thêm
</template>
<script setup lang="ts">
import { ref } from 'vue';
const showModalAddQuestion = ref(false);

const toggleModalAdd = () => {
  showModalAddQuestion.value = !showModalAddQuestion.value;
};
</script>