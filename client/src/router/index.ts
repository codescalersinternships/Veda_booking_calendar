// Composables
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/default/default.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/login.vue'),
      },
    ],
  },
  {
    path: '/register-user',
    component: () => import('@/layouts/default/default.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import(/* webpackChunkName: "home" */ '@/views/register_user.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
