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
import HomeMajor from '@icons/HomeMajor.svg';
import VocabularyMajor from '@icons/VocabularyMajor.svg';

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
const navItems = [
  { url: '#', label: 'Home', icon: HomeMajor },
  { url: '#', label: 'Online Exam', icon: VocabularyMajor },
];


const redirect = () => {
  
}
</script>
