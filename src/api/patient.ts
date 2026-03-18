/**
 * 患者模块API调用
 * @module api/patient
 * @description 提供患者管理相关的所有API接口，包括患者列表、患者详情、处方管理等功能
 */

import request from '@/utils/http';
import type {
  PatientQuery,
  PatientForm,
  PatientPageResponse,
  PatientDashboardResponse,
  PrescriptionForm,
  Prescription,
  PrescriptionDetailResponse,
} from '@/types/patient';

/**
 * 分页查询患者列表
 * @description 用于患者管理列表页的表格展示，支持按姓名、手机号、病历号等多条件筛选
 * @param params 患者查询参数，包含页码、每页条数、姓名、手机号、病历号等筛选条件
 * @returns 返回患者分页数据，包含患者列表、总记录数、当前页码等信息
 */
export function fetchPage(params: PatientQuery) {
  return request.get<PatientPageResponse>({
    url: '/patients',
    params,
  });
}

/**
 * 创建新患者档案
 * @description 用于新建患者档案，录入患者基本信息和联系方式
 * @param data 患者创建表单数据，包含姓名、性别、出生日期、手机号、身份证号、地址等信息
 * @returns 返回新创建的患者ID，可用于后续操作或跳转详情
 */
export function create(data: PatientForm) {
  return request.post<number>({
    url: '/patients',
    data,
  });
}

/**
 * 获取患者仪表盘数据
 * @description 用于患者详情页的统计展示，聚合显示患者的预约、就诊、处方等统计信息
 * @param patientId 患者ID，用于查询指定患者的统计数据
 * @returns 返回患者仪表盘聚合数据，包含预约统计、就诊记录、处方列表等信息
 */
export function fetchDashboard(patientId: number) {
  return request.get<PatientDashboardResponse>({
    url: `/patients/dashboard/${patientId}`,
  });
}

/**
 * 获取患者历史体征数据
 * @description 用于患者详情页的体征趋势图表，展示患者的历史体征变化
 * @param patientId 患者ID，用于查询指定患者的体征数据
 * @returns 返回患者历史体征数据列表，包含体温、血压、心率等记录
 */
export function fetchVitalsHistory(patientId: number) {
  return request.get<unknown[]>({
    url: `/patients/${patientId}/vitals/history`,
  });
}

/**
 * 创建处方
 * @description 用于医生开具处方，记录药品、用法用量等信息
 * @param data 处方创建表单数据，包含患者ID、诊断信息、药品列表、用法用量等
 * @returns 返回新创建的处方ID
 */
export function createPrescription(data: PrescriptionForm) {
  return request.post<number>({
    url: '/prescriptions',
    data,
  });
}

/**
 * 获取患者的处方列表
 * @description 用于患者详情页的处方记录展示，显示该患者的所有处方历史
 * @param patientId 患者ID，用于查询指定患者的处方列表
 * @returns 返回处方列表，每个处方包含处方ID、开具时间、诊断信息、状态等
 */
export function fetchPrescriptionList(patientId: number) {
  return request.get<Prescription[]>({
    url: `/prescriptions/patient/${patientId}`,
  });
}

/**
 * 获取处方详情
 * @description 用于处方详情查看或打印，获取处方的完整信息
 * @param prescriptionId 处方ID，用于查询指定处方的详细信息
 * @returns 返回处方详情，包含诊断信息、药品列表、用法用量、医生信息等
 */
export function fetchPrescriptionDetail(prescriptionId: number) {
  return request.get<PrescriptionDetailResponse>({
    url: `/prescriptions/${prescriptionId}`,
  });
}

/**
 * 标记处方为已使用
 * @description 用于药房发药后标记处方状态，防止重复取药
 * @param prescriptionId 处方ID，指定要标记的处方
 * @returns 返回是否标记成功
 */
export function markPrescriptionUsed(prescriptionId: number) {
  return request.put<boolean>({
    url: `/prescriptions/${prescriptionId}/used`,
  });
}
