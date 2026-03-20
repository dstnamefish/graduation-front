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
      icon: 'hugeicons:dashboard-02',
      keepAlive: false,
      roles: ['super_admin', 'department_admin', 'doctor', 'patient'],
      fixedHeight: false,
      title: 'menus.dashboard.title',
    },
    name: 'Dashboard',
    path: '/dashboard',
  },
];
