<template lang="pug">
.vertical-tab-list-card
  Card
    CardSection
      DisplayText(size="small") {{ cardTitle }}

    Stack(
      v-if="isLoading",
      distribution="center",
    )
      .my-5
        Spinner

    CardSection.container.p-0(v-else)
      .row
        .col-lg-3.overflow-hidden
          Tabs(
            fitted,
            :key="windowWidth",
            :tabs="tabs",
            :selected="selectedTab",
            @select="handleTabChange",
          )
            template(
              v-for="(tab, index) in tabs",
              :key="index",
              v-slot:[tab.id],
            )
              .me-3
                Icon(
                  v-if="tab.marked",
                  color="primary",
                  :source="CircleTickMajor",
                )
                Icon(
                  v-else-if="tab.icon",
                  :source="tab.icon",
                  :color="selectedTab === Number(index) || tab.marked ? 'primary' : 'subdued'",
                )
              TextStyle(variation="strong") {{ tab.content }}

        .col
          Stack.h-100(
            vertical,
            distribution="equalSpacing",
            :wrap="false",
          )
            CalloutCard.shadow-none(
              :title="selectedTabSection.title",
              :primary-action="selectedTabSection.primaryAction",
              :illustration="selectedTabSection.illustration || ''",
            )
              span {{ selectedTabSection.content }}

            .m-3(v-if="selectedTabSection.footer")
              Stack(spacing="tight")
                Icon(:source="InfoMinor", color="highlight")
                template(v-if="selectedTabSection.footer?.url")
                  Link(:url="selectedTabSection.footer?.url") {{ selectedTabSection.footer?.text }}
                template(v-else-if="selectedTabSection.footer?.onAction")
                  Button(
                    plain,
                    @click="() => { selectedTabSection.footer?.onAction && selectedTabSection.footer?.onAction() }",
                  ) {{ selectedTabSection.footer?.text }}
                span(v-else) {{ selectedTabSection.footer?.text }}
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, computed } from 'vue';
import CircleTickMajor from '@icons/CircleTickMajor.svg?component';
import InfoMinor from '@icons/InfoMinor.svg?component';
import type { VueElementConstructor } from 'vue';

interface Tab {
  id: string,
  content: string,
  icon: string | 'placeholder' | VueElementConstructor,
  marked?: boolean,
  section: {
    title: string,
    content: string,
    illustration?: string,
    primaryAction?: {
      content?: string,
      primary?: boolean,
      outline?: boolean,
      onAction?: () => void,
    },
    footer?: {
      url?: string,
      text?: string,
      onAction?: () => void,
    },
  },
}

interface Props {
  cardTitle?: string
  tabs: Tab[],
  selectedTab?: number,
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedTab: 0,
});

const selectedTab = ref<number>(props.selectedTab);
const windowWidth = ref(window.innerWidth);

const selectedTabSection = computed(() => props.tabs[selectedTab.value].section);

const handleTabChange = (index: number): void => {
  selectedTab.value = index;
};

const setResizeWidth = (): void => {
  windowWidth.value = window.innerWidth;
};

window.addEventListener('resize', setResizeWidth);



onUnmounted(() => window.removeEventListener('resize', setResizeWidth));
</script>
