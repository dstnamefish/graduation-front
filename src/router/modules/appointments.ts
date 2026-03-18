import { AppRouteRecord } from '@/types/router';

/**
 * Appointments (预约管理) 路由配置
 */
export const appointmentsRoutes: AppRouteRecord[] = [
  {
    component: '/appointments',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'local-business/appointments',
      fixedHeight: true,
      title: 'menus.appointments.title',
    },
    name: 'Appointments',
    path: '/appointments',
  },
];
