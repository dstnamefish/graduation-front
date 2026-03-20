import { AppRouteRecord } from '@/types/router';

export const systemRoutes: AppRouteRecord[] = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'hugeicons:settings',
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: '/system/user',
        meta: {
          title: '用户管理',
          icon: 'hugeicons:user',
        },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: '/system/role',
        meta: {
          title: '角色管理',
          icon: 'hugeicons:user-shield',
        },
      },
    ],
  },
];
