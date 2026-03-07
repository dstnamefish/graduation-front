/**
 * 科室模块类型定义
 * @module types/api/core/department
 */

import type { PaginationParams, PaginatedResponse, CommonStatus } from './common';

// ==================== 科室 ====================

/** 科室 - 请求参数 */
export interface CreateDepartmentParams {
  name: string;
  description?: string;
  avatar?: string;
  phone?: string;
  status?: number;
}

/** 科室 - 更新请求参数 */
export interface UpdateDepartmentParams extends Partial<CreateDepartmentParams> {
  id: number;
}

/** 科室 - 查询参数 */
export interface GetDepartmentParams extends Partial<PaginationParams> {
  name?: string;
  status?: CommonStatus;
}

/** 科室 - 响应数据 */
export interface DepartmentResponse {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  phone?: string;
  status: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
}

/** 科室 - 分页列表 */
export type DepartmentListResponse = PaginatedResponse<DepartmentResponse>;

// ==================== 专业领域 ====================

/** 专业领域 - 请求参数 */
export interface CreateSpecialtyParams {
  name: string;
  description?: string;
  status?: number;
}

/** 专业领域 - 更新请求参数 */
export interface UpdateSpecialtyParams extends Partial<CreateSpecialtyParams> {
  id: number;
}

/** 专业领域 - 查询参数 */
export interface GetSpecialtyParams extends Partial<PaginationParams> {
  name?: string;
  status?: CommonStatus;
}

/** 专业领域 - 响应数据 */
export interface SpecialtyResponse {
  id: number;
  name: string;
  description?: string;
  status: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
}

/** 专业领域 - 分页列表 */
export type SpecialtyListResponse = PaginatedResponse<SpecialtyResponse>;
