import { AppRouteRecord } from '@/types/router';

/**
 * Messages (消息中心) 路由配置
 */
export const messagesRoutes: AppRouteRecord[] = [
  {
    component: '/messages',
    meta: {
      icon: 'hugeicons:message-multiple-02',
      keepAlive: false,
      roles: ['super_admin', 'department_admin', 'doctor', 'patient'],
      title: 'menus.messages.title',
    },
    name: 'Messages',
    path: '/messages',
  },
];
