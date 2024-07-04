import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import {useActivityStore} from '@/stores/activityStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: () => {
        const {settings} = useActivityStore();
        if (settings.startDate) {
          return {name: 'log', replace: true};
        }
      },
    },
    {
      path: '/log',
      name: 'log',
      component: () => import('@/views/LogView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
  ],
});

router.beforeEach((to) => {
  const {settings} = useActivityStore();
  if (to.name !== 'home' && !settings.startDate) {
    return {name: 'home', replace: true};
  }
});

export default router;
