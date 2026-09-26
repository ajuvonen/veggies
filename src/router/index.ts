import {nextTick} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import {useAppStateStore} from '@/stores/appStateStore';
import {focusPageHeading} from '@/utils/helpers';

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
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {path: '/:pathMatch(.*)*', redirect: '/'},
  ],
});

router.beforeEach((to) => {
  const {settings} = useAppStateStore();
  if (!['home', 'privacy'].includes(to.name as string) && !settings.startDate) {
    return {name: 'home', replace: true};
  }
});

router.afterEach(async (_to, from) => {
  if (!from.matched.length) {
    // Skip the initial navigation; the browser already handles focus on first load.
    return;
  }
  await nextTick();
  focusPageHeading();
});

export default router;
