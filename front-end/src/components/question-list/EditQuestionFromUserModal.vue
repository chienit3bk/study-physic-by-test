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
          TextField(:multiline="4" v-model="questionEdit.question")
            template(#label) {{ $t('list_question.question_title') }}
          TextStyle {{ $t('list_question.question_answers') }}
          Stack(distribution="equalSpacing")
            Stack
              TextField(v-model="questionEdit.answers[0]")
            Stack
              TextField(v-model="questionEdit.answers[1]")
            Stack
              TextField(v-model="questionEdit.answers[2]")
            Stack
              TextField(v-model="questionEdit.answers[3]")
          Select(
            v-if="questionEdit.answers.length > 0",
            v-model="questionEdit.true_answer",
            :options="questionEdit.answers.map((answer: string) => { return {label: answer, value: answer } })",
            :placeholder="$t('list_question.question_select_true_answer')",
          )
            template(#label) {{ $t('list_question.question_true_answer') }}
          Select.pt-2(
            :placeholder="$t('common.choose_level')",
            v-model="questionEdit.level",
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
                v-for="tag, index in TAGS"
                :key="index"
                :value="tag"
                :selected="isOptionSelected(tag)"
              ) {{ tag }}
          Stack
            Tag(
              v-for="tag, index in questionEdit.tags",
              :key="index",
              @remove="handleTagSelected(tag)",
            ) {{ tag }}
          Stack(distribution="center")
            Button(primary submit) Thêm
            Button(destructive) Xóa bỏ
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { TAGS, LEVELS } from '@/configs';
import type { QuestionType } from '@/types';
import SearchMinor from '@icons/SearchMinor.svg?component';

const tagsSelected = ref('');

interface Props {
  isActive: boolean;
  question: QuestionType;
};

const props = defineProps<Props>();

const questionEdit = computed(() => props.question)

const emits = defineEmits<{
  (event: 'close'): void
}>();

const handleClose = (): void => {
  emits('close');
};

const handleTagSelected = (tag: string): void => {
  const index = questionEdit.value.tags?.indexOf(tag);

  if (index === -1) {
    questionEdit.value.tags?.push(tag);
  } else {
    questionEdit.value.tags = questionEdit.value.tags?.filter((item: string) => item !== tag);
  }
};

const isOptionSelected = (tag: string) => {
  return questionEdit.value.tags?.some((item: string) => item === tag);
};

</script>
<style lang="scss">
.list-question__create-question__tag {
  .Polaris-Choice {
    display: flex;
  }
}
</style>
