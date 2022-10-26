import { createWebHistory, createRouter } from 'vue-router';

import {
  Dashboard,
  OnlineExam,
  OnlineExamTest,
  NotFound,
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
    // https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    name: 'NotFound',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
