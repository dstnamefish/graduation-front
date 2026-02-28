import { AppRouteRecord } from '@/types/router';

/**
 * Inventory (库存管理) 路由配置
 */
export const inventoryRoutes: AppRouteRecord[] = [
  {
    component: '/inventory',
    meta: {
      icon: 'local-menu/inventory',
      keepAlive: false,
      roles: ['ADMIN'],
      title: 'menus.inventory.title',
    },
    name: 'Inventory',
    path: '/inventory',
  },
];
