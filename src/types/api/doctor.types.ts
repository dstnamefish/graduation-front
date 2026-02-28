/**
 * 医生模块类型定义
 * @module types/api/doctor.types
 */

import type { PaginationParams, PaginatedResponse, CommonStatus } from './common.types';

/** 医生 - 请求参数 */
export interface CreateDoctorRequest {
  bio?: string;
  doctorNo: string;
  status?: number;
  userId: number;
  departmentId: number;
}

/** 医生 - 更新请求 */
export interface UpdateDoctorRequest extends Partial<CreateDoctorRequest> {
  id: number;
}

/** 医生 - 查询参数 */
export interface GetDoctorParams extends Partial<PaginationParams> {
  doctorNo?: string;
  departmentId?: number;
  status?: CommonStatus;
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
  // 关联科室信息
  departmentName?: string;
}

/** 医生 - 分页列表 */
export type DoctorListResponse = PaginatedResponse<DoctorResponse>;

/** 医生 - 列表项 (Mock 数据) */
export interface DoctorItem {
  id: number;
  name: string;
  doctorCode: string;
  departmentName: string;
  specialty: string;
  totalPatients: number;
  todayAppointments: number;
  availabilityStatus: 'Available' | 'Unavailable';
  avatar: string;
}
