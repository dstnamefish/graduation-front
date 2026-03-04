import { AppRouteRecord } from '@/types/router';

/**
 * Departments (科室管理) 路由配置
 */
export const departmentsRoutes: AppRouteRecord[] = [
  {
    component: '/departments',

    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'local-menu/departments',
      keepAlive: false,
      roles: ['ADMIN'],
      title: 'menus.departments.title',
    },
    name: 'Departments',
    path: '/departments',
  },
  {
    component: '/departments/detail',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      title: 'Department Details',
      isHide: true,
      activePath: '/departments',
      roles: ['ADMIN'],
      isDetail: true,
    },
    name: 'DepartmentDetail',
    path: '/departments/:id',
  },
];