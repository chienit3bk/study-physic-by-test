<template lang="pug">
.tag-list
  Card(sectioned)
    Stack.mb-2(distribution="trailing")
      Button(primary @click="isActiveModalAdd = true") Thêm nhãn
    Filters(
      v-model="paramsRequestGetSubs.inputFilterValue",
      :filters="[]",
      query-placeholder="Tìm nhãn"
      @query-clear="handleClearQuery",
      @query-change="handleChangeQuery",
    )
    IndexTable(
      :loading="isLoading",
      :item-count="tagStore.tags.length",
      :headings="headings",
      :selectable="false",
      lastColumnSticky,
    )
      IndexTableRow(
        v-for="(tag, index) in tagStore.tags",
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
import { ref, computed, inject, onMounted } from 'vue';
import { useTagStore } from '@/stores';
import { debounce } from 'lodash';
import DeleteMinor from '@icons/DeleteMinor.svg?component';
import EditMinor from '@icons/EditMinor.svg?component';

const axios: any = inject('axios');
const tagStore = useTagStore();

const tagSelected = ref<Record<string, any>>({
  id: 0,
  content: '',
});

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
  { title: 'Nội dung' },
  { title: 'Thời gian tạo'},
  { title: 'Hành động' },
]

const handleClearQuery = () => {
  paramsRequestGetSubs.value.inputFilterValue = null;
};

const handleChangeQuery = debounce(() => {}, 500);

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
      setTimeout(() => alert('Xóa nhãn thành công'));
      tagStore.getTags();
      isActiveModalDelete.value = false;
    })
    .catch(() => alert('Xóa nhãn thất bại'));
};

const updateTag = () => {
  axios
    .put(`/api/tags/${tagSelected.value.id}`, {
      content: tagSelected.value.content,
    })
    .then(() => {
      setTimeout(() => alert('Cập nhật nhãn thành công'));
      tagStore.getTags();
      isActiveModalEdit.value = false;
    })
    .catch(() => alert('Cập nhật nhãn thất bại'));
};

const addTag = () => {
  const { content } = tagSelected.value;

  axios.post('/api/tags', { content })
    .then(() => {
      setTimeout(() => alert('Thêm thành tag công'));
      tagStore.getTags();
      isActiveModalAdd.value = false;
    })
    .catch(() => alert('Thêm thất tag bại'));
}
const toggleModalDeleteTag = () => {
  isActiveModalDelete.value = !isActiveModalDelete.value;
};


const handlePressPagination = (page: number) => {
  paramsRequestGetSubs.value.page = page;
};

onMounted(async () => {
  isLoading.value = true;
  await tagStore.getTags();
  isLoading.value = false;
});

</script>
