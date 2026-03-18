import { AppRouteRecord } from '@/types/router';

/**
 * Payments (收费管理) 路由配置
 */
export const paymentsRoutes: AppRouteRecord[] = [
  {
    component: '/payments',
    meta: {
      headerBar:{
        globalSearch:false
      },
      icon: 'local-business/payments',
      keepAlive: false,
      roles: ['ADMIN'],
      title: 'menus.payments.title',
      fixedHeight: true,
    },
    name: 'Payments',
    path: '/payments',
  },
];
