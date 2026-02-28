import { AppRouteRecord } from '@/types/router';

/**
 * Dashboard (仪表板) 路由配置
 */
export const dashboardRoutes: AppRouteRecord[] = [
  {
    component: '/dashboard',
    meta: {
      headerBar: {
        breadcrumb: false,
        globalSearch: true,
      },
      icon: 'local-menu/dashboard',
      keepAlive: false,
      roles: ['ADMIN'],
      fixedHeight: false,
      title: 'menus.dashboard.title',
    },
    name: 'Dashboard',
    path: '/dashboard',
  },
];
