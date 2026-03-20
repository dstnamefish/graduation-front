import { AppRouteRecord } from '@/types/router';

export const feedbackRoutes: AppRouteRecord[] = [
  {
    path: '/feedback',
    name: 'Feedback',
    component: '/feedback',
    meta: {
      title: '反馈管理',
      icon: 'hugeicons:feedback',
    },
  },
];
