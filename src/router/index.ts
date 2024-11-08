import { createWebHistory, createRouter } from 'vue-router';
import { AppLayout } from '@/components';
import { Dashboard, Analytic, ManualRecommend, AutoRecommend } from '@/pages';
import { AppConfig } from '@/configs';

const routes = [
  {
    path: '/',
    component: AppLayout,
    meta: {
      appSlug: AppConfig.APP_SLUG,
      appName: AppConfig.APP_NAME,
    },
    children: [
      {
        path: '',
        name: 'app',
        component: Dashboard,
      },

      {
        path: 'analytic', 
        name: 'analytic',
        component: Analytic,
      },
      {
        path: 'manual-recommend', 
        name: 'manualRecommend',
        component: ManualRecommend,
      },
      {
        path: 'auto-recommend', 
        name: 'autoRecommend',
        component: AutoRecommend,
      },
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

