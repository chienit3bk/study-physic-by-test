<template lang="pug">
Frame(
  :logo="logo",
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
          :color-scheme="darkUserMenu ? 'dark' : 'light'",
          name="userName",
          initials="initials",
          detail="shopOwner",
          :message="userMenuMessage",
          :open="isUserMenuOpen",
          :actions="userMenuAction || []",
          @toggle="isUserMenuOpen = !isUserMenuOpen",
        )
  slot
</template>

<script setup lang="ts">
import { provide, ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import HomeMinor from '@icons/HomeMinor.svg';
import NoteMinor from '@icons/NoteMinor.svg';
import CustomersMinor from '@icons/CustomersMinor.svg';
import QuestionMarkMinor from '@icons/QuestionMarkMinor.svg';
const router = useRouter();
const route = useRoute();

interface Props {
  logo?: Record<string, any>,
  navigationLocation?: string,
  navigationSections?: Record<string, Record<string, any>>,
  userMenuAction?: Record<string, any>[],
  userMenuMessage?: Record<string, any>,
  secondaryMenuAction?: Record<string, any>[],
  darkUserMenu?: boolean,
}

defineProps<Props>();

const isCollapsed = ref<boolean>(false);
const isUserMenuOpen = ref<boolean>(false);
const isToastActive = ref<boolean>(false);
const navItems = computed(() => {
  return [
    {
      label: 'Trang chủ',
      icon: HomeMinor,
      selected: (route.name === 'dash-board'),
      onClick: () => redirect('dash-board'),
    },
    {
      label: 'Kiểm tra',
      icon: NoteMinor,
      selected: (route.name === 'online-exam'),
      onClick: () => redirect('online-exam'),
    },
    {
      label: 'Ngân hàng câu hỏi',
      icon: QuestionMarkMinor,
      selected: (route.name === 'list-question'),
      onClick: () => redirect('list-question'),
    },
    {
      label: 'Danh sách người dùng',
      icon: CustomersMinor,
      selected: (route.name === 'list-user'),
      onClick: () => redirect('list-user'),
    },
  ]
});


const redirect = (routeName: string): void => {
  router.push({ name: routeName });
};
</script>
