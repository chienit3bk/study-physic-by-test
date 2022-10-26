<template lang="pug">
.online-exam
  Page.pb-5(
    full-width,
    :title="$t('online_exam.title')",
    :subtitle="$t('online_exam.subtitle')",
    :breadcrumbs="[{content: 'DashBoard', url: '/'} ]",
  )
    Layout
      LayoutSection
        Grid(
          :columns="{ xs: 1, sm: 4, md: 4, lg: 6, xl: 6 }"
        )
          // Chọn các chương
          GridCell
            Card
              OptionList(
                v-model="examChapter"
                :title="$t('select_exam.choose_type')"
                :options="chapters"
              )

            Select.pt-3(
              :placeholder="$t('select_exam.choose_time')",
              v-model="examTime",
              :options="times",
            )
              template(#label) {{ $t('select_exam.time_label') }}

            Select.pt-3(
              :placeholder="$t('select_exam.choose_level')",
              v-model="examLevel",
              :options="LEVELS",
            )
              template(#label) {{ $t('select_exam.level_label')}}

          // Chọn các dạng
          GridCell(v-if="examChapter.length")
            Card
              ChoiceList.ps-2.pe-2(
                v-for="chapter, index in examChapterChosen"
                :key="index",
                allow-multiple,
                :name="$t('select_exam.choose_type')",
                v-model="examChapterOptions",
                :choices="getChapterOptions(chapter)",
              )
                Text.pt-2(variant="headingSm" as="h6") {{ chapter.name }}

          GridCell(v-if="examChapterOptions.length")
            Stack
              Tag(
                v-for="option, index in examChapterOptions",
                :key="index",
                @remove="handleRemoveOptionTag(option)",
              ) {{ option }}

      LayoutSection(
        full-width
      )
        Grid
          GridCell(
            v-for="exam in exams"
            :key="exam.id",
            :column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }"
          )
            ExamTest(
              :id="exam.id",
              :title="exam.title",
              :numberQuestion="exam.number_question",
              :time="exam.time",
              :type="exam.type",
              :points="exam.points",
              @get-and-show-questions="getAndShowQuestions"
            )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ExamTest } from '@/components/online-exam';
import { CHAPTERS, LEVELS, EXAM_TIME } from '@/configs/onlineExam';
import { examTestsFake } from './dataFake';

const router = useRouter();

const examChapter = ref([]);
const examChapterOptions = ref([]);
const examLevel = ref('');
const examTime = ref('');

const listExam = examTestsFake;
const exams = listExam;


const chapters = CHAPTERS.map((chapter: Record<string, any>, index: number) => {
  return {
    label: `${index + 1}. ${chapter.name}`,
    value: chapter.id,
  };
});

const times = EXAM_TIME.map((time: number, index: number) => {
  return {
    label: `${time/60} phút`,
    value: time,
  };
});

const examChapterChosen = computed(() => {
  return CHAPTERS
    .filter((chapter: Record<string, any>) => chapter.id <= examChapter.value[0])
    .reverse();
});

const getChapterOptions = (chapter: Record<string, any>) => {
  return  chapter.options.map((option: string, index: number) => {
    return {
      label: `Dang ${index + 1}. ${option}`,
      value: option,
    };
  });
};

const getAndShowQuestions = (dataExam: Record<string, number>) => {
  console.log(dataExam);
  router.push({name: 'OnlineExamTest', params: { id: dataExam.id , time: dataExam.time }});
};

const handleRemoveOptionTag = (tagOption: string) => {
  examChapterOptions.value = examChapterOptions.value.filter(option => option !== tagOption);
};

</script>
