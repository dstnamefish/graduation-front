/**
 * 菜单实体类型定义
 */

/**
 * 路由元信息
 * @description 路由的元数据信息，用于权限控制和菜单显示
 * @property {string} title - 菜单标题
 * @property {string} icon - 菜单图标
 * @property {string} roles - 角色权限
 * @property {boolean} hidden - 是否隐藏
 * @property {string} activeMenu - 激活菜单
 * @property {boolean} alwaysShow - 是否总是显示
 * @property {string} breadcrumb - 面包屑
 */
export interface RouteMeta {
  title: string;
  icon: string;
  roles: string[];
  hidden: boolean;
  activeMenu: string;
  alwaysShow: boolean;
  breadcrumb: string;
}

/**
 * 路由信息
 * @description 前端路由配置信息
 * @property {string} path - 路由路径
 * @property {string} component - 组件路径
 * @property {string} name - 路由名称
 * @property {RouteMeta} meta - 路由元信息
 * @property {Array<Route>} children - 子路由
 * @property {string} redirect - 重定向路径
 */
export interface Route {
  path: string;
  component: string;
  name: string;
  meta: RouteMeta;
  children: Route[];
  redirect: string;
}

/**
 * 菜单信息
 * @description 菜单管理中的菜单信息
 * @property {number} id - 菜单ID
 * @property {string} menuName - 菜单名称
 * @property {string} path - 菜单路径
 * @property {string} component - 组件路径
 * @property {string} icon - 菜单图标
 * @property {number} parentId - 父菜单ID
 * @property {number} orderNum - 排序号
 * @property {string} menuType - 菜单类型：M-菜单，C-按钮
 * @property {string} permission - 权限标识
 * @property {number} status - 状态：1-启用，0-禁用
 * @property {Array<Menu>} children - 子菜单
 */
export interface Menu {
  id: number;
  menuName: string;
  path: string;
  component: string;
  icon: string;
  parentId: number;
  orderNum: number;
  menuType: string;
  permission: string;
  status: number;
  children: Menu[];
}

/**
 * 路由列表响应
 * @description 获取动态路由树的响应数据
 * @property {Array<Route>} data - 路由列表
 */
export interface RouteListResponse {
  data: Route[];
}

/**
 * 菜单树响应
 * @description 获取系统菜单树的响应数据
 * @property {Array<Menu>} data - 菜单树
 */
export interface MenuTreeResponse {
  data: Menu[];
}

/**
 * 菜单详情响应
 * @description 获取菜单详情的响应数据
 * @property {Menu} data - 菜单详情
 */
export interface MenuDetailResponse {
  data: Menu;
}
