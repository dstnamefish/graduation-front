/**
 * 认证相关API调用
 * @module api/auth
 * @description 提供用户认证相关的所有API接口，包括登录、登出、验证码获取、密码重置等功能
 */

import request from '@/utils/http';
import {
  AuthForm,
  AuthUpdatePasswordForm,
  AuthSendCodeForm,
  AuthRes,
} from '@/types/auth';

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns 令牌信息
 */
export function login(data: AuthForm) {
  return request.post<TokenInfo>({
    data,
    url: '/auth/login',
  });
}

/**
 * 用户登出
 * @returns 空响应，表示登出成功
 */
export function logout() {
  return request.post<void>({
    url: '/auth/logout',
  });
}

/** 兼容性导出 */
export const fetchLogout = logout;

/**
 * 获取图形验证码
 * @returns 验证码信息
 */
export function getCaptcha() {
  return request.get<Captcha>({
    url: '/auth/captcha',
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
    url: '/auth/password/send-code',
  });
}

/**
 * 重置密码
 * @param data 重置密码表单数据，包含用户标识、验证码、新密码等
 * @returns 空响应，表示重置成功
 */
export function resetPassword(data: AuthResetPasswordForm) {
  return request.post<void>({
    data,
    url: '/auth/password/reset',
  });
}

/**
 * 用户注册
 * @param data 注册表单数据
 * @returns 空响应，表示注册成功
 */
export function fetchRegister(data: any) {
  return request.post<void>({
    data,
    url: '/auth/register',
  });
}