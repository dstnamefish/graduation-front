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
      icon: 'local-menu/patients',
      keepAlive: false,
      roles: ['ADMIN'],
      fixedHeight: true,
      title: 'menus.patients.title',
    },
    name: 'Patients',
    path: '/patients',
  },
];
