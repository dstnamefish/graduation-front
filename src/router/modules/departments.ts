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
      icon: 'hugeicons:hospital-02',
      keepAlive: false,
      roles: ['super_admin', 'department_admin', 'doctor', 'patient'],
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
      roles: ['super_admin', 'department_admin', 'doctor', 'patient'],
      isDetail: true,
    },
    name: 'DepartmentDetails',
    path: '/departments/:id',
  },
];
