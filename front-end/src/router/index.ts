import { createWebHistory, createRouter } from 'vue-router';

import {
  Dashboard,
  OnlineExam,
  OnlineExamTest,
  AdminIndex,
  ListQuestion,
  ListUser,
  UserProfile,
  Login,
  NotFound,
  QuestionFromUser,
  ListQuestionFromUser,
  UserTestHistory,
  TagAndDocument,
} from '@/views';
import { AppLayout } from '@/layout';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  // auth router
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
      },

      {
        path: '/online-exam',
        name: 'online-exam',
        component: OnlineExam,
      },
      {
        path: '/online-exam/:id',
        name: 'online-exam-test',
        component: OnlineExamTest,
      },
      {
        path: '/user-test-history',
        name: 'user-test-history',
        component: UserTestHistory,
      },
      {
        path: '/user-question-addd',
        name: 'user-question-addd',
        component: QuestionFromUser,
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
          {
            path: 'list-question-from-user',
            name: 'list-question-from-user',
            component: ListQuestionFromUser,
          },
          {
            path: 'tag-and-document',
            name: 'tag-and-document',
            component: TagAndDocument,
          }
        ],
      },
      {
        path: '/users/:id?',
        name: 'user-profile',
        component: UserProfile,
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
