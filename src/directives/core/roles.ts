/**
 * 角色指令模块
 *
 * 提供基于角色的元素显示/隐藏控制
 *
 * ## 主要功能
 *
 * - 角色验证指令 v-role
 * - 支持单角色验证
 * - 支持角色数组验证（满足任一即可）
 * - 自动移除无权限元素
 *
 * ## 使用方式
 *
 * ```vue
 * <!-- 单角色验证 -->
 * <button v-role="'doctor'">医生专属功能</button>
 *
 * <!-- 多角色验证（满足任一即可） -->
 * <button v-role="['doctor', 'department_admin']">医疗人员功能</button>
 * ```
 *
 * ## 后端角色代码
 * - super_admin: 超级管理员 - 具有所有权限，负责系统整体管理和配置
 * - department_admin: 科室管理员 - 负责本科室的日常运营、医生管理和部分数据统计
 * - doctor: 医生 - 为患者提供诊疗服务，包括门诊、住院等各类医疗服务
 * - patient: 患者 - 服务的接受者，也是其个人健康数据的主体
 *
 * @module directives/core/roles
 * @author 16518
 */

import type { Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/types/api/user.model';

/**
 * 系统角色枚举
 * 与后端 sys_role 表中的 code 字段保持一致
 */
export enum RoleCode {
  SUPER_ADMIN = 'super_admin',
  DEPARTMENT_ADMIN = 'department_admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

/**
 * 角色层级定义
 * 数值越大权限越高
 */
export const RoleLevel: Record<string, number> = {
  [RoleCode.PATIENT]: 1,
  [RoleCode.DOCTOR]: 2,
  [RoleCode.DEPARTMENT_ADMIN]: 3,
  [RoleCode.SUPER_ADMIN]: 4,
};

/**
 * 检查用户是否拥有指定角色
 * @param value 角色代码或角色数组
 * @returns 是否拥有角色
 */
function checkRole(value: string | string[]): boolean {
  const userStore = useUserStore();
  const userRoleCode = userStore.getUserRoleCode;

  if (!userRoleCode) {
    return false;
  }

  if (typeof value === 'string') {
    return userRoleCode === value;
  }

  if (Array.isArray(value)) {
    return value.includes(userRoleCode);
  }

  return false;
}

/**
 * 检查用户角色层级是否达到指定级别
 * @param minLevel 最低角色层级
 * @returns 是否达到层级要求
 */
function checkRoleLevel(minLevel: number): boolean {
  const userStore = useUserStore();
  const userRoleCode = userStore.getUserRoleCode;

  if (!userRoleCode) {
    return false;
  }

  const userLevel = RoleLevel[userRoleCode] || 0;
  return userLevel >= minLevel;
}

/**
 * 角色指令
 * 根据用户角色控制元素的显示与隐藏
 * 无权限时自动移除DOM元素
 *
 * @example
 * <!-- 只有医生可见 -->
 * <div v-role="'doctor'">医生专属内容</div>
 *
 * <!-- 医生或科室管理员可见 -->
 * <div v-role="['doctor', 'department_admin']">医疗人员内容</div>
 */
export const roleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const value = binding.value;

    if (!value) {
      return;
    }

    const hasRole = checkRole(value);

    if (!hasRole) {
      el.parentNode?.removeChild(el);
    }
  },
};

/**
 * 角色层级指令
 * 根据用户角色层级控制元素的显示与隐藏
 * 层级达到或超过指定级别的用户可见
 *
 * @example
 * <!-- 医生及以上级别可见（医生、科室管理员、超级管理员） -->
 * <div v-role-level="RoleLevel.doctor">医疗人员内容</div>
 *
 * <!-- 科室管理员及以上级别可见 -->
 * <div v-role-level="RoleLevel.department_admin">管理内容</div>
 */
export const roleLevelDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<number>) {
    const minLevel = binding.value;

    if (typeof minLevel !== 'number') {
      return;
    }

    const hasLevel = checkRoleLevel(minLevel);

    if (!hasLevel) {
      el.parentNode?.removeChild(el);
    }
  },
};

/**
 * 非角色指令
 * 当用户不拥有指定角色时显示元素
 *
 * @example
 * <!-- 非患者可见 -->
 * <div v-not-role="'patient'">非患者内容</div>
 */
export const notRoleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const value = binding.value;

    if (!value) {
      return;
    }

    const hasRole = checkRole(value);

    if (hasRole) {
      el.parentNode?.removeChild(el);
    }
  },
};

export default roleDirective;
