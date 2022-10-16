import { createWebHistory, createRouter } from 'vue-router';

import {
  Dashboard,
  OnlineExam,
  OnlineExamTest,
} from '@/views';

const routes = [
  {
    path: '',
    component: Dashboard,
    name: 'DashBoard',
  },
  {
    path: '/online-exam',
    component: OnlineExam,
    name: 'OnlineExam',
  },
  {
    path: '/online-exam/:id',
    component: OnlineExamTest,
    name: 'OnlineExamTest',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
