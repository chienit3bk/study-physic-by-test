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
          IndexTableCell {{ user.email }}
          IndexTableCell {{ user.phone }}
          IndexTableCell {{ user.address }}
          IndexTableCell
            Stack
              //- Button(
              //-   plain,
              //-   :icon="ViewMinor",
              //-   @click="redirectToUserInfor(user.id)"
              //- )
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
const init = async () => {
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
}

init();
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
  { title: 'Email(Tên đăng nhập)' },
  { title: 'Số điện thoại' },
  { title: 'Địa chỉ' },
  { title: 'Hành động' },
]

const getListUsers = async() => {
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }
  axios.get('/api/users')
    .then((res: Record<string, any>) => {
      users.value = res.filter((user: Record<string, any>) => user.role === 'user')
    })
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
getListUsers();

</script>
