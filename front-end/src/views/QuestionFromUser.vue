<template lang="pug">
.dashboard
  Page(
    title="Đóng góp câu hỏi",
    subtitle="Thêm câu hỏi giúp cho ngân hàng câu hỏi chung thêm phần phong phú"
    :full-width="false",
    :breadcrumbs="[{content: 'DashBoard', url: '/'} ]",
    :primary-action="{content: 'Đóng góp', onAction: () => handleAddQuestionFromUser}"
  )
    Card(sectioned)
      Form.p-3
        FormLayout
          TextField(:multiline="4" v-model="questionCreate.question")
            template(#label) {{ $t('list_question.question_title') }}
          TextStyle {{ $t('list_question.question_answers') }}
          Stack(distribution="equalSpacing" vertical)
            Stack
              TextField(v-model="questionCreate.answers[0]")
            Stack
              TextField(v-model="questionCreate.answers[1]")
            Stack
              TextField(v-model="questionCreate.answers[2]")
            Stack
              TextField(v-model="questionCreate.answers[3]")
          Select(
            v-if="questionCreate.answers.length > 0",
            v-model="questionCreate.true_answer",
            :options="questionCreate.answers.map((answer: string) => { return {label: answer, value: answer } })",
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
                v-for="tag, index in TAGS"
                :key="index"
                :value="tag"
                :selected="isOptionSelected(tag)"
              ) {{ tag }}
          Stack
            Tag(
              v-for="tag, index in questionCreate.tags",
              :key="index",
              @remove="handleTagSelected(tag)",
            ) {{ tag }}
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
import { ref, reactive } from 'vue';
import { TAGS, LEVELS } from '@/configs';
import SearchMinor from '@icons/SearchMinor.svg?component';

import { questionsFake } from './dataFake';

// Question from user
const questionCreate = reactive<Record<string, any>>({
  id: '0',
  number: '0',
  tags: [],
  question: '',
  answers: ['A.', 'B.', 'C.', 'D.'],
  true_answer: '',
  level: '0',
  average_time: 0,
  instructions: '',
});
const tagsSelected = ref('');
const isShowModalThank = ref(false);
const handleTagSelected = (tag: string): void => {
  const index = questionCreate.tags.indexOf(tag);

  if (index === -1) {
    questionCreate.tags.push(tag);
  } else {
    questionCreate.tags = questionCreate.tags.filter((item: string) => item !== tag);
  }
};

const isOptionSelected = (tag: string) => {
  return questionCreate.tags?.some((item: string) => item === tag);
};

const handleAddQuestionFromUser = () => {

}
// Created
</script>
