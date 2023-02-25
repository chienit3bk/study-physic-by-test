<template lang="pug">
.user-list
  Page(
    :title="$t('list_user.title')",
    :subtitle="$t('list_user.subtitle')",
    :breadcrumbs="[{ content: 'Dashboard', url: '/' }]"
  )
    Card(sectioned)
      Filters(
        v-model="paramsRequestGetSubs.inputFilterValue",
        :filters="[]",
        @query-clear="handleClearQuery",
        @query-change="handleChangeQuery",
      )
      IndexTable(
        :item-count="users.length",
        :headings="headings",
        :selectable="false",
        lastColumnSticky,

      )
        IndexTableRow(
          v-for="user, index in users",
          :key="user.id",
          :id="user.id",
          :position="index",
        )
          IndexTableCell {{ user.name }}
          IndexTableCell {{ user.username }}
          IndexTableCell {{ user.average_point }}
          IndexTableCell {{ user.total_time }}
          IndexTableCell
            Stack
              Button(
                plain,
                :icon="ViewMinor",
                @click="redirectToUserInfor(user.id)"
              )
              Button(
                plain,
                :icon="DeleteMinor",
                @click="requestDeleteUser(user.id)"
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
  @close="toggleModalDeleteUser",
  :primary-action="{ content: $t('common.cancel'), onAction: toggleModalDeleteUser }",
  :secondary-actions="[{ content: $t('common.delete'), onAction: () => confirmDeleteUser(selectedUser.id) }]"
)
  template(#title) {{ $t('list_user.title_modal_delete') }}
  template(#content)
    ModalSection {{  $t('list_user.content_modal_delete', { name: selectedUser.email }) }}
</template>

<script setup lang="ts">
import { userFake } from '../dataFake';
import { ref, computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';
import DeleteMinor from '@icons/DeleteMinor.svg?component';
import ViewMinor from '@icons/ViewMinor.svg?component';

const axios: any = inject('axios');
const router = useRouter();

const users = ref<Record<string, any>[]>([]);
const isLoading = ref<boolean>(false);
const isActiveModalDelete = ref<boolean>(false);
const selectedUser = ref<Record<string, any>>({});
const metaData = ref<Record<string, any>>({});
const paramsRequestGetSubs = ref<Record<string, any>>({ page: 1, per_page: 7 });

const hasNextPage = computed<boolean>(() => metaData.value.current_page < metaData.value.last_page && !isLoading.value);
const hasPreviousPage = computed<boolean>(() => metaData.value.current_page > 1 && !isLoading.value);

const headings = [
  { title: 'Tên' },
  { title: 'Gmail(Tên đăng nhập)' },
  { title: 'Điểm trung bình' },
  { title: 'Tổng thời gian' },
  { title: 'Hành động' },
]

const getListUsers = () => {
  return;
}

const handleClearQuery = () => {
  paramsRequestGetSubs.value.inputFilterValue = null;
  getListUsers();
};

const handleChangeQuery = debounce(() => getListUsers(), 500);

const redirectToUserInfor = (id: number) => {
  router.push({ name: 'user-profile', params: { id }})
};

const requestDeleteUser = (user: Record<string, any>) => {
  isActiveModalDelete.value = true;
  selectedUser.value = user;
};

const confirmDeleteUser = (id: number) => {

};

const toggleModalDeleteUser = () => {
  isActiveModalDelete.value = !isActiveModalDelete.value;
};

const handlePressPagination = (page: number) => {
  paramsRequestGetSubs.value.page = page;
  getListUsers();
};


// Created
const init = () => {
  users.value = userFake;
  getListUsers();
};

init();
</script>
