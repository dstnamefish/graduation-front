import request from '@/utils/http';

/**
 * 获取角色列表（分页或全量）
 */
export function getRoleList(params?: any) {
  // 根据实际后端 Controller 映射
  return request.get({
    url: '/rbac/role/page', // 或 /rbac/role/list
    params,
  });
}

/**
 * 获取全量菜单与按钮树
 */
export function getMenuTree() {
  return request.get({
    url: '/rbac/menu/tree',
  });
}

/**
 * 查询某个角色当前已拥有的菜单/权限 ID 列表
 */
export function getRoleMenuIds(roleId: number) {
  return request.get<number[]>({
    url: `/rbac/role/${roleId}/menu-ids`,
  });
}

/**
 * 更新角色的权限（重新分配菜单与权限按钮）
 */
export function updateRolePermissions(roleId: number, menuIds: number[]) {
  return request.post({
    url: `/rbac/role/${roleId}/permissions`,
    data: menuIds,
  });
}
