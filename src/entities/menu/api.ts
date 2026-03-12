/**
 * 菜单实体API调用
 */

import request from '@/shared/lib/utils/http';
import {
  Route,
  Menu
} from './types';

/**
 * 获取当前登录用户的动态路由树
 * @returns 动态路由树列表
 */
export function getRouteMenus() {
  return request.get<Route[]>({
    url: '/rbac/menu/routes'
  });
}

/**
 * 获取系统全量菜单树
 * @returns 系统菜单树列表
 */
export function getMenuTree() {
  return request.get<Menu[]>({
    url: '/rbac/menu/tree'
  });
}

/**
 * 根据ID获取菜单详情
 * @param id 菜单ID
 * @returns 菜单详情
 */
export function getMenuById(id: number) {
  return request.get<Menu>({
    params: { id },
    url: '/rbac/menu/detail'
  });
}
