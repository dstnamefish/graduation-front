/**
 * 患者相关API调用
 */

import request from '@/shared/lib/utils/http';
import {
  PatientQuery,
  PatientForm,
  Patient,
  PrescriptionForm,
  Prescription,
  PatientPageResponse
} from './types';

/**
 * 分页查询患者列表
 * @param params 患者查询参数
 * @returns 患者分页数据
 */
export function getPatientPage(params: PatientQuery) {
  return request.get<PatientPageResponse>({
    params,
    url: '/patients'
  });
}

/**
 * 创建新患者档案
 * @param data 患者创建表单数据
 * @returns 生成的患者ID
 */
export function createPatient(data: PatientForm) {
  return request.post<number>({
    data,
    url: '/patients'
  });
}

/**
 * 获取患者历史体征数据
 * @param id 患者ID
 * @returns 患者历史体征数据列表
 */
export function getPatientVitalsHistory(id: number) {
  return request.get<any>({
    url: `/patients/${id}/vitals/history`
  });
}

/**
 * 获取患者个人主页聚合数据
 * @param patientId 患者ID
 * @returns 患者仪表盘数据
 */
export function getPatientDashboard(patientId: number) {
  return request.get<any>({
    url: `/patients/dashboard/${patientId}`
  });
}

/**
 * 创建处方
 * @param data 处方创建表单数据
 * @returns 处方ID
 */
export function createPrescription(data: PrescriptionForm) {
  return request.post<number>({
    data,
    url: '/prescriptions'
  });
}

/**
 * 获取患者的处方列表
 * @param patientId 患者ID
 * @returns 处方列表
 */
export function getPatientPrescriptions(patientId: number) {
  return request.get<Prescription[]>({
    url: `/prescriptions/patient/${patientId}`
  });
}

/**
 * 获取处方详情
 * @param id 处方ID
 * @returns 处方详情
 */
export function getPrescriptionDetail(id: number) {
  return request.get<Prescription>({
    url: `/prescriptions/${id}`
  });
}

/**
 * 标记处方为已使用
 * @param id 处方ID
 * @returns 标记是否成功
 */
export function markPrescriptionAsUsed(id: number) {
  return request.put<boolean>({
    url: `/prescriptions/${id}/used`
  });
}
