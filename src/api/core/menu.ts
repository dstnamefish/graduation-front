import request from '@/utils/http';

/**
 * 菜单API
 */

/**
 * 菜单VO接口
 */
export interface MenuVO {
  id: number;
  parentId: number | null;
  path: string;
  component: string;
  name: string;
  title: string;
  icon: string;
  hidden: boolean;
  redirect?: string;
  alwaysShow?: boolean;
  noCache?: boolean;
  breadcrumb?: boolean;
  activeMenu?: string;
  seq: number;
  children?: MenuVO[];
}

/**
 * 路由VO接口
 */
export interface RouteVO {
  children?: RouteVO[];
  component: string;
  meta: {
    activeMenu?: string;
    alwaysShow?: boolean;
    breadcrumb?: boolean;
    hidden: boolean;
    icon: string;
    noCache?: boolean;
    title: string;
  };
  name: string;
  path: string;
  redirect?: string;
}

/**
 * 获取用户路由菜单
 * @returns 路由菜单列表
 */
export function fetchUserRoutes() {
  return request.get<RouteVO[]>({
    url: '/rbac/menu/route',
  });
}

/**
 * 获取菜单树
 * @returns 菜单树
 */
export function fetchMenuTree() {
  return request.get<MenuVO[]>({
    url: '/rbac/menu/tree',
  });
}

/**
 * 获取菜单详情
 * @param id 菜单ID
 * @returns 菜单详情
 */
export function fetchMenuById(id: number) {
  return request.get<MenuVO>({
    params: { id },
    url: '/rbac/menu',
  });
}