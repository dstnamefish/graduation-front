import request from '@/shared/lib/utils/http';

import type {
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
} from '@/features/auth/types';

/**
 * fetch create update remove 操作
 * GET → Read (读取)
 * POST → Create (创建)
 * PUT/PATCH → Update (更新)
 * DELETE → Delete (删除)
 */

/**
 * 认证API
 */

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: LoginParams) {
  return request.post<LoginResponse>({
    params,
    showErrorMessage: true,
    showSuccessMessage: false,
    url: '/auth/login',
  });
}

/**
 * 退出登录
 * @returns 响应
 */
export function fetchLogout() {
  return request.post({
    url: '/auth/logout',
    showErrorMessage: true,
    showSuccessMessage: false,
  });
}

/**
 * 注册
 * @param params 注册参数
 * @returns 注册响应
 */
export function fetchRegister(params: RegisterParams) {
  return request.post<RegisterResponse>({
    params,
    showErrorMessage: true,
    showSuccessMessage: true,
    url: '/auth/register',
  });
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export function fetchProfile() {
  return request.get({
    url: '/auth/profile',
    showErrorMessage: true,
    showSuccessMessage: false,
  });
}

/**
 * 刷新令牌
 * @param refreshToken 刷新令牌
 * @returns 新的访问令牌
 */
export function fetchRefreshToken(refreshToken: string) {
  return request.post({
    params: { refreshToken },
    showErrorMessage: true,
    showSuccessMessage: false,
    url: '/auth/refresh-token',
  });
}
