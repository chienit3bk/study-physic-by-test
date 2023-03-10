<template lang="pug">
.dashboard
  Page(:full-width="false")
    Stack.mt-2(distribution="center")
      Text(as="h1" variant="heading2xl") Chào mừng bạn đến với Web ôn thi và cải thiện môn VẬT LÝ lớp 12
    .mt-4
      VerticalTabList(
        cardTitle="Hướng dẫn sử dụng",
        :isLoading='false',
        :tabs="guidTabs",
      )
    .mt-4
      Card
        Tabs(:tabs="tabs" :selected="selectedTab" @select="handleTabChange")
          CardSection(:title="tabs[selectedTab].content")
            Grid
              GridCell(
                v-for="exam in exams"
                :key="exam.id",
                :column-span="{ xs: 6, sm: 3, md: 3, lg: 6, xl: 4 }"
              )
                ExamTest(
                  :id="exam.id",
                  :title="exam.title",
                  :numberQuestion="exam.totalQuestion",
                  :time="exam.time",
                  :type="exam.type",
                  @get-and-show-questions="getAndShowQuestions"
                )
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ExamTest, VerticalTabList } from '@/components';
import { examTestsFake } from './dataFake';
import AppsMajor from '@icons/AppsMajor.svg?component';
import CircleTickMajor from '@icons/CircleTickMajor.svg?component';
import TimelineAttachmentMajor from '@icons/TimelineAttachmentMajor.svg?component';
import StatusActiveMajor from '@icons/StatusActiveMajor.svg?component';

const axios: any = inject('axios');

const router = useRouter();

const selectedTab = ref(0);
const adminId = 1;

const handleTabChange = (selectedTabIndex: number) => {
  selectedTab.value = selectedTabIndex;
};

const guidTabs = [
  {
    id: 'step-1',
    content: 'Làm bài kiểm tra',
    icon: AppsMajor,
    section: {
      title: 'Làm bài kiểm tra',
      content: 'Chọn các bài kiểm tra dưới đây để  thử sưc. Bạn có thể chọn làm các bài thì tùy mức độ: Nhận biết, thông hiểu, vận dụng thấp, vận dụng'
    }
  },
  {
    id: 'step-2',
    content: 'Xem kết quả',
    icon: CircleTickMajor,
    section: {
      title: 'Xem kết quả sau bài thi ',
      content: 'Xem các kết quả sau bài thi, xem câu nào làm đúng, câu nào làm sai và sai ở đâu, sai như thế nào'
    }
  },
  {
    id: 'step-3',
    content: 'Cải thiện',
    icon: StatusActiveMajor,
    section: {
      title: 'Cải thiện việc học tập',
      content: 'Hệ thống sẽ đưa ra các vấn đề bạn còn vướng mắc và gặp phải, đi kèm vào đó là tài liệu cụ thế giúp bạn có thể nhanh chóng cải thiện kiến thức, không lan man'
    }
  },
  {
    id: 'step-4',
    content: 'Xem lịch sử bài thi',
    icon: TimelineAttachmentMajor,
    section: {
      title: 'Xem kết quả mình đạt được',
      content: 'Xem kết quả các bài kiểm tra để thấy được sự cố gắng của bản thân nhé !!!!!'
    }
  },
]
const tabs = [
  {
    id: 'all',
    content: 'Toàn bộ',
    accessibilityLabel: 'Tất cả các bài thi',
    panelID: 'all',
  },
  {
    id: '2',
    content: '15 phút',
    panelID: '2',
  },
  {
    id: '3',
    content: '30 phút',
    panelID: '3',
  },
  {
    id: '4',
    content: '50 phút',
    panelID: '4 ',
  },
];

const exams = ref<Record<string, any>[]>(examTestsFake);

const getAndShowQuestions = (dataExam: Record<string, number>) => {
  router.push({name: 'online-exam-test', params: { id: dataExam.id }});
};

async function getExamsResult() {
  const storageToken = await localStorage.getItem('session_token');

  if (storageToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
  }

  axios.get(`/api/exams`)
    .then((exam: Record<string, any>[]) => {
      exams.value = exam
        .filter((item: Record<string, any>) => item.UserId === adminId)
        .map((e: Record<string, any>) => {
          let type;
          if (e.level === 1) {
            type = 'Lý thuyết';
          } else if (e.level === 2) {
            type = 'Nhận biết thông hiểu';
          } else if (e.level === 3) {
            type = 'Vận dụng thấp';
          } else {
            type = 'Vận dụng';
          }
          return { ...e, type};
        })

    })
}

// Created
getExamsResult();
</script>
