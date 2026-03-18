/**
 * 菜单权限模块API调用
 * @module api/menu
 * @description 提供菜单权限管理相关的所有API接口，包括动态路由获取、菜单树查询、菜单详情等功能
 */

import request from '@/utils/http';
import { Route, Menu } from './types';

/**
 * 获取当前登录用户的动态路由树
 * @description 用于系统初始化时获取用户可访问的路由配置，根据用户权限动态生成菜单
 * @returns 返回动态路由树列表，每个路由包含路径、名称、组件、图标、子路由等信息
 */
export function getRouteMenus() {
  return request.get<Route[]>({
    url: 'rbac/menu/routes',
  });
}

/**
 * 获取系统全量菜单树
 * @description 用于权限管理或菜单配置页面，获取系统中所有菜单（不受权限限制）
 * @returns 返回系统菜单树列表，每个菜单包含ID、名称、路径、图标、排序、子菜单等信息
 */
export function getMenuTree() {
  return request.get<Menu[]>({
    url: 'rbac/menu/tree',
  });
}

/**
 * 根据ID获取菜单详情
 * @description 用于菜单编辑或查看，获取指定菜单的完整配置信息
 * @param id 菜单ID，用于查询指定菜单的详细信息
 * @returns 返回菜单详情，包含名称、路径、图标、权限标识、排序等配置信息
 */
export function getMenuById(id: number) {
  return request.get<Menu>({
    params: { id },
    url: 'rbac/menu/detail',
  });
}
