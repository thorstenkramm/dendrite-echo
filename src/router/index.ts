import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import ComingSoonView from '@/views/ComingSoonView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/files',
      name: 'files',
      component: ComingSoonView,
      props: { title: 'Files' },
    },
    {
      path: '/commands',
      name: 'commands',
      component: ComingSoonView,
      props: { title: 'Commands' },
    },
    {
      path: '/console',
      name: 'console',
      component: ComingSoonView,
      props: { title: 'Console' },
    },
    {
      path: '/monitoring',
      name: 'monitoring',
      component: ComingSoonView,
      props: { title: 'Monitoring' },
    },
  ],
})

export default router
