/**
 * Appointment Module API
 * @module api/core/appointment
 * @description 预约模块API接口，严格遵循前端架构规范
 */

import request from '@/utils/http';
import type {
  Appointment,
  AppointmentQuery,
  AppointmentForm,
  AppointmentAddForm,
  AppointmentCancelParams,
  AppointmentPageResponse,
  AgendaQuery,
  AgendaEvent,
  AgendaEventListResponse,
  PatientAppointmentQuery,
  AppointmentStatusCountListResponse,
} from '@/types/api/appointment';

/**
 * 分页查询预约列表
 * @description 用于预约管理列表页，支持多条件组合筛选
 * @param params 分页查询参数
 * @returns 分页预约数据
 */
export function fetchPage(params: AppointmentQuery): Promise<AppointmentPageResponse> {
  return request.get<AppointmentPageResponse>({
    url: '/appointments',
    params,
  });
}

/**
 * 创建预约
 * @description 标准创建预约接口
 * @param data 预约创建表单数据
 * @returns 预约ID
 */
export function create(data: AppointmentForm): Promise<number> {
  return request.post<number>({
    url: '/appointments',
    data,
  });
}

/**
 * 取消预约
 * @description 取消已创建的预约
 * @param params 取消预约参数
 * @returns true-取消成功
 */
export function cancel(params: AppointmentCancelParams): Promise<boolean> {
  return request.put<boolean>({
    url: `/appointments/${params.id}/cancel`,
    params: { reason: params.reason },
  });
}

/**
 * 获取日程视图数据
 * @description 用于日历视图展示，根据时间范围获取预约日程
 * @param params 日程查询参数
 * @returns 日程事件列表
 */
export function fetchCalendar(params: AgendaQuery): Promise<AgendaEventListResponse> {
  return request.get<AgendaEvent[]>({
    url: '/appointments/calendar',
    params,
  });
}

/**
 * 快速添加日程
 * @description 从日程视图直接创建预约
 * @param data 快速添加参数
 * @returns 预约ID
 */
export function quickAdd(data: AppointmentAddForm): Promise<number> {
  return request.post<number>({
    url: '/appointments/agenda',
    data,
  });
}

/**
 * 获取患者预约列表
 * @description 查询指定患者的预约记录
 * @param params 患者预约查询参数
 * @returns 预约列表
 */
export function fetchByPatient(params: PatientAppointmentQuery): Promise<Appointment[]> {
  return request.get<Appointment[]>({
    url: `/appointments/patient/${params.patientId}`,
    params: { isUpcoming: params.isUpcoming },
  });
}

export function fetchStatusCountFiltered(params?: AppointmentQuery): Promise<AppointmentStatusCountListResponse> {
  return request.get<AppointmentStatusCountListResponse>({
    url: '/appointments/stats/by-status-filtered',
    params,
  });
}
