<template lang="pug">
Modal(
  :open="isActive"
  @close="handleClose"
)
  template(#title)
    h1 {{ $t('list_question.add_question') }}

  template(#content)
    ModalSection
      Form
        FormLayout
          TextField(:multiline="4" v-model="questionCreate.description")
            template(#label) {{ $t('list_question.question_title') }}
          Select(
            placeholder="Chọn nhãn chính",
            v-model="questionCreate.mainTag",
            :options="tagsStore.tagOptionsLabel",
          )
            template(#label) Nhãn chính
          TextStyle {{ $t('list_question.question_answers') }}
          Stack(distribution="equalSpacing")
            Stack
              TextField(v-model="questionCreate.answer[0]")
            Stack
              TextField(v-model="questionCreate.answer[1]")
            Stack
              TextField(v-model="questionCreate.answer[2]")
            Stack
              TextField(v-model="questionCreate.answer[3]")
          Select(
            v-if="questionCreate.answer.length > 0",
            v-model="questionCreate.trueAnswer",
            :options="questionCreate.answer.map((answer: string) => { return {label: answer, value: answer } })",
            :placeholder="$t('list_question.question_select_true_answer')",
          )
            template(#label) {{ $t('list_question.question_true_answer') }}
          TextField(:multiline="4" v-model="questionCreate.instruction")
            template(#label) Hướng dẫn
          Select.pt-2(
            :placeholder="$t('common.choose_level')",
            v-model="questionCreate.level",
            :options="LEVELS",
          )
              template(#label) {{ $t('select_exam.level_label')}}
          Combobox(allow-multiple)
            template(#activator)
              ComboboxTextField(
                autoComplete="off",
                :labelHidden="true",
                v-model="tagsSelected",
                :placeholder="$t('list_question.question_add_tag')",
              )
                template(#prefix)
                  Icon(:source="SearchMinor", color="inkLighter")

            Listbox(@select="handleTagSelected")
              ListboxOption(
                v-for="tag, index in tagsStore.tagOptions"
                :key="index"
                :value="tag.value"
                :selected="isOptionSelected(tag.value)"
              ) {{ tag.label }}
          Stack
            Tag(
              v-for="tag, index in questionCreate.Tags",
              :key="index",
              @remove="handleTagSelected(tag)",
            ) {{ tagLabel(tag) }}
          Button(primary submit @click="addQuestion") Thêm
</template>
<script setup lang="ts">
import { ref, reactive, inject } from 'vue';
import { useTagStore } from '@/stores';
import { LEVELS } from '@/configs';
import SearchMinor from '@icons/SearchMinor.svg?component';

const tagsStore = useTagStore();

const axios: any = inject('axios');
const toastData: Record<string, any> = inject('toastData', {
  active: false,
  error: false,
  content: '',
});

const questionCreate = reactive<Record<string, any>>({
  Tags: [],
  description: '',
  answer: ['A.', 'B.', 'C.', 'D.'],
  trueAnswer: '',
  level: 1,
  mainTag: '',
  instruction: '',
  verify: true,
});


const tagsSelected = ref('');

interface Props {
  isActive: boolean;
}

defineProps<Props>();

const emits = defineEmits<{
  (event: 'close'): void,
}>();

const handleClose = (): void => {
  emits('close');
};

const handleTagSelected = (id: number): void => {
  const index = questionCreate.Tags?.indexOf(id);

  if (index === -1) {
    questionCreate.Tags?.push(id);
  } else {
    questionCreate.Tags = questionCreate.Tags?.filter((item: number) => item !== id);
  }
};


const isOptionSelected = (id: number) => {
  return questionCreate.Tags?.some((item: number) => item === id);
};

const tagLabel = (id: number) => {
  const tag = tagsStore.tagOptions.find((tag: Record<string, any>) => tag.value === id);
  return tag?.label;
}

const addQuestion = () => {
  const { Tags: tagIds, answer, description, trueAnswer, mainTag, level, instruction, verify } = questionCreate;

  axios.post('/api/questions', { tagIds, answer, description, trueAnswer, mainTag, level, instruction, verify })
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Tạo câu hỏi thành công';
      // questionCreate.Tags = [];
      questionCreate.description = '';
      questionCreate.answer = ['A.', 'B.', 'C.', 'D.'];
      // questionCreate.level = 1;
      questionCreate.trueAnswer = '';
      questionCreate.instruction = '';
      handleClose();
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Tạo câu hỏi thất bại';
    });
}
</script>
<style lang="scss">
.list-question__create-question__tag {
  .Polaris-Choice {
    display: flex;
  }
}
</style>
