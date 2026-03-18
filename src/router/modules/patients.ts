import { AppRouteRecord } from '@/types/router';

/**
 * Patients (患者管理) 路由配置
 */
export const patientsRoutes: AppRouteRecord[] = [
  {
    // Move list view into dedicated folder to avoid ComponentLoader hitting it for detail route
    component: '/patients',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'local-business/menu-patients',
      keepAlive: false,
      roles: ['ADMIN'],
      fixedHeight: true,
      title: 'menus.patients.title',
    },
    name: 'Patients',
    path: '/patients',
  },
  
];
