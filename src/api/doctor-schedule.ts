/**
 * 排班管理API服务
 * @module api/doctor-schedule
 * @description 提供医生排班管理相关的所有API接口，包括排班的增删改查、按医生/日期/月份查询等功能
 */

import request from '@/utils/http';
import type {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  GetScheduleParams,
  ScheduleResponse,
  ScheduleListResponse,
} from '@/types/api';

class ScheduleService {
  /**
   * 获取排班分页列表
   * @description 用于排班管理列表页的表格展示，支持按医生、日期范围等条件筛选
   * @param params 排班查询参数，包含页码、每页条数、医生ID、开始日期、结束日期等筛选条件
   * @returns 返回排班分页数据，包含排班列表、总记录数、当前页码等信息
   */
  async fetchSchedules(params?: GetScheduleParams): Promise<ScheduleListResponse> {
    return request.get<ScheduleListResponse>({
      url: '/schedule/page',
      params,
    });
  }

  /**
   * 获取所有排班
   * @description 用于排班选择器或下拉框，获取系统中所有排班记录（不分页）
   * @returns 返回排班列表，每个排班包含ID、医生信息、日期、时间段等信息
   */
  async fetchAllSchedules(): Promise<ScheduleResponse[]> {
    return request.get<ScheduleResponse[]>({
      url: '/schedule/list',
    });
  }

  /**
   * 获取排班详情
   * @description 用于排班详情查看或编辑，获取指定排班的完整信息
   * @param id 排班ID，用于查询指定排班的详细信息
   * @returns 返回排班详细信息，包含医生信息、日期、时间段、状态等
   */
  async getScheduleById(id: number): Promise<ScheduleResponse> {
    return request.get<ScheduleResponse>({
      url: `/schedule/${id}`,
    });
  }

  /**
   * 根据医生获取排班列表
   * @description 用于医生排班查看或日历展示，获取指定医生在特定时间范围内的排班
   * @param doctorId 医生ID，指定查询哪个医生的排班
   * @param startDate 开始日期，可选，用于限定查询的时间范围
   * @param endDate 结束日期，可选，用于限定查询的时间范围
   * @returns 返回该医生的排班列表，按日期排序
   */
  async getSchedulesByDoctor(
    doctorId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<ScheduleResponse[]> {
    return request.get<ScheduleResponse[]>({
      url: `/schedule/doctor/${doctorId}`,
      params: { startDate, endDate },
    });
  }

  /**
   * 根据日期获取排班列表
   * @description 用于日程视图或排班日历，获取指定日期的所有医生排班
   * @param date 日期字符串，格式为YYYY-MM-DD
   * @returns 返回该日期的排班列表，包含各医生的排班信息
   */
  async getSchedulesByDate(date: string): Promise<ScheduleResponse[]> {
    return request.get<ScheduleResponse[]>({
      url: `/schedule/date/${date}`,
    });
  }

  /**
   * 根据月份获取排班列表
   * @description 用于月度排班日历展示，获取指定月份的所有排班记录
   * @param year 年份，如2024
   * @param month 月份，1-12
   * @param doctorId 医生ID，可选，用于筛选特定医生的排班
   * @returns 返回该月份的排班列表，可用于日历组件渲染
   */
  async getSchedulesByMonth(
    year: number,
    month: number,
    doctorId?: number,
  ): Promise<ScheduleResponse[]> {
    return request.get<ScheduleResponse[]>({
      url: '/schedule/month',
      params: { year, month, doctorId },
    });
  }

  /**
   * 创建排班
   * @description 用于新增医生排班，设置医生的出诊时间
   * @param data 排班创建数据，包含医生ID、日期、时间段、诊室等信息
   * @returns 返回是否创建成功
   */
  async createSchedule(data: CreateScheduleRequest): Promise<boolean> {
    return request.post<boolean>({
      url: '/schedule',
      params: data,
    });
  }

  /**
   * 批量创建排班
   * @description 用于批量设置医生排班，可一次性创建多个排班记录
   * @param data 排班创建数据数组，每个元素包含医生ID、日期、时间段等信息
   * @returns 返回是否全部创建成功
   */
  async batchCreateSchedules(data: CreateScheduleRequest[]): Promise<boolean> {
    return request.post<boolean>({
      url: '/schedule/batch',
      params: data,
    });
  }

  /**
   * 更新排班
   * @description 用于修改已有的排班信息，如调整时间、诊室等
   * @param data 排班更新数据，包含排班ID和需要更新的字段
   * @returns 返回是否更新成功
   */
  async updateSchedule(data: UpdateScheduleRequest): Promise<boolean> {
    return request.put<boolean>({
      url: '/schedule',
      params: data,
    });
  }

  /**
   * 删除排班
   * @description 用于删除单个排班记录，取消医生的出诊安排
   * @param id 排班ID，指定要删除的排班
   * @returns 返回是否删除成功
   */
  async deleteSchedule(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `/schedule/${id}`,
    });
  }

  /**
   * 批量删除排班
   * @description 用于批量删除排班记录，可一次性取消多个排班
   * @param ids 排班ID数组，指定要删除的排班列表
   * @returns 返回是否全部删除成功
   */
  async batchDeleteSchedules(ids: number[]): Promise<boolean> {
    return request.del<boolean>({
      url: '/schedule/batch',
      params: ids,
    });
  }
}

export const scheduleService = new ScheduleService();
