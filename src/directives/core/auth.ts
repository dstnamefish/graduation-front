/**
 * 权限指令模块
 *
 * 提供基于权限的元素显示/隐藏控制
 *
 * ## 主要功能
 *
 * - 权限验证指令 v-auth
 * - 支持单权限验证
 * - 支持权限数组验证（满足任一即可）
 * - 自动移除无权限元素
 *
 * ## 使用方式
 *
 * ```vue
 * <!-- 单权限验证 -->
 * <button v-auth="'user:create'">创建用户</button>
 *
 * <!-- 多权限验证（满足任一即可） -->
 * <button v-auth="['user:create', 'user:edit']">操作</button>
 * ```
 *
 * ## 后端角色代码
 * - super_admin: 超级管理员
 * - department_admin: 科室管理员
 * - doctor: 医生
 * - patient: 患者
 *
 * @module directives/core/auth
 * @author 16518
 */

import type { Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/types/api/user.model';

/**
 * 检查用户是否拥有指定权限
 * @param value 权限标识或权限数组
 * @returns 是否拥有权限
 */
function checkAuth(value: string | string[]): boolean {
  const userStore = useUserStore();
  const permissions = userStore.permissions || [];

  if (typeof value === 'string') {
    return permissions.includes(value);
  }

  if (Array.isArray(value)) {
    return value.some((permission) => permissions.includes(permission));
  }

  return false;
}

/**
 * 权限指令
 * 根据用户权限控制元素的显示与隐藏
 * 无权限时自动移除DOM元素
 */
export const authDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const value = binding.value;

    if (!value) {
      return;
    }

    const hasAuth = checkAuth(value);

    if (!hasAuth) {
      el.parentNode?.removeChild(el);
    }
  },
};

/**
 * 权限角色指令
 * 根据用户角色控制元素的显示与隐藏
 * 无权限时自动移除DOM元素
 *
 * 支持的角色代码：
 * - super_admin: 超级管理员
 * - department_admin: 科室管理员
 * - doctor: 医生
 * - patient: 患者
 */
export const authRoleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const value = binding.value;

    if (!value) {
      return;
    }

    const userStore = useUserStore();
    const userRoleCode = userStore.getUserRoleCode;

    const roles = typeof value === 'string' ? [value] : value;
    const hasRole = roles.includes(userRoleCode || '');

    if (!hasRole) {
      el.parentNode?.removeChild(el);
    }
  },
};

export default authDirective;
