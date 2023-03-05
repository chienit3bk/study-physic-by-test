<template lang="pug">
.document-list
  Card(sectioned)
    Stack.mb-2(distribution="trailing")
      Button(primary @click="isActiveModalAdd = true") Thêm tài liệu
    Filters(
      v-model="paramsRequestGetSubs.inputFilterValue",
      :filters="[]",
      query-placeholder="Tìm tài liệu"
      @query-clear="handleClearQuery",
      @query-change="handleChangeQuery",
    )
    IndexTable(
      :loading="isLoading",
      :item-count="documents.length",
      :headings="headings",
      :selectable="false",
      lastColumnSticky,
    )
      IndexTableRow(
        v-for="(document, index) in documents",
        :key="document.id",
        :id="document.id",
        :position="index",
      )
        IndexTableCell {{ document.id }}
        IndexTableCell {{ document.title }}
        IndexTableCell {{ document.content }}
        IndexTableCell {{ document.createdAt }}
        IndexTableCell
          Stack
            Button(
              plain,
              :icon="EditMinor",
              @click="requestEditDocument(document)"
            )
            Button(
              plain,
              :icon="DeleteMinor",
              @click="requestDeleteDocument(document)"
            )
    .mt-3
      Stack(distribution="center", alignment="center")
        Pagination(
          :key="String(isLoading)",
          :has-previous="hasPreviousPage",
          :has-next="hasNextPage",
          @previous="handlePressPagination(metaData.current_page - 1)",
          @next="handlePressPagination(metaData.current_page + 1)",
        )
Modal(
  :open="isActiveModalDelete",
  @close="toggleModalDeleteTag",
  :primary-action="{ content: $t('common.delete'), onAction: confirmDeleteTag }",
  :secondary-actions="[{ content: $t('common.cancel'), onAction: toggleModalDeleteTag }]"
)
  template(#title) Xóa tài liệu
  template(#content)
    ModalSection Xóa bỏ tài liệu {{  documentSelected.content }}

Modal(
  :open="isActiveModalEdit",
  @close="isActiveModalEdit = false",
  :primary-action="{ content: 'Lưu', onAction: updateDocument }",
  :secondary-actions="[{ content: 'Hủy', onAction: () => isActiveModalEdit = false }]"
)
  template(#title) Chỉnh sửa tài liệu
  template(#content)
    ModalSection
      TextField(v-model="documentSelected.title")
        template(#label) Tiêu đề
      TextField(v-model="documentSelected.content" :multiline="4")
        template(#label) Nội dung
      .mt-2
        Combobox.mt-2(allow-multiple)
          template(#activator)
            ComboboxTextField(
              autoComplete="off",
              :labelHidden="true",
              v-model="documentSelected.tags",
              :placeholder="$t('list_question.question_add_tag')",
            )
              template(#prefix)
                Icon(:source="SearchMinor", color="inkLighter")

          Listbox(@select="handleTagSelected")
            ListboxOption(
              v-for="(tag, index) in tagStore.tagOptions",
              :key="index",
              :value="tag.value",
              :selected="isOptionSelected(tag.value)",
            ) {{ tag.label }}
Modal(
  :open="isActiveModalAdd",
  @close="isActiveModalAdd = false",
  :primary-action="{ content: 'Thêm', onAction: addDocument }",
  :secondary-actions="[{ content: 'Hủy', onAction: () => isActiveModalAdd = false }]"
)
  template(#title) Thêm tài liệu
  template(#content)
    ModalSection
      TextField(v-model="documentSelected.title")
        template(#label) Tiêu đề
      TextField(v-model="documentSelected.content" :multiline="4")
        template(#label) Nội dung
      .mt-2
        Combobox.mt-2(allow-multiple)
          template(#activator)
            ComboboxTextField(
              autoComplete="off",
              :labelHidden="true",
              v-model="documentSelected.tags",
              :placeholder="$t('list_question.question_add_tag')",
            )
              template(#prefix)
                Icon(:source="SearchMinor", color="inkLighter")

          Listbox(@select="handleTagSelected")
            ListboxOption(
              v-for="(tag, index) in tagStore.tagOptions",
              :key="index",
              :value="tag.value",
              :selected="isOptionSelected(tag.value)",
            ) {{ tag.label }}
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue';
import { useTagStore } from '@/stores';
import { debounce } from 'lodash';
import DeleteMinor from '@icons/DeleteMinor.svg?component';
import EditMinor from '@icons/EditMinor.svg?component';
import SearchMinor from '@icons/SearchMinor.svg?component';

const axios: any = inject('axios');
const tagStore = useTagStore();

const documentSelected = ref<Record<string, any>>({
  id: 0,
  title: '',
  content: '',
  Tags: [],
});

const handleTagSelected = (id: number): void => {
  const index = documentSelected.value.Tags?.indexOf(id);

  if (index === -1) {
    documentSelected.value.Tags?.push(id);
  } else {
    documentSelected.value.Tags = documentSelected.value.Tags?.filter((item: number) => item !== id);
  }
};


const isOptionSelected = (id: number) => {
  return documentSelected.value.Tags?.some((item: number) => item === id);
};
const documents = ref<Record<string, any>[]>([]);
const isLoading = ref<boolean>(false);
const isActiveModalEdit = ref<boolean>(false);
const isActiveModalDelete = ref<boolean>(false);
const isActiveModalAdd = ref<boolean>(false);

const metaData = ref<Record<string, any>>({});
const paramsRequestGetSubs = ref<Record<string, any>>({ page: 1, per_page: 7 });

const hasNextPage = computed<boolean>(() => metaData.value.current_page < metaData.value.last_page && !isLoading.value);
const hasPreviousPage = computed<boolean>(() => metaData.value.current_page > 1 && !isLoading.value);

const headings = [
  { title: 'ID' },
  { title: 'Tiêu đề' },
  { title: 'Nội dung' },
  { title: 'Thời gian tạo'},
  { title: 'Hành động' },
]

const handleClearQuery = () => {
  paramsRequestGetSubs.value.inputFilterValue = null;
};

const handleChangeQuery = debounce(() => {getDocuments(paramsRequestGetSubs.value.inputFilterValue)}, 500);

const requestEditDocument = (document: Record<string, any>) => {
  documentSelected.value = document;
  isActiveModalEdit.value = true;
};

const requestDeleteDocument = (document: Record<string, any>) => {
  isActiveModalDelete.value = true;
  documentSelected.value = document;

};

const confirmDeleteTag = () => {
  axios
    .delete(`/api/documents/${documentSelected.value.id}`)
    .then(() => {
      alert('Xóa tài liệu thành công');
      getDocuments();
      isActiveModalDelete.value = false;
    })
    .catch(() => alert('Xóa tài liệu thất bại'));
};

const updateDocument = () => {
  const { title, content, Tags: tagIds } = documentSelected.value;

  axios
    .put(`/api/documents/${documentSelected.value.id}`, { title, content, tagIds })
    .then(() => {
      setTimeout(() => alert('Cập nhật tài liệu thành công'));
      getDocuments();
      isActiveModalEdit.value = false;
    })
    .catch(() => alert('Cập nhật tài liệu thất bại'));
};

const addDocument = () => {
  const { title, content, Tags: tagIds } = documentSelected.value;

  axios.post('/api/documents', { title, content, tagIds })
    .then(() => {
      setTimeout(() => alert('Thêm tài liệu thành công'));
      getDocuments();
      isActiveModalAdd.value = false;
    })
    .catch(() => alert('Thêm tài liệu thất bại'));
}
const toggleModalDeleteTag = () => {
  isActiveModalDelete.value = !isActiveModalDelete.value;
};


const handlePressPagination = (page: number) => {
  paramsRequestGetSubs.value.page = page;
};

async function getDocuments(filterValue?: string, page?: number) {
  isLoading.value = true;

  await axios.get(`/api/documents`, {
    // params: {
    //   page: 1,
    // }
  })
    .then((res: any) => {
      let data = res;
      if (filterValue) {
        data = res.filter((document: Record<string, any>) => document.title.toLowerCase().includes(filterValue.toLowerCase()));
      }

      documents.value = data;
    })
    .catch((error: Error) => {
      alert('Lấy dữ liệu thất bại');
    });

  isLoading.value = false;
}

onMounted(async () => {
  const storageToken = await localStorage.getItem('session_token');
  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
  getDocuments();
});

</script>
