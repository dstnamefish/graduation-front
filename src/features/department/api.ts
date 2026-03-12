/**
 * 科室相关API调用
 */

import request from '@/shared/lib/utils/http';
import {
  DepartmentQuery,
  DepartmentCard,
  DepartmentDetail
} from './types';

/**
 * 获取科室卡片列表
 * @param params 科室查询参数
 * @returns 科室卡片列表
 */
export function getDepartmentCards(params: DepartmentQuery) {
  return request.get<DepartmentCard[]>({
    params,
    url: '/departments/cards'
  });
}

/**
 * 获取科室详情
 * @param id 科室ID
 * @returns 科室详情信息
 */
export function getDepartmentDetail(id: number) {
  return request.get<DepartmentDetail>({
    url: `/departments/detail/${id}`
  });
}
