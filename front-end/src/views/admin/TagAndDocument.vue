<template lang="pug">
Page(
  title="Nhãn và Tài liệu",
  subtitle="Thông tin các nhãn và tài liệu, giúp phần hỗ trợ trong việc tạo bài kiểm tra và gợi ý câu hỏi",
)
  .mt-2
    TagsTable

  .mt-4
    DocumentsTable
</template>
<script setup lang="ts">
import { ref, inject } from 'vue';
import { useAuthStore } from '@/stores';
import { TAGS } from '@/configs';
import { TagsTable, DocumentsTable } from '@/components';
import { LayoutSection } from '@ownego/polaris-vue';
import SearchMinor from '@icons/SearchMinor.svg?component';


const axios: any = inject('axios');
const token = useAuthStore().token;

const documents = ref([]);
const newDocument = ref({
  title: '',
  content: '',
  tags: [],
});


</script>
