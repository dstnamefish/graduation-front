import { AppRouteRecord } from '@/types/router';

/**
 * DoctorsSchedule (医生排班) 路由配置
 */
export const doctorsScheduleRoutes: AppRouteRecord[] = [
  {
    component: '/doctors-schedule',
    meta: {
      icon: 'local-menu/schedule',
      keepAlive: false,
      roles: ['ADMIN'],
      title: 'menus.doctorsSchedule.title',
    },
    name: 'DoctorsSchedule',
    path: '/doctors-schedule',
  },
];
