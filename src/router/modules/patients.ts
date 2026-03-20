import { AppRouteRecord } from '@/types/router';

/**
 * Patients (患者管理) 路由配置
 */
export const patientsRoutes: AppRouteRecord[] = [
  {
    component: '/patients',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'hugeicons:user-group',
      keepAlive: false,
      roles: ['super_admin', 'department_admin', 'doctor'],
      fixedHeight: true,
      title: 'menus.patients.title',
    },
    name: 'Patients',
    path: '/patients',
  },
];
