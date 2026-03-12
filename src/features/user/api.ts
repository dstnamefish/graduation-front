/**
 * 用户相关API调用
 */

import request from '@/shared/lib/utils/http';
import {
  UserForm,
  User
} from './types';

/**
 * 新增用户（用户注册）
 * @param data 用户注册表单数据
 * @returns 新增用户的ID
 */
export function createUser(data: UserForm) {
  return request.post<number>({
    data,
    url: '/users/add'
  });
}

/**
 * 获取用户详情
 * @param id 用户ID
 * @returns 用户详情（包含角色信息）
 */
export function getUserDetail(id: number) {
  return request.get<User>({
    url: `/users/detail/${id}`
  });
}

/**
 * 获取当前登录用户信息
 * @returns 当前登录用户的详细信息
 */
export function getCurrentUser() {
  return request.get<User>({
    url: '/users/me'
  });
}

/**
 * 为用户分配角色
 * @param userId 用户ID
 * @param roleIds 角色ID列表
 * @returns 操作结果
 */
export function assignRoles(userId: number, roleIds: number[]) {
  return request.post<boolean>({
    data: roleIds,
    url: `/users/${userId}/roles`
  });
}
