import { createWebHistory, createRouter } from 'vue-router';

import {
  Dashboard,
  OnlineExam,
  OnlineExamTest,
  AdminIndex,
  ListQuestion,
  NotFound,
} from '@/views';

const routes = [
  {
    path: '',
    name: 'DashBoard',
    component: Dashboard,
  },
  {
    path: '/online-exam',
    name: 'OnlineExam',
    component: OnlineExam,
  },
  {
    path: '/online-exam/:id',
    name: 'OnlineExamTest',
    component: OnlineExamTest,
  },
  {
    path: '/admin',
    // component: AdminIndex,
    children: [
      {
        path: '',
        name: 'admin',
        component: AdminIndex,
      },
      {
        path: 'list-question',
        name: 'list-question',
        component: ListQuestion,
      },
    ],
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
