<template lang="pug">
Frame(
  :show-mobile-navigation="isCollapsed",
  @navigation-dismiss="isCollapsed = !isCollapsed",
)
  template(#navigation)
    Navigation(location="/")
      NavigationSection(
        :items="navItems"
      )
  template(#topBar)
    TopBar(
      show-navigation-toggle,
      @navigation-toggle="isCollapsed = !isCollapsed",
    )

      template(#userMenu)
        TopBarUserMenu(
          :actions="actions",
          :initials="user.name[0]",
          :name="user.name",
          :detail="user.email",
          :open="isUserMenuOpen",
          @toggle="isUserMenuOpen = !isUserMenuOpen"
        )
  router-view
  Toast(
    v-if="toastData.active",
    :duration="3000",
    :error="toastData.error",
    :content="toastData.content",
    @dismiss="toggleToast",
  )
</template>

<script setup lang="ts">
import { ref, reactive, computed, provide, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore, useQuestionStore, useTagStore, useDocumentStore } from '@/stores'
import HomeMajor from '@icons/HomeMajor.svg?component';
import NoteMajor from '@icons/NoteMajor.svg?component';
import CustomersMajor from '@icons/CustomersMajor.svg?component';
import QuestionMarkMajor from '@icons/QuestionMarkMajor.svg?component';
import TimelineAttachmentMajor from '@icons/TimelineAttachmentMajor.svg?component';
import InsertDynamicSourceMajor from '@icons/InsertDynamicSourceMajor.svg?component';
import ProfileMajor from '@icons/ProfileMajor.svg?component';
import ListMajor from '@icons/ListMajor.svg?component';
import ProductsMajor from '@icons/ProductsMajor.svg?component';

const router = useRouter();
const route = useRoute();

const user = useAuthStore();
const axios: any = inject('axios');

const auth = useAuthStore();
const { getTags } = useTagStore();
const { getDocuments } = useDocumentStore();
const { getQuestions } = useQuestionStore();

const init = async() => {
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    auth.setuseAuthStore(storageToken);
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  } else {
    router.push({ name: 'login'});
  }

  getTags();
  getDocuments();
  getQuestions();
}

init();

const toastData = reactive<Record<string, any>>({
  active: false,
  error: false,
  content: '',
})

const toggleToast = () => {
  toastData.active = !toastData.active;
};

provide('toastData', toastData);
provide('isAdmin', user.isAdminUser);

const isCollapsed = ref<boolean>(false);
const isUserMenuOpen = ref<boolean>(false);
const actions = ref<Record<string, any>[]>([
  { items: [{ content: 'Thông tin cá nhân', onAction: () => router.push({ name: 'user-profile'})  }] },
  { items: [{ content: 'Đăng xuất', onAction: () => router.push({ name: 'login'}) }] },
]);

const navItems = computed(() => {
  const adminLayout = [
    {
      label: 'Trang chủ',
      icon: HomeMajor,
      selected: (route.name === 'dashboard'),
      onClick: () => redirect('dashboard'),
    },
    {
      label: 'Câu hỏi từ người dùng',
      icon: ListMajor,
      selected: (route.name === 'list-question-from-user'),
      onClick: () => redirect('list-question-from-user'),
    },
    {
      label: 'Ngân hàng câu hỏi',
      icon: QuestionMarkMajor,
      selected: (route.name === 'list-question'),
      onClick: () => redirect('list-question'),
    },
    {
      label: 'Danh sách người dùng',
      icon: CustomersMajor,
      selected: (route.name === 'list-user'),
      onClick: () => redirect('list-user'),
    },
    {
      label: 'Nhãn và tài liệu',
      icon: ProductsMajor,
      selected: (route.name === 'tag-and-document'),
      onClick: () => redirect('tag-and-document'),
    },
    {
      label: 'Thông tin cá nhân',
      icon: ProfileMajor,
      selected: (route.name === 'user-profile'),
      onClick: () => redirect('user-profile'),
    },
  ];

  const userLayouts = [
    {
      label: 'Trang chủ',
      icon: HomeMajor,
      selected: (route.name === 'dashboard'),
      onClick: () => redirect('dashboard'),
    },
    {
      label: 'Kiểm tra',
      icon: NoteMajor,
      selected: (route.name === 'online-exam'),
      onClick: () => redirect('online-exam'),
    },
    {
      label: 'Lịch sử  làm bài',
      icon: TimelineAttachmentMajor,
      selected: (route.name === 'user-test-history'),
      onClick: () => redirect('user-test-history'),
    },
    {
      label: 'Đóng góp câu hỏi',
      icon: InsertDynamicSourceMajor,
      selected: (route.name === 'user-question-addd'),
      onClick: () => redirect('user-question-addd'),
    },
    {
      label: 'Thông tin người dùng',
      icon: ProfileMajor,
      selected: (route.name === 'user-profile'),
      onClick: () => redirect('user-profile'),
    },
  ]

  return user.isAdminUser ? adminLayout : userLayouts;
});




const redirect = (routeName: string): void => {
  router.push({ name: routeName });
};
</script>
