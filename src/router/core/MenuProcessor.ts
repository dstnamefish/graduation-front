/**
 * 菜单处理器
 *
 * 负责菜单数据的获取、过滤和处理
 *
 * @module router/core/MenuProcessor
 * @author 16518
 */

import { useUserStore } from '@/types/api/user.model';
import * as MenuApi from '@/api/menu';
import { useAppMode } from '@/hooks/core/useAppMode';
import { asyncRoutes } from '../routes/asyncRoutes';
import { RoutesAlias } from '../routesAlias';
import type { AppRouteRecord } from '@/types/router';

export class MenuProcessor {
  /**
   * 获取菜单数据
   */
  async getMenuList(): Promise<AppRouteRecord[]> {
    const { isFrontendMode } = useAppMode();

    let menuList: AppRouteRecord[];
    if (isFrontendMode.value) {
      menuList = await this.processFrontendMenu();
    } else {
      menuList = await this.processBackendMenu();
    }

    // 规范化路径（将相对路径转换为完整路径）
    return this.normalizeMenuPaths(menuList);
  }

  /**
   * 处理前端控制模式的菜单
   */
  private async processFrontendMenu(): Promise<AppRouteRecord[]> {
    const userStore = useUserStore();
    const roleCode = userStore.info?.role?.code;

    let menuList = [...asyncRoutes];

    // 根据角色过滤菜单
    if (roleCode && roleCode.length > 0) {
      menuList = this.filterMenuByRoles(menuList, [roleCode]);
    }

    return this.filterEmptyMenus(menuList);
  }

  /**
   * 处理后端控制模式的菜单
   */
  private async processBackendMenu(): Promise<AppRouteRecord[]> {
    const list = await MenuApi.getRouteMenus();
    return this.filterEmptyMenus(this.mapRouteVOToAppRouteRecord(list));
  }

  private mapRouteVOToAppRouteRecord(routes: any[]): AppRouteRecord[] {
    return routes.map((route) => {
      const record: AppRouteRecord = {
        name: route.name,
        path: route.path,
        component: route.component,
        redirect: route.redirect,
        meta: {
          ...route.meta,
          title: route.meta.title,
          icon: route.meta.icon,
          isHide: route.meta.hidden,
          activePath: route.meta.activeMenu,
          keepAlive: !route.meta.noCache,
          roles: route.meta.roles,
        },
      };

      if (route.children && route.children.length > 0) {
        record.children = this.mapRouteVOToAppRouteRecord(route.children);
      }

      return record;
    });
  }

  /**
   * 根据角色过滤菜单
   */
  private filterMenuByRoles(menu: AppRouteRecord[], roles: string[]): AppRouteRecord[] {
    return menu.reduce((acc: AppRouteRecord[], item) => {
      const itemRoles = item.meta?.roles;
      const hasPermission = !itemRoles || itemRoles.some((role) => roles?.includes(role));

      if (hasPermission) {
        const filteredItem = { ...item };
        if (filteredItem.children?.length) {
          filteredItem.children = this.filterMenuByRoles(filteredItem.children, roles);
        }
        acc.push(filteredItem);
      }

      return acc;
    }, []);
  }

  /**
   * 递归过滤空菜单项
   */
  private filterEmptyMenus(menuList: AppRouteRecord[]): AppRouteRecord[] {
    return menuList
      .map((item) => {
        if (item.children && item.children.length > 0) {
          const filteredChildren = this.filterEmptyMenus(item.children);
          return {
            ...item,
            children: filteredChildren,
          };
        }
        return item;
      })
      .filter((item) => {
        if (item.children && item.children.length > 0) {
          return true;
        }

        if (item.meta?.isIframe === true || item.meta?.link) {
          return true;
        }

        if (item.component && item.component !== '' && item.component !== RoutesAlias.Layout) {
          return true;
        }

        return false;
      });
  }

  /**
   * 验证菜单列表是否有效
   */
  validateMenuList(menuList: AppRouteRecord[]): boolean {
    return Array.isArray(menuList) && menuList.length > 0;
  }

  /**
   * 规范化菜单路径
   */
  private normalizeMenuPaths(menuList: AppRouteRecord[], parentPath = ''): AppRouteRecord[] {
    return menuList.map((item) => {
      const fullPath = this.buildFullPath(item.path || '', parentPath);

      const children = item.children?.length
        ? this.normalizeMenuPaths(item.children, fullPath)
        : item.children;

      return {
        ...item,
        children,
        path: fullPath,
      };
    });
  }

  /**
   * 构建完整路径
   */
  private buildFullPath(path: string, parentPath: string): string {
    if (!path) {
      return '';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    if (path.startsWith('/')) {
      return path;
    }

    if (parentPath) {
      const cleanParent = parentPath.replace(/\/$/, '');
      const cleanChild = path.replace(/^\//, '');
      return `${cleanParent}/${cleanChild}`;
    }

    return `/${path}`;
  }
}
