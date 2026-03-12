/**
 * 预约相关API调用
 */

import request from '@/shared/lib/utils/http';
import {
  AppointmentForm,
  AppointmentAddForm,
  AppointmentQuery,
  AgendaQuery,
  AppointmentPageResponse,
  AppointmentCancelParams,
  PatientAppointmentQuery,
  Appointment,
  AgendaEvent
} from './types';

/**
 * 创建预约
 * @param data 预约创建表单数据
 * @returns 预约ID
 */
export function createAppointment(data: AppointmentForm) {
  return request.post<number>({
    data,
    url: '/appointments'
  });
}

/**
 * 分页查询预约列表
 * @param params 分页查询参数
 * @returns 分页预约数据
 */
export function getAppointmentPage(params: AppointmentQuery) {
  return request.get<AppointmentPageResponse>({
    params,
    url: '/appointments'
  });
}

/**
 * 取消预约
 * @param params 取消预约参数
 * @returns true-取消成功
 */
export function cancelAppointment(params: AppointmentCancelParams) {
  return request.put<boolean>({
    params: { reason: params.reason },
    url: `/appointments/${params.id}/cancel`
  });
}

/**
 * 获取日程视图数据
 * @param params 日程查询参数
 * @returns 日程事件列表
 */
export function getAgendaView(params: AgendaQuery) {
  return request.get<AgendaEvent[]>({
    params,
    url: '/appointments/calendar'
  });
}

/**
 * 快速添加日程
 * @param data 快速添加表单数据
 * @returns 预约ID
 */
export function addAppointmentFromAgenda(data: AppointmentAddForm) {
  return request.post<number>({
    data,
    url: '/appointments/agenda'
  });
}

/**
 * 获取患者预约列表
 * @param params 患者预约查询参数
 * @returns 预约列表
 */
export function getPatientAppointments(params: PatientAppointmentQuery) {
  return request.get<Appointment[]>({
    params: { isUpcoming: params.isUpcoming },
    url: `/appointments/patient/${params.patientId}`
  });
}