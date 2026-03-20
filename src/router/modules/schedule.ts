import { AppRouteRecord } from '@/types/router';

export const scheduleRoutes: AppRouteRecord[] = [
  {
    path: '/schedule',
    name: 'Schedule',
    redirect: '/schedule/list',
    meta: {
      title: '排班管理',
      icon: 'hugeicons:calendar-03',
    },
    children: [
      {
        path: 'list',
        name: 'ScheduleList',
        component: '/schedule/list',
        meta: {
          title: '排班列表',
          icon: 'hugeicons:calendar',
        },
      },
    ],
  },
];
