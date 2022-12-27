import { createWebHistory, createRouter } from 'vue-router';

import {
  Dashboard,
  OnlineExam,
  OnlineExamTest,
  AdminIndex,
  ListQuestion,
  ListUser,
  NotFound,
} from '@/views';

const routes = [
  {
    path: '',
    name: 'dash-board',
    component: Dashboard,
  },
  {
    path: '/online-exam',
    name: 'online-exam',
    component: OnlineExam,
  },
  {
    path: '/online-exam/:id/:time',
    name: 'online-exam-test',
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
      {
        path: 'list-user',
        name: 'list-user',
        component: ListUser,
      },
    ],
  },
    // https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    name: 'not-found',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
