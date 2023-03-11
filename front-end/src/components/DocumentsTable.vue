<template lang="pug">
.document-list
  Card(sectioned)
    Stack.mb-2(distribution="trailing")
      Button(primary @click="requestAddDocument") Thêm tài liệu
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
          :has-previous="currentPage !== 1",
          :has-next="currentPage !== parseInt(`${documentStore.documents.length / 12}`) + 1",
          @previous="handlePressPagination('prev')",
          @next="handlePressPagination('next')",
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
      Stack.mt-1
        Tag(
          v-for="tag, index in documentSelected.Tags",
          :key="index",
          @remove="handleTagSelected(tag)",
        ) {{ tagLabel(tag) }}
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
      Stack.mt-1
        Tag(
          v-for="tag, index in documentSelected.Tags",
          :key="index",
          @remove="handleTagSelected(tag)",
        ) {{ tagLabel(tag) }}
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue';
import { useTagStore, useDocumentStore } from '@/stores';
import { debounce } from 'lodash';
import DeleteMinor from '@icons/DeleteMinor.svg?component';
import EditMinor from '@icons/EditMinor.svg?component';
import SearchMinor from '@icons/SearchMinor.svg?component';

const axios: any = inject('axios');

const toastData: Record<string, any> = inject('toastData', {
  content: '',
  active: false,
  error: false,
});
const tagStore = useTagStore();
const documentStore = useDocumentStore();

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


const isOptionSelected = (tag: string) => {
  return documentSelected.value.Tags?.some((item: string) => item === tag);
};
const tagLabel = (id: number) => {
  const tag = tagStore.tagOptions.find((tag: Record<string, any>) => tag.value === id);
  return tag?.label;
}

const documents = ref<Record<string, any>[]>([]);
const isLoading = ref<boolean>(false);
const isActiveModalEdit = ref<boolean>(false);
const isActiveModalDelete = ref<boolean>(false);
const isActiveModalAdd = ref<boolean>(false);

const currentPage = ref<number>(1);
const paramsRequestGetSubs = ref<Record<string, any>>({});

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
  const Tags = document.Tags.map((item: Record<string, any>) => item.id);
  documentSelected.value.Tags = Tags;
  console.log(documentSelected.value);
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
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Xóa tài liệu thành công';
      getDocuments();
      isActiveModalDelete.value = false;
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Xóa tài liệu thất bại';
    });
};

const updateDocument = () => {
  const { title, content, Tags: tagIds } = documentSelected.value;

  axios
    .put(`/api/documents/${documentSelected.value.id}`, { title, content, tagIds })
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Cập nhật tài liệu thành công';
      getDocuments();
      isActiveModalEdit.value = false;
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Cập nhật tài liệu thất bại';
    });
};

const requestAddDocument = () => {
  documentSelected.value = {
    id: 0,
    title: '',
    content: '',
    Tags: [],
  };

  isActiveModalAdd.value = true
};

const addDocument = () => {
  const { title, content, Tags: tagIds } = documentSelected.value;

  axios.post('/api/documents', { title, content, tagIds })
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Thêm tài liệu thành công';
      getDocuments();
      documentSelected.value = {
        id: 0,
        title: '',
        content: '',
        Tags: [],
      };
      isActiveModalAdd.value = false;
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Thêm tài liệu thất bại';
    });
}
const toggleModalDeleteTag = () => {
  isActiveModalDelete.value = !isActiveModalDelete.value;
};


const handlePressPagination = (type: string) => {
  if (type === 'prev') {
    currentPage.value -= 1;
  } else {
    currentPage.value += 1;
  }

  getDocuments();
};

async function getDocuments(filterValue?: string) {
  isLoading.value = true;
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
  await axios.get(`/api/documents`, {
    params: {
      page: currentPage.value,
    }
  })
    .then((res: any) => {
      let data = res;
      if (filterValue) {
        data = res.filter((document: Record<string, any>) => document.title.toLowerCase().includes(filterValue.toLowerCase()));
      }

      documents.value = data;
    })
    .catch((error: Error) => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Lấy dữ liệu tài liệu thất bại';
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
