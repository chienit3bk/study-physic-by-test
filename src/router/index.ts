import { createWebHistory, createRouter } from 'vue-router';

import Dashboard from '@/views/DashBoard.vue';
const routes = [
  {
    path: '',
    component: Dashboard,
    name: 'DashBoard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
