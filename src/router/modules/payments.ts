import { AppRouteRecord } from '@/types/router';

/**
 * Payments (收费管理) 路由配置
 */
export const paymentsRoutes: AppRouteRecord[] = [
  {
    component: '/payments',
    meta: {
      icon: 'local-menu/payments',
      keepAlive: false,
      roles: ['ADMIN'],
      title: 'menus.payments.title',
    },
    name: 'Payments',
    path: '/payments',
  },
];
