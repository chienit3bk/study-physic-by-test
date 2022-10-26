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
          Card
            OptionList(
              v-model="examChapter"
              :title="$t('select_exam.choose_type')"
              :options="chapters"
            )

          // Chọn các dạng
          GridCell(v-if="examChapter")
            Card
              ChoiceList.ps-2.pe-2(
                allow-multiple,
                :name="$t('select_exam.choose_type')",
                v-model="examChapterOptions",
                :choices="chapterOptions",
              )
          GridCell(v-if="examChapterOptions.length")
            Stack
              Tag(
                v-for="option, index in examChapterOptions",
                :key="index",
                @remove="handleRemoveOptionTag(option)",
              ) {{ option }}
      LayoutSection
        Grid(
          :columns="{ xs: 1, sm: 4, md: 4, lg: 6, xl: 6 }"
        )
          // Chọn thời gian làm bài
          GridCell
            Select(
              :placeholder="$t('select_exam.choose_time')",
              v-model="examTime",
              :options="times",
            )
              template(#label) {{ $t('select_exam.time_label') }}

          // Chọn độ khó
          GridCell
            Select(
              :placeholder="$t('select_exam.choose_level')",
              v-model="examLevel",
              :options="LEVELS",
            )
              template(#label) {{ $t('select_exam.level_label')}}

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
    value: String(chapter.id),
  };
});

const times = EXAM_TIME.map((time: number, index: number) => {
  return {
    label: `${time/60} phút`,
    value: String(time),
  };
});

const chapterOptions = computed(() => {
  const currentChapter = CHAPTERS.find((chapter: Record<string, any>) => chapter.id === examChapter.value[0]);

  if (currentChapter) {
    return  currentChapter.options.map((option: string, index: number) => {
      return {
        label: `Dang ${index + 1}. ${option}`,
        value: option,
      };
    });
  }

  return [];
});

const getAndShowQuestions = (dataExam: Record<string, number>) => {
  console.log(dataExam);
  router.push({name: 'OnlineExamTest', params: { id: dataExam.id , time: dataExam.time }});
};

const handleRemoveOptionTag = (tagOption: string) => {
  examChapterOptions.value = examChapterOptions.value.filter(option => option !== tagOption);
};

</script>
