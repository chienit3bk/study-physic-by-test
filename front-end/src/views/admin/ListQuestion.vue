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
        v-for="{ id, question, answers, tags, true_answer, level, average_time }, index in questions"
        :key="id"
        :id="id"
        :position="index"
        :selectable="false"
      )
        IndexTableCell {{ id }}
        IndexTableCell.w-50 {{ question }}
        IndexTableCell {{ answers }}
        IndexTableCell {{ true_answer }}
        IndexTableCell {{ tags }}
        IndexTableCell {{ level }}
        IndexTableCell {{ average_time }}
        IndexTableCell
          Stack(:vertical="false")
            Button(:icon="DeleteMinor")
            Button(:icon="EditMinor")

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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { CreateQuestionModal, EditQuestionModal } from '@/components';
import DeleteMinor from '@icons/DeleteMinor.svg';
import EditMinor from '@icons/EditMinor.svg';
import { questionsFake } from '../dataFake';

const isActiveAddQuestion = ref<boolean>(false);

const taggedWith = ref<string | undefined>('Chương 1');
const queryValue = ref<string | undefined>(undefined);

const tableHeadings = [
  { title: 'Mã' },
  { title: 'Câu hỏi' },
  { title: 'Các đáp án' },
  { title: 'Đáp án đúng' },
  { title: 'Tags' },
  { title: 'Đô khó' },
  { title: 'AT' },
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

function isEmpty(value: Record<string, string> | string | null) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
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
