import { createWebHistory, createRouter } from 'vue-router';

import {
  Dashboard,
  OnlineExam,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
