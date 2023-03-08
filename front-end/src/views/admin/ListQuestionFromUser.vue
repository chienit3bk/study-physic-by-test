<template lang="pug">
Page(
  full-width,
  title="Câu hỏi từ người dùng"
  subtitle="Danh sách các câu hỏi đến từ học sinh",
  :breadcrumbs="[{content: 'Dashboard', url: '/'}]"
)
  CreateQuestionModal(
    :isActive="isActiveAddQuestion",
    @close="toggleCreateQuestionModal",
  )
  Card(sectioned)
    Filters.pb-2(
      :queryValue="queryValue",
      :filters="[]",
      v-model="queryValue",
      queryPlaceholder="Tìm kiếm câu hỏi"
      @query-clear="handleClearQuery",
      @query-change="handleChangeQuery",
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
        :position="parseInt(index)"
        :selectable="false"
      )
        IndexTableCell {{ question.id }}
        IndexTableCell.w-50 {{ question.description }}
        IndexTableCell {{ question.answer }}
        IndexTableCell {{ question.trueAnswer }}
        IndexTableCell {{ question.mainTag || "-" }}
        IndexTableCell {{ question.level }}
        IndexTableCell {{ question.averageTime || "-" }}
        IndexTableCell {{ question.instruction || "-" }}
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
        :key="String(isloading)",
        :has-previous="currentPage !== 1",
        :has-next="currentPage !== parseInt(`${questionsStore.questionToManage.length / 12}`) + 1",
        :nextKeys="['k']",
        :previousKeys="['j']",
        :nextTooltip="$t('online_exam.next_question')",
        :previousTooltip="$t('online_exam.prev_question')",
        @previous="handlePressPagination('prev')",
        @next="handlePressPagination('next')",
      )


Modal(
  :open="isActiveModalEdit"
  @close="toggleModalEditQuestion"
)
  template(#title)
    h1 Chỉnh sửa thông tin câu hỏi

  template(#content)
    ModalSection
      Form
        FormLayout
          TextField(:multiline="4" v-model="selectedQuestion.description")
            template(#label) {{ $t('list_question.question_title') }}
          TextStyle {{ $t('list_question.question_answers') }}
          Stack(distribution="equalSpacing")
            Stack
              TextField(v-model="selectedQuestion.answer[0]")
            Stack
              TextField(v-model="selectedQuestion.answer[1]")
            Stack
              TextField(v-model="selectedQuestion.answer[2]")
            Stack
              TextField(v-model="selectedQuestion.answer[3]")
          Select(
            v-if="selectedQuestion.answer.length > 0",
            v-model="selectedQuestion.trueAnswer",
            :options="selectedQuestion.answer.map((answer: string) => { return {label: answer, value: answer } })",
            :placeholder="$t('list_question.question_select_true_answer')",
          )
            template(#label) {{ $t('list_question.question_true_answer') }}
          Select(
            placeholder="Chọn nhãn chính",
            v-model="selectedQuestion.mainTag",
            :options="tagsStore.tagOptionsLabel",
          )
            template(#label) Nhãn chính
          Select.pt-2(
            :placeholder="$t('common.choose_level')",
            v-model="selectedQuestion.level",
            :options="LEVELS",
          )
              template(#label) {{ $t('select_exam.level_label')}}
          TextField(:multiline="4" v-model="selectedQuestion.instruction")
            template(#label) Hướng dẫn
          Combobox(allow-multiple)
            template(#activator)
              ComboboxTextField(
                autoComplete="off",
                :labelHidden="true",
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
              v-for="tag, index in selectedQuestion.Tags",
              :key="index",
              @remove="handleTagSelected(tag)",
            ) {{ tagLabel(tag) }}
          Stack(distribution="center")
            Button(primary @click="updateQuestion") Thêm
            Button(destructive @click="toggleModalDeleteQuestion") Xóa

Modal(
  :open="isActiveModalDelete",
  @close="toggleModalDeleteQuestion",
  :primary-action="{ content: $t('common.cancel'), onAction: toggleModalDeleteQuestion }",
  :secondary-actions="[{ content: $t('common.delete'), onAction: confirmDeleteQuestion }]"
)
  template(#title) {{ $t('list_question.title_modal_delete') }}
  template(#content)
    ModalSection {{  $t('list_question.content_modal_delete') }}
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { useQuestionStore, useTagStore } from '@/stores';
import { CreateQuestionModal } from '@/components';
import DeleteMinor from '@icons/DeleteMinor.svg?component';
import EditMinor from '@icons/EditMinor.svg?component';
import { LEVELS } from '@/configs';
import SearchMinor from '@icons/SearchMinor.svg?component';
import { debounce } from 'lodash';

const axios: any = inject('axios');

const toastData: Record<string, any> = inject('toastData', {
  active: false,
  error: false,
  content: '',
});

const questionsStore = useQuestionStore();
const tagsStore = useTagStore();

const isloading = ref<boolean>(false);
const questions = ref<Record<string, any>>([]);
const isActiveAddQuestion = ref<boolean>(false);
const isActiveModalDelete = ref<boolean>(false);
const isActiveModalEdit = ref<boolean>(false);
const queryValue = ref<string>('');
const currentPage = ref<number>(1);
const selectedQuestion = ref<Record<string, any>>({});
// const tagsSelected = ref([]);

const tableHeadings = [
  { title: 'Mã' },
  { title: 'Câu hỏi' },
  { title: 'Các đáp án' },
  { title: 'Đáp án đúng' },
  { title: 'Nhãn' },
  { title: 'Đô khó' },
  { title: 'Thời gian' },
  { title: 'Hướng dẫn' },
  { title: 'Hành động' },
];

const isLoading = ref<boolean>(false);

const handleTagSelected = (tag: string): void => {
  const index = selectedQuestion.value.Tags.indexOf(tag);

  if (index === -1) {
    selectedQuestion.value.Tags?.push(tag);
  } else {
    selectedQuestion.value.Tags = selectedQuestion.value.Tags?.filter((item: string) => item !== tag);
  }
};

const isOptionSelected = (tag: string) => {
  return selectedQuestion.value.Tags?.some((item: string) => item === tag);
};

const tagLabel = (id: number) => {
  const tag = tagsStore.tagOptions.find((tag: Record<string, any>) => tag.value === id);
  return tag?.label;
}

// function isEmpty(value: Record<string, string> | string | null) {
//   if (Array.isArray(value)) {
//     return value.length === 0;
//   } else {
//     return value === "" || value == null;
//   }
// };

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


const requestEditQuestion = (question: Record<string, any>) => {
  toggleModalEditQuestion();

  selectedQuestion.value = question;
}

const handleClearQuery = () => {
  queryValue.value = '';
};

const handleChangeQuery = debounce(() => getQuestions(), 500);

const handlePressPagination = (type: string) => {
  if (type === 'prev') {
    currentPage.value -= 1;
  } else {
    currentPage.value += 1;
  }

  getQuestions();
};
const toggleCreateQuestionModal = (): void => {
  isActiveAddQuestion.value = !isActiveAddQuestion.value;
  getQuestions();
};

const confirmDeleteQuestion = () => {
  axios
    .delete(`/api/questions/${selectedQuestion.value.id}`)
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Cập nhật câu hỏi thành công';
      getQuestions();
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Xóa câu hỏi thất bại';
    });
  isActiveModalDelete.value = false;
};

function updateQuestion() {
  const { Tags: tagIds, answer, description, trueAnswer, mainTag, level, instruction, verify } = selectedQuestion.value;

  axios
    .put(`/api/questions/${selectedQuestion.value.id}`, { Tags: tagIds, answer, description, trueAnswer, mainTag, level, instruction, verify})
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Cập nhật câu hỏi thành công';
      getQuestions();
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Cập nhật câu hỏi thất bại';
    });
  isActiveModalEdit.value = false;
};

async function getQuestions() {
  isLoading.value = true;
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
  await axios.get('/api/questions', {
    params: {
      page: currentPage.value,
    }
  })
    .then((res: any) => {
      let data = res;
      if (queryValue.value) {
        data = res.filter((question: Record<string, any>) => question.description.toLowerCase().includes(queryValue.value.toLowerCase()));
      }
      data = data.map((question: Record<string, any>) => {
        question.Tags = question.Tags.map((tag: any) => tag.id);
        return question;
      }).filter((question: Record<string, any>) => {
        return !question.verify;
      })
      questions.value = data;
    })
    .catch((error: Error) => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Lấy dữ liệu các câu hỏi thất bại';
    });

  isLoading.value = false;
};

onMounted(async () => {
  getQuestions();
})
</script>
