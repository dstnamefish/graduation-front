/**
 * 科室模块API调用
 * @module api/department
 * @description 提供科室管理相关的所有API接口，包括科室列表查询、科室详情获取等功能
 */

import request from '@/utils/http';
import type {
  DepartmentQuery,
  Department,
  DepartmentCardListResponse,
  DepartmentDetailResponse,
} from '@/types/api/department';

/**
 * 获取科室卡片列表
 * @description 用于科室列表页的卡片式展示，支持按名称模糊搜索和状态筛选
 * @param params 查询参数，包含科室名称（模糊搜索）、状态筛选等
 * @returns 科室卡片列表
 */
export function fetchList(params?: DepartmentQuery): Promise<DepartmentCardListResponse> {
  return request.get<Department[]>({
    url: '/departments/cards',
    params,
  });
}

/**
 * 获取科室详情
 * @description 用于科室详情页的完整信息展示，包含基本信息、联系方式、医生团队等
 * @param id 科室ID
 * @returns 科室详细信息
 */
export function fetchDetail(id: number): Promise<DepartmentDetailResponse> {
  return request.get<DepartmentDetailResponse>({
    url: `/departments/detail/${id}`,
  });
}
