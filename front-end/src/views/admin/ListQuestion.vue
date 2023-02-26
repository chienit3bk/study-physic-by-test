<template lang="pug">
Page(
  full-width,
  :title="$t('list_question.title')"
  :subtitle="$t('list_question.subtitle')",
  :primaryAction="{ content: $t('list_question.add_question'), onAction: toggleCreateQuestionModal }"
  :breadcrumbs="[{content: 'Dashboard', url: '/'}]"
)
  CreateQuestionModal(
    :isActive="isActiveAddQuestion",
    @close="toggleCreateQuestionModal"
  )
  Card(sectioned)
    Filters.pb-2(
      :queryValue="queryValue",
      :filters="filters",
      v-model="queryValue",
      @query-clear="handleQueryValueRemove",
      @clear-all="handleClearAll",
    )
      template(#filter-taggedWith)
        TextField(
          label="Tagged with"
          v-model="taggedWith"
          autoComplete="off"
          labelHidden
        )

    IndexTable(
      :item-count="questions.length",
      :headings="tableHeadings",
      :selectable="false",
      lastColumnSticky,
    )
      IndexTableRow(
        v-for="question, index in questions",
        :key="question.id"
        :id="question.id"
        :position="index"
        :selectable="false"
      )
        IndexTableCell {{ question.id }}
        IndexTableCell.w-50 {{ question.question }}
        IndexTableCell {{ question.answers }}
        IndexTableCell {{ question.true_answer }}
        IndexTableCell {{ question.tags }}
        IndexTableCell {{ question.level }}
        IndexTableCell {{ question.average_time }}
        IndexTableCell {{ question.instructions }}
        IndexTableCell
          Stack()
            Button(
              plain,
              :icon="EditMinor",
              @click="requestEditQuestion(question)",
            )
            Button(
              plain,
              :icon="DeleteMinor",
              @click="requestDeleteQuestion(question)",
            )

    Stack(distribution="center")
      Pagination(
        has-previous,
        has-next,
        :nextKeys="['']",
        :previousKeys="['j']",
        :nextTooltip="$t('online_exam.next_question')",
        :previousTooltip="$t('online_exam.prev_question')",
        @previous="showPrevQuestions",
        @next="showNextQuestions",
      )
Modal(
  :open="isActiveModalDelete",
  @close="toggleModalDeleteQuestion",
  :primary-action="{ content: $t('common.cancel'), onAction: toggleModalDeleteQuestion }",
  :secondary-actions="[{ content: $t('common.delete'), onAction: confirmDeleteQuestion }]"
)
  template(#title) {{ $t('list_question.title_modal_delete') }}
  template(#content)
    ModalSection {{  $t('list_question.content_modal_delete') }}

Modal(
  :open="isActiveModalEdit"
  @close="toggleModalEditQuestion"
)
  template(#title)
    h1 {{ $t('list_question.add_question') }}

  template(#content)
    ModalSection
      Form
        FormLayout
          TextField(v-model="selectedQuestion.id")
            template(#label) {{ $t('list_question.question_id') }}
          TextField(:multiline="4" v-model="selectedQuestion.question")
            template(#label) {{ $t('list_question.question_title') }}
          TextStyle {{ $t('list_question.question_answers') }}
          Stack(distribution="equalSpacing")
            Stack
              TextField(v-model="selectedQuestion.answers[0]")
            Stack
              TextField(v-model="selectedQuestion.answers[1]")
            Stack
              TextField(v-model="selectedQuestion.answers[2]")
            Stack
              TextField(v-model="selectedQuestion.answers[3]")
          Select(
            v-if="selectedQuestion.answers.length > 0",
            v-model="selectedQuestion.true_answer",
            :options="selectedQuestion.answers.map((answer: string) => { return {label: answer, value: answer } })",
            :placeholder="$t('list_question.question_select_true_answer')",
          )
            template(#label) {{ $t('list_question.question_true_answer') }}
          Select.pt-2(
            :placeholder="$t('common.choose_level')",
            v-model="selectedQuestion.level",
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
              v-for="tag, index in selectedQuestion.tags",
              :key="index",
              @remove="handleTagSelected(tag)",
            ) {{ tag }}
          Button(primary submit) Thêm
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { CreateQuestionModal } from '@/components';
import DeleteMinor from '@icons/DeleteMinor.svg?component';
import EditMinor from '@icons/EditMinor.svg?component';
import { TAGS, LEVELS } from '@/configs';
import SearchMinor from '@icons/SearchMinor.svg?component';
import { questionsFake } from '../dataFake';

const isActiveAddQuestion = ref<boolean>(false);
const isActiveModalDelete = ref<boolean>(false);
const isActiveModalEdit = ref<boolean>(false);
const taggedWith = ref<string | undefined>('Chương 1');
const queryValue = ref<string | undefined>(undefined);
const selectedQuestion = ref<Record<string, any>>({});

const tableHeadings = [
  { title: 'Mã' },
  { title: 'Câu hỏi' },
  { title: 'Các đáp án' },
  { title: 'Đáp án đúng' },
  { title: 'Tags' },
  { title: 'Đô khó' },
  { title: 'Thời gian' },
  { title: 'Hướng dẫn' },
  { title: 'Hành động' },
];

const filters = [
  {
    key: "taggedWith",
    label: "Theo dạng",
    shortcut: true,
  },
];

const appliedFilters = computed(() => {
  return !isEmpty(taggedWith.value)
    ? [
      {
        key: "taggedWith",
      },
    ]
    : null;
});
const tagsSelected = ref('');

const handleTagSelected = (tag: string): void => {
  const index = selectedQuestion.value.tags.indexOf(tag);

  if (index === -1) {
    selectedQuestion.value.tags?.push(tag);
  } else {
    selectedQuestion.value.tags = selectedQuestion.value.tags?.filter((item: string) => item !== tag);
  }
};

const isOptionSelected = (tag: string) => {
  return selectedQuestion.value.tags?.some((item: string) => item === tag);
};

function isEmpty(value: Record<string, string> | string | null) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
};

const toggleModalDeleteQuestion = () => {
  isActiveModalDelete.value = !isActiveModalDelete.value;
};

const toggleModalEditQuestion = () => {
  isActiveModalEdit.value = !isActiveModalEdit.value;
};

const requestDeleteQuestion = (question: Record<string, any>) => {
  toggleModalDeleteQuestion();
  selectedQuestion.value = question;
};

const confirmDeleteQuestion = () => {

}

const requestEditQuestion = (question: Record<string, any>) => {
  toggleModalEditQuestion();
  selectedQuestion.value = question;
}

const confirmEditQuestion = () => {

}

const handleTaggedWithChange = (value: string) => { taggedWith.value = value; };
const handleTaggedWithRemove = () => { taggedWith.value = undefined; };
const handleQueryValueRemove = () => { queryValue.value = undefined; };
const handleClearAll = () => {
  handleTaggedWithRemove();
  handleQueryValueRemove();
};

const showPrevQuestions = () => {
  return;
};

const showNextQuestions = () => {
  return;
};

const toggleCreateQuestionModal = (): void => {
  isActiveAddQuestion.value = !isActiveAddQuestion.value;
};

const questions = questionsFake;
</script>
