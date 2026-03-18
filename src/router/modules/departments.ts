import { AppRouteRecord } from '@/types/router';

/**
 * Departments (科室管理) 路由配置
 */
export const departmentsRoutes: AppRouteRecord[] = [
  {
    component: '/department/list',

    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'local-business/departments',
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
    name: 'DepartmentDetails',
    path: '/departments/:id',
  },
];