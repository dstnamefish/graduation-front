/**
 * 用户实体API调用
 */

import request from '@/shared/lib/utils/http';
import {
  LoginForm,
  User,
  TokenInfo
} from './types';

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns 令牌信息
 */
export function login(data: LoginForm) {
  return request.post<TokenInfo>({
    data,
    url: '/auth/login'
  });
}

/**
 * 用户登出
 * @returns 空响应，表示登出成功
 */
export function logout() {
  return request.post<void>({
    url: '/auth/logout'
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
 * 获取用户详情
 * @param id 用户ID
 * @returns 用户详情（包含角色信息）
 */
export function getUserDetail(id: number) {
  return request.get<User>({
    url: `/users/detail/${id}`
  });
}
