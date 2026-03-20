import { AppRouteRecord } from '@/types/router';

/**
 * Doctors (医生管理) 路由配置
 */
export const doctorsRoutes: AppRouteRecord[] = [
  {
    component: '/doctors',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'hugeicons:stethoscope-02',
      keepAlive: false,
      roles: ['super_admin', 'department_admin', 'patient'],
      fixedHeight: true,
      title: 'menus.doctors.title',
    },
    name: 'Doctors',
    path: '/doctors',
  },
];
