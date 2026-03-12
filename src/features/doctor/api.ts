/**
 * 医生相关API调用
 */

import request from '@/shared/lib/utils/http';
import {
  DoctorQuery,
  Doctor,
  DoctorDashboard,
  DoctorPageResponse
} from './types';

/**
 * 分页查询医生列表
 * @param params 医生查询参数
 * @returns 医生分页数据
 */
export function getDoctorPage(params: DoctorQuery) {
  return request.get<DoctorPageResponse>({
    params,
    url: '/doctors'
  });
}

/**
 * 获取医生仪表盘统计数据
 * @param id 医生ID
 * @returns 医生仪表盘数据
 */
export function getDoctorDashboard(id: number) {
  return request.get<DoctorDashboard>({
    url: `/doctors/${id}/dashboard`
  });
}
