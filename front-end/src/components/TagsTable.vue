<template lang="pug">
.tag-list
  Card(sectioned)
    Stack.mb-2(distribution="trailing")
      Button(primary @click="isActiveModalAdd = true") Thêm nhãn
    Filters(
      v-model="paramsRequestGetTags.inputFilterValue",
      :filters="[]",
      query-placeholder="Tìm nhãn"
      @query-clear="handleClearQuery",
      @query-change="handleChangeQuery",
    )
    IndexTable(
      :loading="isLoading",
      :item-count="tags.length",
      :headings="headings",
      :selectable="false",
      lastColumnSticky,
    )
      IndexTableRow(
        v-for="(tag, index) in tags",
        :key="tag.id",
        :id="tag.id",
        :position="index",
      )
        IndexTableCell {{ tag.id }}
        IndexTableCell {{ tag.content }}
        IndexTableCell {{ tag.createdAt }}
        IndexTableCell
          Stack
            Button(
              plain,
              :icon="EditMinor",
              @click="requestEditTag(tag)"
            )
            Button(
              plain,
              :icon="DeleteMinor",
              @click="requestDeleteTag(tag)"
            )
    .mt-3
      Stack(distribution="center", alignment="center")
        Pagination(
          :key="String(isLoading)",
          :has-previous="currentPage !== 1",
          :has-next="currentPage !== parseInt(`${tagsStore.tags.length / 12}`) + 1",
          @previous="handlePressPagination('prev')",
          @next="handlePressPagination('next')",
        )
Modal(
  :open="isActiveModalDelete",
  @close="toggleModalDeleteTag",
  :primary-action="{ content: $t('common.delete'), onAction: confirmDeleteTag }",
  :secondary-actions="[{ content: $t('common.cancel'), onAction: toggleModalDeleteTag }]"
)
  template(#title) Xóa nhãn
  template(#content)
    ModalSection Xóa bỏ nhãn {{  tagSelected.content }}

Modal(
  :open="isActiveModalEdit",
  @close="isActiveModalEdit = false",
  :primary-action="{ content: 'Lưu', onAction: updateTag }",
  :secondary-actions="[{ content: 'Hủy', onAction: () => isActiveModalEdit = false }]"
)
  template(#title) Chỉnh sửa nhãn
  template(#content)
    ModalSection
      TextField(v-model="tagSelected.content")
        template(#label) Nội dung nhãn

Modal(
  :open="isActiveModalAdd",
  @close="isActiveModalAdd = false",
  :primary-action="{ content: 'Thêm', onAction: addTag }",
  :secondary-actions="[{ content: 'Hủy', onAction: () => isActiveModalAdd = false }]"
)
  template(#title) Thêm nhãn
  template(#content)
    ModalSection
      TextField(v-model="tagSelected.content")
        template(#label) Nội dung nhãn
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { useTagStore } from '@/stores';
import { debounce } from 'lodash';
import DeleteMinor from '@icons/DeleteMinor.svg?component';
import EditMinor from '@icons/EditMinor.svg?component';

const axios: any = inject('axios');
const init = async () => {
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
}

init();

const toastData: Record<string, any> = inject('toastData', {
  active: false,
  error: false,
  content: '',
});


const tagsStore = useTagStore();
const tags = ref<Record<string, any>[]>([]);

const tagSelected = ref<Record<string, any>>({
  id: 0,
  content: '',
});

const isLoading = ref<boolean>(false);
const isActiveModalEdit = ref<boolean>(false);
const isActiveModalDelete = ref<boolean>(false);
const isActiveModalAdd = ref<boolean>(false);

const currentPage = ref<number>(1);
const paramsRequestGetTags = ref<Record<string, any>>({});

const headings = [
  { title: 'ID' },
  { title: 'Nội dung' },
  { title: 'Thời gian tạo'},
  { title: 'Hành động' },
]

const handleClearQuery = () => {
  paramsRequestGetTags.value.inputFilterValue = null;
};

const handleChangeQuery = debounce(() => {getTags(paramsRequestGetTags.value.inputFilterValue)}, 500);

const requestEditTag = (tag: Record<string, any>) => {
  tagSelected.value = tag;
  isActiveModalEdit.value = true;
};

const requestDeleteTag = (tag: Record<string, any>) => {
  isActiveModalDelete.value = true;
  tagSelected.value = tag;

};

const confirmDeleteTag = () => {
  axios
    .delete(`/api/tags/${(tagSelected.value.id)}`)
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Xóa nhãn thành công';
      getTags();
      isActiveModalDelete.value = false;
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Xóa nhãn thất bại';
    });
};

const updateTag = () => {
  axios
    .put(`/api/tags/${tagSelected.value.id}`, {
      content: tagSelected.value.content,
    })
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Cập nhật nhãn thành công';
      getTags();
      isActiveModalEdit.value = false;
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Cập nhật nhãn thất bại';
    });
};

const addTag = () => {
  const { content } = tagSelected.value;

  axios.post('/api/tags', { content })
    .then(() => {
      toastData.active = true;
      toastData.error = false;
      toastData.content = 'Thêm nhãn thành công';
      getTags();
      isActiveModalAdd.value = false;
    })
    .catch(() => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Thêm nhãn thất bại';
      isActiveModalAdd.value = false;
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

  getTags();
};

async function getTags(filterValue?: string) {
  isLoading.value = true;
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
  await axios.get(`/api/tags`, {
    params: {
      page: currentPage.value,
      limit: 12,
    }
  })
    .then((res: any) => {
      let data = res;
      if (filterValue) {
        data = res.filter((tag: Record<string, any>) => tag.content.toLowerCase().includes(filterValue.toLowerCase()));
      }

      tags.value = data;
    })
    .catch((error: Error) => {
      toastData.active = true;
      toastData.error = true;
      toastData.content = 'Lấy dữ liệu các nhãn thất bại';
    });

  isLoading.value = false;
}

onMounted(async () => {
  const storageToken = await localStorage.getItem('session_token');
  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
  getTags();
});

</script>
