/**
 * 排班管理 API 服务
 * @module api/services/schedule.service
 */

import request from '@/utils/http';
import type {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  GetScheduleParams,
  ScheduleResponse,
  ScheduleListResponse,
} from '@/types/api';

const BASE_URL = '/api/schedule';

class ScheduleService {
  /** 获取排班分页列表 */
  async fetchSchedules(params?: GetScheduleParams): Promise<ScheduleListResponse> {
    return request.get<ScheduleListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 获取所有排班 */
  async fetchAllSchedules(): Promise<ScheduleResponse[]> {
    return request.get<ScheduleResponse[]>({
      url: `${BASE_URL}/list`,
    });
  }

  /** 获取排班详情 */
  async getScheduleById(id: number): Promise<ScheduleResponse> {
    return request.get<ScheduleResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 根据医生获取排班列表 */
  async getSchedulesByDoctor(doctorId: number, startDate?: string, endDate?: string): Promise<ScheduleResponse[]> {
    return request.get<ScheduleResponse[]>({
      url: `${BASE_URL}/doctor/${doctorId}`,
      params: { startDate, endDate },
    });
  }

  /** 根据日期获取排班列表 */
  async getSchedulesByDate(date: string): Promise<ScheduleResponse[]> {
    return request.get<ScheduleResponse[]>({
      url: `${BASE_URL}/date/${date}`,
    });
  }

  /** 根据月份获取排班列表 */
  async getSchedulesByMonth(year: number, month: number, doctorId?: number): Promise<ScheduleResponse[]> {
    return request.get<ScheduleResponse[]>({
      url: `${BASE_URL}/month`,
      params: { year, month, doctorId },
    });
  }

  /** 创建排班 */
  async createSchedule(data: CreateScheduleRequest): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 批量创建排班 */
  async batchCreateSchedules(data: CreateScheduleRequest[]): Promise<boolean> {
    return request.post<boolean>({
      url: `${BASE_URL}/batch`,
      params: data,
    });
  }

  /** 更新排班 */
  async updateSchedule(data: UpdateScheduleRequest): Promise<boolean> {
    return request.put<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 删除排班 */
  async deleteSchedule(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 批量删除排班 */
  async batchDeleteSchedules(ids: number[]): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/batch`,
      params: ids,
    });
  }
}

export const scheduleService = new ScheduleService();
