import { AppRouteRecord } from '@/types/router';

/**
 * DoctorsSchedule (医生排班) 路由配置
 */
export const doctorsScheduleRoutes: AppRouteRecord[] = [
  {
    component: '/doctors-schedule',
    meta: {
      icon: 'hugeicons:schedule',
      keepAlive: false,
      roles: ['super_admin', 'department_admin', 'doctor'],
      title: 'menus.doctorsSchedule.title',
    },
    name: 'DoctorsSchedule',
    path: '/doctors-schedule',
  },
];
