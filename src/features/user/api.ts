import request from '@/shared/lib/utils/http';
import { UserInfo } from '@/features/user/types';

/**
 * 用户
 */

/**
 * 获取用户信息
 * @returns 用户信息响应
 */
export function fetchUserInfo() {
  return request.get<UserInfo>({
    showErrorMessage: true,
    showSuccessMessage: true,
    url: '/user/info',
  });
}
