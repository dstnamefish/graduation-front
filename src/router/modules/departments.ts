import { AppRouteRecord } from '@/types/router';

/**
 * Departments (科室管理) 路由配置
 */
export const departmentsRoutes: AppRouteRecord[] = [
  {
    component: '/departments',
    meta: {
      icon: 'local-menu/departments',
      keepAlive: false,
      roles: ['ADMIN'],
      title: 'menus.departments.title',
    },
    name: 'Departments',
    path: '/departments',
  },
];
