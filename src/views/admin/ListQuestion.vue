<template lang="pug">
Page(
  :fullWidth="true"
  :title="$t('list_question.title')"
  :subtitle="$t('list_question.subtitle')",
  :primaryAction="{ content: $t('list_question.add_question'), onAction: () => {} }"
  :breadcrumbs="[{content: 'Dashboard', url: '/'}]"
)
  Card(sectioned)
    IndexTable(
      :item-count="questions.length",
      :headings="tableHeadings",
      lastColumnSticky,
    )
      IndexTableRow(
        v-for="{ id, question, answers, tags, true_answer, level, average_time }, index in questions"
        :key="id"
        :id="id"
        :position="index"
        :selectable="false"
      )
        IndexTableCell {{id}}
        IndexTableCell {{question}}
        IndexTableCell {{answers}}
        IndexTableCell {{true_answer}}
        IndexTableCell {{tags}}
        IndexTableCell {{level}}
        IndexTableCell {{average_time}}

        IndexTableCell
          Stack(:vertical="false")
            Button(:icon="DeleteMinor")
            Button(:icon="EditMinor")

</template>

<script setup lang="ts">
import DeleteMinor from '@icons/DeleteMinor.svg';
import EditMinor from '@icons/EditMinor.svg';
import { questionsFake } from '../dataFake';

const tableHeadings = [
  {title: 'Mã câu hỏi'},
  {title: 'Câu hỏi'},
  {title: 'Các đáp án'},
  {title: 'Đáp án đúng'},
  {title: 'Tags'},
  {title: 'Đô khó'},
  {title: 'AT'},
  {title: 'Hành động'},
];

const questions = questionsFake;
</script>
