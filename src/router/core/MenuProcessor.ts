/**
 * 菜单处理器
 *
 * 负责菜单数据的获取、过滤和处理
 *
 * @module router/core/MenuProcessor
 * @author 16518
 */

import { useUserStore } from '@/entities/user/model';

import { fetchUserRoutes, type RouteVO } from '@/features/system/api.menu';
import { useAppMode } from '@/shared/lib/hooks';
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
    const list = await fetchUserRoutes();
    return this.filterEmptyMenus(this.mapRouteVOToAppRouteRecord(list));
  }

  private mapRouteVOToAppRouteRecord(routes: RouteVO[]): AppRouteRecord[] {
    return routes.map((route) => {
      const record: AppRouteRecord = {
        name: route.name,
        path: route.path,
        component: route.component,
        redirect: route.redirect,
        meta: {
          ...route.meta, // 核心修改：透传后端返回的所有 meta 属性
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
        // 如果有子菜单，先递归过滤子菜单
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
        // 如果定义了 children 属性（即使是空数组），说明这是一个目录菜单，应该保留
        if ('children' in item) {
          return true;
        }

        // 如果有外链或 iframe，保留
        if (item.meta?.isIframe === true || item.meta?.link) {
          return true;
        }

        // 如果有有效的 component，保留
        if (item.component && item.component !== '' && item.component !== RoutesAlias.Layout) {
          return true;
        }

        // 其他情况过滤掉
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
   * 将相对路径转换为完整路径，确保菜单跳转正确
   */
  private normalizeMenuPaths(menuList: AppRouteRecord[], parentPath = ''): AppRouteRecord[] {
    return menuList.map((item) => {
      // 构建完整路径
      const fullPath = this.buildFullPath(item.path || '', parentPath);

      // 递归处理子菜单
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

    // 外部链接直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // 如果已经是绝对路径，直接返回
    if (path.startsWith('/')) {
      return path;
    }

    // 拼接父路径和当前路径
    if (parentPath) {
      // 移除父路径末尾的斜杠，移除子路径开头的斜杠，然后拼接
      const cleanParent = parentPath.replace(/\/$/, '');
      const cleanChild = path.replace(/^\//, '');
      return `${cleanParent}/${cleanChild}`;
    }

    // 没有父路径，添加前导斜杠
    return `/${path}`;
  }
}
