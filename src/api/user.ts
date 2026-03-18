/**
 * 用户模块API调用
 * @module api/user
 * @description 提供用户管理相关的所有API接口，包括登录、登出、用户信息查询等功能
 */

import request from '@/utils/http';
import { LoginForm, User, TokenInfo } from './types';

/**
 * 用户登录
 * @description 用于用户身份验证，验证成功后返回令牌信息，用于后续请求的身份认证
 * @param data 登录表单数据，包含用户名、密码、验证码等信息
 * @returns 返回令牌信息，包含accessToken、refreshToken、过期时间等
 */
export function login(data: LoginForm) {
  return request.post<TokenInfo>({
    data,
    url: '/auth/login',
  });
}

/**
 * 用户登出
 * @description 用于用户退出登录，清除服务端的登录状态和令牌信息
 * @returns 无返回内容，表示登出成功
 */
export function logout() {
  return request.post<void>({
    url: '/auth/logout',
  });
}

/**
 * 获取当前登录用户信息
 * @description 用于获取当前登录用户的详细信息，包括个人资料、权限等
 * @returns 返回当前登录用户的详细信息，包含用户ID、用户名、头像、角色、权限等
 */
export function getCurrentUser() {
  return request.get<User>({
    url: '/users/me',
  });
}

/**
 * 获取用户详情
 * @description 用于用户管理页面的用户详情查看，获取指定用户的完整信息
 * @param id 用户ID，用于查询指定用户的详细信息
 * @returns 返回用户详情，包含基本信息、角色信息、权限列表等
 */
export function getUserDetail(id: number) {
  return request.get<User>({
    url: `/users/detail/${id}`,
  });
}
