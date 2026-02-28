/**
 * 患者模块类型定义
 * @module types/api/patient.types
 */

import type { PaginationParams, PaginatedResponse, CommonStatus } from './common.types';

/** 患者 - 请求参数 */
export interface CreatePatientRequest {
  homeAddress?: string;
  patientNo: string;
  status?: number;
  userId: number;
}

/** 患者 - 更新请求 */
export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: number;
}

/** 患者 - 查询参数 */
export interface GetPatientParams extends Partial<PaginationParams> {
  patientNo?: string;
  status?: CommonStatus;
}

/** 患者 - 响应数据 */
export interface PatientResponse {
  id: number;
  homeAddress?: string;
  patientNo: string;
  status: number;
  userId: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
  // 关联用户信息
  nickName?: string;
  avatar?: string;
  gender?: number;
  birthday?: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

/** 患者 - 分页列表 */
export type PatientListResponse = PaginatedResponse<PatientResponse>;
