/**
 * 通用 API 类型定义
 * @module types/api/common.types
 */

// ==================== 分页相关 ====================

/** 分页请求参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 排序参数 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== API 响应相关 ====================

/** API 错误 */
export interface ApiError {
  code: string | number;
  message: string;
  details?: Record<string, any>;
}

/** API 响应包装器 */
export interface ApiWrapper<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  code?: number;
  message?: string;
}

// ==================== 工具类型 ====================

/** 可空类型 */
export type Nullable<T> = T | null;

/** 可选类型 */
export type Optional<T> = T | undefined;

/** 可能为空 */
export type Maybe<T> = T | null | undefined;

// ==================== 状态类型 ====================

/** 通用状态 */
export type CommonStatus = -1 | 0 | 1;

/** 启用状态 */
export type EnableStatus = 0 | 1;
