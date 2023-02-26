<template lang="pug">
Page(
  title="Nhãn và Tài liệu",
  subtitle="Thông tin các nhãn và tài liệu, giúp phần hỗ trợ trong việc tạo bài kiểm tra và gợi ý câu hỏi",
)
  Layout
    LayoutSection(:one-half="true")
      Card(sectioned)
        template(#title) Tạo tài liệu mới
        Stack(vertical)
          TextField(v-model="newDocument.title")
            template(#label) Tiêu đề của tài liệu
          TextField(v-model="newDocument.content" :multiline="5")
            template(#label) Nội dung tài liệu
          Combobox(allow-multiple)
            template(#activator)
              ComboboxTextField(
                autoComplete="off",
                :labelHidden="true",
                v-model="tagsSelected",
                :placeholder="$t('list_question.question_add_tag')",
              )
                template(#prefix)
                  Icon(:source="SearchMinor", color="inkLighter")

            Listbox(@select="handleTagSelected")
              ListboxOption(
                v-for="tag, index in TAGS"
                :key="index"
                :value="tag"
                :selected="isOptionSelected(tag)"
              ) {{ tag }}
          Stack
            Tag(
              v-for="tag, index in newDocument.tags",
              :key="index",
              @remove="handleTagSelected(tag)",
            ) {{ tag }}
          Stack(distribution="center")
            Button(primary) Thêm tài liệu
    LayoutSection(:one-half="true")
      Card(sectioned)
        template(#title) Thêm nhãn mới
        Stack(vertical)
          TextField(v-model="newTag.content")
            template(#label) Nội dung nhãn
          Stack(distribution="center")
            Button(primary @click="createTags") Thêm nhãn

</template>
<script setup lang="ts">
import { ref, inject } from 'vue';
import { authStore } from '@/stores';
import { TAGS } from '@/configs';
import { LayoutSection } from '@ownego/polaris-vue';
import SearchMinor from '@icons/SearchMinor.svg?component';


const axios: any = inject('axios');
const token = authStore().token;

const tags = ref(TAGS);
const documents = ref([]);
const newDocument = ref({
  title: '',
  content: '',
  tags: [],
});

const newTag = ref({
  content: '',
})
const tagsSelected = ref('');
const handleTagSelected = (tag: string | never): void => {
  const index = newDocument.value.tags?.indexOf(tag);

  if (index === -1) {
    newDocument.value.tags?.push(tag);
  } else {
    newDocument.value.tags = newDocument.value.tags?.filter((item: string) => item !== tag);
  }
};

const getTags = () => {
  axios.get('/api/tags')
    .then((res: any) => console.log(res));
};

const createTags = () => {
  const { content } = newTag.value;

  axios.post('/api/tags', { content })
    .then(() => alert('Thêm thành tag công'))
    .catch(() => alert('Thêm thất tag bại'));
}

const createDocument = () => {

}

const isOptionSelected = (tag: string) => {
  return newDocument.value.tags?.some((item: string) => item === tag);
};

getTags();
</script>
