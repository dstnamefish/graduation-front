import { AppRouteRecord } from '@/types/router';

/**
 * Messages (消息中心) 路由配置
 */
export const messagesRoutes: AppRouteRecord[] = [
  {
    component: '/messages',
    meta: {
      icon: 'local-business/messages',
      keepAlive: false,
      roles: ['ADMIN'],
      title: 'menus.messages.title',
    },
    name: 'Messages',
    path: '/messages',
  },
];
