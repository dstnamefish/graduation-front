import { AppRouteRecord } from '@/types/router';

/**
 * Appointments (预约管理) 路由配置
 */
export const appointmentsRoutes: AppRouteRecord[] = [
  {
    component: '/appointments',
    meta: {
      icon: 'local-menu/appointments',
      keepAlive: false,
      roles: ['ADMIN'],
      title: 'menus.appointments.title',
    },
    name: 'Appointments',
    path: '/appointments',
  },
];
