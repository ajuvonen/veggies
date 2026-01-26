import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import {useAppStateStore} from '@/stores/appStateStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: () => {
        const {settings} = useAppStateStore();
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
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/StatsView.vue'),
    },
    {path: '/:pathMatch(.*)*', redirect: '/'},
  ],
});

router.beforeEach((to) => {
  const {settings} = useAppStateStore();
  if (to.name !== 'home' && !settings.startDate) {
    return {name: 'home', replace: true};
  }
});

export default router;
