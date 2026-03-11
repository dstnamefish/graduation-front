/**
 * 医生模块类型定义
 * @module types/api/core/doctor
 */

import type { PaginationParams, CommonStatus, PaginatedResponse } from '@/shared/types/common';

/** 医生 - 请求参数 */
export interface CreateDoctorParams {
  bio?: string;
  doctorNo: string;
  status?: number;
  userId: number;
  departmentId: number;
}

/** 医生 - 更新请求参数 */
export interface UpdateDoctorParams extends Partial<CreateDoctorParams> {
  id: number;
}

/** 医生 - 查询参数 */
export interface GetDoctorParams extends Partial<PaginationParams> {
  doctorNo?: string;
  departmentId?: number;
  status?: CommonStatus;
  query?: string;
}

/** 医生 - 响应数据 */
export interface DoctorResponse {
  id: number;
  bio?: string;
  doctorNo: string;
  status: number;
  userId: number;
  departmentId: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
  // 关联用户信息
  nickName?: string;
  avatar?: string;
  gender?: number;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  // 关联科室信息
  departmentName?: string;
}

/** 医生 - 分页列表 */
export type DoctorListResponse = PaginatedResponse<DoctorResponse>;

/** 医生 - 列表项 (UI 适配) */
export interface DoctorItem extends DoctorResponse {
  // 某些 UI 组件可能需要的额外字段
  specialty?: string;
}
