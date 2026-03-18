/**
 * API核心类型定义
 * @module types/api/core
 * @description 提供API请求和响应的核心类型定义，包括分页、响应包装等
 */

/** 分页请求参数 */
export interface PaginationParams {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
}

/** 排序参数 */
export interface SortParams {
  /** 排序字段 */
  sortBy?: string;
  /** 排序方式：升序或降序 */
  sortOrder?: 'asc' | 'desc';
}

/** 分页响应（同步后端 PageVO） */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  list: T[];
  /** 总记录数 */
  total: number;
  /** 每页条数 */
  size: number;
  /** 当前页码 */
  current: number;
}

/** API错误信息 */
export interface ApiError {
  /** 错误码 */
  code: string | number;
  /** 错误消息 */
  message: string;
  /** 错误详情 */
  details?: Record<string, any>;
}

/** API响应包装器 */
export interface ApiWrapper<T = any> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: ApiError;
  /** 状态码 */
  code?: number;
  /** 消息 */
  message?: string;
}

/** 可空类型 */
export type Nullable<T> = T | null;

/** 可选类型 */
export type Optional<T> = T | undefined;

/** 可能为空 */
export type Maybe<T> = T | null | undefined;

/** 通用状态：-1删除，0禁用，1启用 */
export type CommonStatus = -1 | 0 | 1;

/** 启用状态：0禁用，1启用 */
export type EnableStatus = 0 | 1;
