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
      icon: 'hugeicons:calendar-03',
      fixedHeight: true,
      roles: ['super_admin', 'department_admin', 'doctor', 'patient'],
      title: 'menus.appointments.title',
    },
    name: 'Appointments',
    path: '/appointments',
  },
];
