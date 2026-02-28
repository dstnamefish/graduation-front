import { AppRouteRecord } from '@/types/router';

/**
 * Doctors (医生管理) 路由配置
 */
export const doctorsRoutes: AppRouteRecord[] = [
  {
    component: '/doctors',
    meta: {
      headerBar: {
        breadcrumb: true,
        globalSearch: false,
      },
      icon: 'local-menu/doctors',
      keepAlive: false,
      roles: ['ADMIN'],
      fixedHeight: true,
      title: 'menus.doctors.title',
    },
    name: 'Doctors',
    path: '/doctors',
  },
];
