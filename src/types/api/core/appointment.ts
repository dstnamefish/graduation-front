/**
 * 预约模块类型定义 - 更新版
 * @module types/api/core/appointment
 */

import type { PaginationParams, PaginatedResponse } from './common';

// ==================== 枚举类型 ====================

/** 预约状态 */
export enum AppointmentStatus {
  DELETED = -1, // 已删除
  PENDING = 1, // 待就诊
  COMPLETED = 2, // 已完成
  CANCELLED = 3, // 已取消
  NO_SHOW = 4, // 已爽约
  IN_PROGRESS = 5, // 就诊中
  OVERDUE = 6, // 过号
}

/** 签到状态 */
export enum CheckInStatus {
  NOT_CHECKED = 0, // 未签到
  CHECKED = 1, // 已签到
}

/** 叫号状态 */
export enum CallStatus {
  NOT_CALLED = 0, // 未叫号
  CALLED = 1, // 已叫号
  OVERDUE = 2, // 过号
}

/** 预约来源 */
export enum AppointmentSource {
  OFFLINE = 0, // 线下
  ONLINE = 1, // 线上
  PHONE = 2, // 电话
}

// ==================== 请求/响应类型 ====================

/** 预约 - 创建请求参数 */
export interface CreateAppointmentParams {
  appointmentDate: string;
  appointmentTime: string;
  appointmentNumber?: string;
  status?: number;
  cancelReason?: string;
  remark?: string;
  patientId: number;
  doctorId: number;
  departmentId: number;
  appointmentSource?: number;
  isOvertime?: boolean;
}

/** 预约 - 更新请求参数 */
export interface UpdateAppointmentParams extends Partial<CreateAppointmentParams> {
  id: number;
}

/** 预约 - 查询参数（增强版，支持多条件筛选） */
export interface GetAppointmentParams extends Partial<PaginationParams> {
  patientId?: number;
  doctorId?: number;
  departmentId?: number;
  status?: AppointmentStatus;
  statusList?: AppointmentStatus[];
  checkInStatus?: CheckInStatus;
  callStatus?: CallStatus;
  appointmentSource?: AppointmentSource;
  appointmentDate?: string;
  appointmentDateStart?: string;
  appointmentDateEnd?: string;
  keyword?: string;
  isOvertime?: boolean;
}

/** 预约 - 取消参数 */
export interface CancelAppointmentParams {
  cancelReason?: string;
}

/** 预约 - 响应数据（增强版，包含完整关联信息） */
export interface AppointmentResponse {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentNumber?: string;
  status: AppointmentStatus;
  cancelReason?: string;
  checkInStatus?: CheckInStatus;
  checkInTime?: string;
  finishTime?: string;
  remark?: string;
  callTime?: string;
  callStatus?: CallStatus;
  actualStartTime?: string;
  patientId?: number;
  doctorId?: number;
  departmentId?: number;
  appointmentSource?: AppointmentSource;
  isOvertime?: boolean;
  tenantId?: number;
  createdTime?: string;
  updatedTime?: string;
  // 患者关联信息
  patientName?: string;
  patientAvatar?: string;
  patientPhone?: string;
  patientGender?: number;
  // 医生关联信息
  doctorName?: string;
  doctorAvatar?: string;
  doctorNo?: string;
  doctorBio?: string;
  // 科室关联信息
  departmentName?: string;
  departmentAvatar?: string;
  departmentPhone?: string;
}

/** 预约 - 分页列表 */
export type AppointmentListResponse = PaginatedResponse<AppointmentResponse>;

/** 预约 - 统计数据（用于仪表盘） */
export interface AppointmentStatsResponse {
  totalAppointments: number;
  todayAppointments: number;
  pendingCount: number;
  completedCount: number;
  cancelledCount: number;
  checkedInCount: number;
  overdueCount: number;
  noShowCount: number;
  weekAppointments: number;
  monthAppointments: number;
  dailyGrowthRate?: number;
  weeklyGrowthRate?: number;
}

/** 预约 - 按状态统计 */
export interface AppointmentStatusCount {
  status: AppointmentStatus;
  count: number;
}

/** 预约 - 按日期统计 */
export interface AppointmentDateCount {
  date: string;
  total: number;
  completed: number;
  cancelled: number;
}

/** 预约 - 按科室统计 */
export interface AppointmentDepartmentCount {
  departmentId: number;
  departmentName: string;
  count: number;
  todayCount: number;
}

/** 预约 - 按医生统计当天预约 */
export interface AppointmentDoctorCount {
  doctorId: number;
  doctorName: string;
  doctorAvatar: string;
  departmentName: string;
  totalCount: number;
  completedCount: number;
  checkedInCount: number;
}
