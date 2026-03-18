import { AppRouteRecord } from '@/types/router';

/**
 * Inventory (库存管理) 路由配置
 */
export const inventoryRoutes: AppRouteRecord[] = [
  {
    component: '/inventory',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'local-business/inventory',
      keepAlive: false,
      roles: ['ADMIN'],
      fixedHeight: true,
      title: 'menus.inventory.title',
    },
    name: 'Inventory',
    path: '/inventory',
  },
];
