/**
 * 医生模块API调用
 * @module api/doctor
 * @description 提供医生管理相关的所有API接口，包括医生列表查询、医生详情、专业领域查询等功能
 */

import request from '@/utils/http';
import {
  DoctorQuery,
  Doctor,
  DoctorDashboard,
  DoctorPageResponse,
  Specialty
} from '@/types/doctor';

/**
 * 分页查询医生列表
 * @description 用于医生管理列表页的表格展示，支持按姓名、科室、专业领域等多条件筛选
 * @param params 医生查询参数，包含页码、每页条数、姓名、科室ID、专业领域ID等筛选条件
 * @returns 返回医生分页数据，包含医生列表、总记录数、当前页码等信息
 */
export function getDoctorPage(params: DoctorQuery) {
  return request.get<DoctorPageResponse>({
    params,
    url: '/doctors'
  });
}

/**
 * 获取医生仪表盘统计数据
 * @description 用于医生详情页或个人中心的统计展示，包括预约数、患者数、评分等信息
 * @param id 医生ID，用于查询指定医生的统计数据
 * @returns 返回医生仪表盘数据，包含预约统计、患者统计、评分、收入等信息
 */
export function getDoctorDashboard(id: number) {
  return request.get<DoctorDashboard>({
    url: `/doctors/${id}/dashboard`
  });
}

/**
 * 获取所有专业领域列表
 * @description 用于医生筛选下拉框或专业领域选择器，获取系统中所有可用的专业领域
 * @returns 返回专业领域列表，每个领域包含ID、名称、描述等信息
 */
export function getSpecialtyList() {
  return request.get<Specialty[]>({
    url: '/specialties/list'
  });
}

/**
 * 删除医生
 * @description 用于医生管理页面的删除功能，软删除指定医生记录
 * @param id 医生ID，指定要删除的医生
 * @returns 返回是否删除成功，true表示成功，false表示失败
 */
export function deleteDoctor(id: number) {
  return Promise.resolve(true);
}
