<template lang="pug">
Frame(
  :logo="logo",
  :show-mobile-navigation="isCollapsed",
  @navigation-dismiss="isCollapsed = !isCollapsed",
)
  template(#navigation)

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

  <!-- Extra components -->
  Toast(
    v-if="isToastActive",
    v-bind="toastConfig",
    @dismiss="isToastActive = false",
  )
</template>

<script setup lang="ts">
import { provide, ref, reactive, computed } from 'vue';
import type { Toast } from '@/utilities/types';

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
let toastConfig = reactive<Toast>({
  content: '',
  duration: 5000,
  error: false,
});

const setToastActive = (value: boolean): void => {
  isToastActive.value = value;
};
const setToastConfig = (config: Toast): void => {
  toastConfig = config;
};

provide('toastContext', {
  setToastActive,
  setToastConfig,
});
</script>
