/**
 * 预约管理 API 服务 - 更新版
 * @module api/services/appointment.service
 */

import request from '@/utils/http';
import type {
  CreateAppointmentParams,
  UpdateAppointmentParams,
  GetAppointmentParams,
  CancelAppointmentParams,
  AppointmentResponse,
  AppointmentListResponse,
  AppointmentStatsResponse,
  AppointmentStatusCount,
  AppointmentDateCount,
  AppointmentDepartmentCount,
  AppointmentDoctorCount,
} from '@/types/api/core/appointment';

const BASE_URL = '/api/appointment';

class AppointmentService {
  // ==================== 查询接口 ====================

  /** 获取预约分页列表（含关联信息） */
  async fetchAppointments(params?: GetAppointmentParams): Promise<AppointmentListResponse> {
    return request.get<AppointmentListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 获取预约列表（不分页） */
  async fetchAllAppointments(params?: GetAppointmentParams): Promise<AppointmentResponse[]> {
    return request.get<AppointmentResponse[]>({
      url: `${BASE_URL}/list`,
      params,
    });
  }

  /** 获取预约详情（含关联信息） */
  async getAppointmentById(id: number): Promise<AppointmentResponse> {
    return request.get<AppointmentResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 根据患者获取预约列表 */
  async getAppointmentsByPatient(patientId: number): Promise<AppointmentResponse[]> {
    return request.get<AppointmentResponse[]>({
      url: `${BASE_URL}/patient/${patientId}`,
    });
  }

  /** 根据医生获取预约列表 */
  async getAppointmentsByDoctor(doctorId: number, appointmentDate?: string): Promise<AppointmentResponse[]> {
    return request.get<AppointmentResponse[]>({
      url: `${BASE_URL}/doctor/${doctorId}`,
      params: { appointmentDate },
    });
  }

  /** 获取当天待就诊列表 */
  async getTodayPending(doctorId?: number): Promise<AppointmentResponse[]> {
    return request.get<AppointmentResponse[]>({
      url: `${BASE_URL}/today/pending`,
      params: { doctorId },
    });
  }

  /** 获取当天已签到待叫号列表 */
  async getTodayCheckedIn(doctorId?: number): Promise<AppointmentResponse[]> {
    return request.get<AppointmentResponse[]>({
      url: `${BASE_URL}/today/checked-in`,
      params: { doctorId },
    });
  }

  /** 按日期范围查询预约（用于日历视图） */
  async getByDateRange(
    startDate: string,
    endDate: string,
    doctorId?: number,
    departmentId?: number
  ): Promise<AppointmentResponse[]> {
    return request.get<AppointmentResponse[]>({
      url: `${BASE_URL}/date-range`,
      params: { startDate, endDate, doctorId, departmentId },
    });
  }

  // ==================== 统计接口 ====================

  /** 获取预约统计（用于仪表盘） */
  async getStats(): Promise<AppointmentStatsResponse> {
    return request.get<AppointmentStatsResponse>({
      url: `${BASE_URL}/stats`,
    });
  }

  /** 按状态统计预约 */
  async countByStatus(): Promise<AppointmentStatusCount[]> {
    return request.get<AppointmentStatusCount[]>({
      url: `${BASE_URL}/stats/by-status`,
    });
  }

  /** 按日期统计预约（用于图表） */
  async countByDate(startDate: string, endDate: string): Promise<AppointmentDateCount[]> {
    return request.get<AppointmentDateCount[]>({
      url: `${BASE_URL}/stats/by-date`,
      params: { startDate, endDate },
    });
  }

  /** 按科室统计预约 */
  async countByDepartment(): Promise<AppointmentDepartmentCount[]> {
    return request.get<AppointmentDepartmentCount[]>({
      url: `${BASE_URL}/stats/by-department`,
    });
  }

  /** 按医生统计当天预约 */
  async countTodayByDoctor(): Promise<AppointmentDoctorCount[]> {
    return request.get<AppointmentDoctorCount[]>({
      url: `${BASE_URL}/stats/today-by-doctor`,
    });
  }

  // ==================== 操作接口 ====================

  /** 创建预约 */
  async createAppointment(data: CreateAppointmentParams): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      data,
    });
  }

  /** 更新预约 */
  async updateAppointment(data: UpdateAppointmentParams): Promise<boolean> {
    return request.put<boolean>({
      url: BASE_URL,
      data,
    });
  }

  /** 签到 */
  async checkIn(id: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/check-in`,
    });
  }

  /** 叫号 */
  async call(id: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/call`,
    });
  }

  /** 开始就诊 */
  async start(id: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/start`,
    });
  }

  /** 完成就诊 */
  async finish(id: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/finish`,
    });
  }

  /** 取消预约 */
  async cancel(id: number, data?: CancelAppointmentParams): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/cancel`,
      params: data,
    });
  }

  /** 过号 */
  async markOverdue(id: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/overdue`,
    });
  }

  /** 删除预约 */
  async deleteAppointment(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 批量标记爽约 */
  async batchMarkNoShow(): Promise<number> {
    return request.post<number>({
      url: `${BASE_URL}/batch/no-show`,
    });
  }
}

export const appointmentService = new AppointmentService();
