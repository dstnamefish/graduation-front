/**
 * 认证相关API调用
 */

import request from '@/shared/lib/utils/http';
import {
  AuthForm,
  AuthUpdatePasswordForm,
  AuthSendCodeForm,
  AuthResetPasswordForm,
  TokenInfo,
  Captcha
} from './types';

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns 令牌信息
 */
export function login(data: AuthForm) {
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
 * 获取图形验证码
 * @returns 验证码信息
 */
export function getCaptcha() {
  return request.get<Captcha>({
    url: '/auth/captcha'
  });
}

/**
 * 修改个人密码
 * @param data 修改密码表单数据
 * @returns 空响应，表示修改成功
 */
export function updatePassword(data: AuthUpdatePasswordForm) {
  return request.post<void>({
    data,
    url: '/auth/password/update'
  });
}

/**
 * 发送验证码
 * @param data 发送验证码表单数据
 * @returns 空响应，表示发送成功
 */
export function sendVerificationCode(data: AuthSendCodeForm) {
  return request.post<void>({
    data,
    url: '/auth/password/send-code'
  });
}

/**
 * 重置密码
 * @param data 重置密码表单数据
 * @returns 空响应，表示重置成功
 */
export function resetPassword(data: AuthResetPasswordForm) {
  return request.post<void>({
    data,
    url: '/auth/password/reset'
  });
}
