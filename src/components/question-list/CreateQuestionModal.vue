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
          TextField(v-model="questionCreate.id")
            template(#label) {{ $t('list_question.question_id') }}
          TextField(:multiline="4" v-model="questionCreate.question")
            template(#label) {{ $t('list_question.question_title') }}
          TextStyle {{ $t('list_question.question_answers') }}
          Stack(distribution="equalSpacing")
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
          Button(primary submit) Thêm
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { TAGS, LEVELS } from '@/configs';
import type { QuestionType } from '@/types';
import SearchMinor from '@icons/SearchMinor.svg';

const questionCreate = reactive<QuestionType>({
  id: '0',
  number: '0',
  tags: [],
  question: '',
  answers: ['A.', 'B.', 'C.', 'D.'],
  true_answer: '',
  level: '0',
  average_time: 0,
  instructions: '',
  have_answer: false,
});

const tagsSelected = ref('');

interface Props {
  isActive: boolean;
}

defineProps<Props>();

const emits = defineEmits<{
  (event: 'close'): void
}>();

const handleClose = (): void => {
  emits('close');
};

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

</script>
<style lang="scss">
.list-question__create-question__tag {
  .Polaris-Choice {
    display: flex;
  }

  .co-element__extra-product__item--hidePrice {
    .co-element__extra-product__price {
      display: none;
    }
  }

  .co-element__extra-product__price {
    margin-right: var(--p-space-3);
  }
}
</style>
