/**
 * 排班模块类型定义
 * @module types/api/core/schedule
 */


/** 排班状态 */
export enum ScheduleStatus {
  DELETED = -1,  // 已删除
  STOPPED = 0,   // 停诊
  NORMAL = 1,    // 正常
  EXPERT = 2,    // 专家门诊
}

/** 排班 - 请求参数 */
export interface CreateScheduleParams {
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  status?: number;
  maxAppointments?: number;
  doctorId: number;
}

/** 排班 - 更新请求参数 */
export interface UpdateScheduleParams extends Partial<CreateScheduleParams> {
  id: number;
}

/** 排班 - 查询参数 */
export interface GetScheduleParams extends Partial<PaginationParams> {
  doctorId?: number;
  status?: ScheduleStatus;
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
}

/** 排班 - 响应数据 */
export interface ScheduleResponse {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  status: ScheduleStatus;
  maxAppointments: number;
  doctorId: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
  // 关联信息
  doctorName?: string;
}

/** 排班 - 分页列表 */
export type ScheduleListResponse = PaginatedResponse<ScheduleResponse>;
