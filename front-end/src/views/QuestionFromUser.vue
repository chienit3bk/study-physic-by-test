<template lang="pug">
.dashboard
  Page(
    title="Đóng góp câu hỏi",
    subtitle="Thêm câu hỏi giúp cho ngân hàng câu hỏi chung thêm phần phong phú"
    :full-width="false",
    :breadcrumbs="[{content: 'DashBoard', url: '/'} ]",
    :primary-action="{content: 'Đóng góp', onAction: () => handleAddQuestionFromUser()}"
  )
    Card(sectioned)
      Form.p-3
        FormLayout
          TextField(:multiline="4" v-model="questionCreate.description")
            template(#label) {{ $t('list_question.question_title') }}
          TextStyle {{ $t('list_question.question_answers') }}
          Stack(distribution="equalSpacing" vertical)
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
          Select.pt-2(
            :placeholder="$t('common.choose_level')",
            v-model="questionCreate.level",
            :options="LEVELS",
          )
              template(#label) {{ $t('select_exam.level_label')}}
          Text(as="p" variant="bodyMd") Chọn nhãn
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
Modal(
  :open="isShowModalThank",
  :primary-action="{ content: 'Đóng', onAction: () => isShowModalThank = !isShowModalThank}"
  @close="isShowModalThank = !isShowModalThank",
)
  template(#title) Bạn đã đóng góp câu hỏi
  template(#content)
    ModalSection Bạn đã đóng góp câu hỏi thành công, câu hỏi này sẽ được phê duyệt vào ngân hàng câu hỏi!. Cảm ơn bạn"
</template>

<script setup lang="ts">
import { ref, inject, reactive } from 'vue';
import { useTagStore } from '@/stores';
import { LEVELS } from '@/configs';
import SearchMinor from '@icons/SearchMinor.svg?component';

const axios: any = inject('axios');
const toastData: Record<string, any> = inject('toastData', {
  active: false,
  error: false,
  content: '',
});

const tagsStore = useTagStore();

// Question from user
const questionCreate = reactive<Record<string, any>>({
  Tags: [],
  description: '',
  answer: ['A.', 'B.', 'C.', 'D.'],
  trueAnswer: '',
  level: 1,
  mainTag: '',
  instruction: '',
  verify: false,
});
const tagsSelected = ref('');
const isShowModalThank = ref(false);
const handleTagSelected = (id: number): void => {
  const index = questionCreate.Tags?.indexOf(id);

  if (index === -1) {
    questionCreate.Tags?.push(id);
  } else {
    questionCreate.Tags = questionCreate.Tags?.filter((item: number) => item !== id);
  }
};

const tagLabel = (id: number) => {
  const tag = tagsStore.tagOptions.find((tag: Record<string, any>) => tag.value === id);
  return tag?.label;
}

const isOptionSelected = (id: number) => {
  return questionCreate.Tags?.some((item: number) => item === id);
};
const handleAddQuestionFromUser = () => {
  const { Tags: tagIds, answer, description, trueAnswer, mainTag, level, instruction, verify } = questionCreate;

  axios.post('/api/questions', { tagIds, answer, description, trueAnswer, mainTag, level, instruction, verify })
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Đóng góp câu hỏi thành công';
      
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Đóng góp câu hỏi thất bại';
    });
}
// Created
</script>
