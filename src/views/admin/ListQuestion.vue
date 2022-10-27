<template lang="pug">
Page(
  :fullWidth="true"
  :title="$t('list_question.title')"
  :subtitle="$t('list_question.subtitle')",
  :primaryAction="{ content: $t('list_question.add_question'), onAction: toggleModalAdd }"
  :breadcrumbs="[{content: 'Dashboard', url: '/'}]"
)
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

  Card(sectioned)
    IndexTable(
      :item-count="questions.length",
      :headings="tableHeadings",
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
          Stack
            //- ModalEditMerchandiseVue(
            //-   :id="id"
            //-   :name="name"
            //-   :price="price"
            //-   :timeIn="timeIn"
            //-   :quantity="quantity"
            //-   :idPartner="idPartner"
            //- )
            Button(:icon="DeleteMinor")

</template>

<script setup lang="ts">
import { ref } from 'vue';
// import ModalEditMerchandiseVue from './ModalEditMerchandise.vue';
import DeleteMinor from '@icons/DeleteMinor.svg';
import { questionsFake } from '../dataFake';

const showModalAddQuestion = ref(false);

const tableHeadings = [
  {title: 'Mã câu hỏi'},
  {title: 'Câu hỏi'},
  {title: 'Các đáp án'},
  {title: 'Đáp án đúng'},
  {title: 'Tags'},
  {title: 'Đô khó'},
  {title: 'AT'},
];

const questions = questionsFake;

const toggleModalAdd = () => {
  showModalAddQuestion.value = !showModalAddQuestion.value;
};



</script>
