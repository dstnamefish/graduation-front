/**
 * 科室管理 API 服务
 * @module api/services/department.service
 */

import request from '@/utils/http';
import type {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  GetDepartmentParams,
  DepartmentResponse,
  DepartmentListResponse,
  CreateSpecialtyRequest,
  UpdateSpecialtyRequest,
  GetSpecialtyParams,
  SpecialtyResponse,
  SpecialtyListResponse,
} from '@/types/api';

const DEPARTMENT_URL = '/api/department';
const SPECIALTY_URL = '/api/specialty';

// ==================== 科室服务 ====================

class DepartmentService {
  /** 获取科室分页列表 */
  async fetchDepartments(params?: GetDepartmentParams): Promise<DepartmentListResponse> {
    return request.get<DepartmentListResponse>({
      url: `${DEPARTMENT_URL}/page`,
      params,
    });
  }

  /** 获取所有科室 */
  async fetchAllDepartments(): Promise<DepartmentResponse[]> {
    return request.get<DepartmentResponse[]>({
      url: `${DEPARTMENT_URL}/all`,
    });
  }

  /** 获取科室详情 */
  async getDepartmentById(id: number): Promise<DepartmentResponse> {
    return request.get<DepartmentResponse>({
      url: `${DEPARTMENT_URL}/${id}`,
    });
  }

  /** 创建科室 */
  async createDepartment(data: CreateDepartmentRequest): Promise<boolean> {
    return request.post<boolean>({
      url: DEPARTMENT_URL,
      params: data,
    });
  }

  /** 更新科室 */
  async updateDepartment(data: UpdateDepartmentRequest): Promise<boolean> {
    return request.put<boolean>({
      url: DEPARTMENT_URL,
      params: data,
    });
  }

  /** 删除科室 */
  async deleteDepartment(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${DEPARTMENT_URL}/${id}`,
    });
  }

  /** 批量删除科室 */
  async batchDeleteDepartments(ids: number[]): Promise<boolean> {
    return request.del<boolean>({
      url: `${DEPARTMENT_URL}/batch`,
      params: ids,
    });
  }
}

// ==================== 专业领域服务 ====================

class SpecialtyService {
  /** 获取专业领域分页列表 */
  async fetchSpecialties(params?: GetSpecialtyParams): Promise<SpecialtyListResponse> {
    return request.get<SpecialtyListResponse>({
      url: `${SPECIALTY_URL}/page`,
      params,
    });
  }

  /** 获取所有专业领域 */
  async fetchAllSpecialties(): Promise<SpecialtyResponse[]> {
    return request.get<SpecialtyResponse[]>({
      url: `${SPECIALTY_URL}/all`,
    });
  }

  /** 获取专业领域详情 */
  async getSpecialtyById(id: number): Promise<SpecialtyResponse> {
    return request.get<SpecialtyResponse>({
      url: `${SPECIALTY_URL}/${id}`,
    });
  }

  /** 创建专业领域 */
  async createSpecialty(data: CreateSpecialtyRequest): Promise<boolean> {
    return request.post<boolean>({
      url: SPECIALTY_URL,
      params: data,
    });
  }

  /** 更新专业领域 */
  async updateSpecialty(data: UpdateSpecialtyRequest): Promise<boolean> {
    return request.put<boolean>({
      url: SPECIALTY_URL,
      params: data,
    });
  }

  /** 删除专业领域 */
  async deleteSpecialty(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${SPECIALTY_URL}/${id}`,
    });
  }

  /** 批量删除专业领域 */
  async batchDeleteSpecialties(ids: number[]): Promise<boolean> {
    return request.del<boolean>({
      url: `${SPECIALTY_URL}/batch`,
      params: ids,
    });
  }
}

export const departmentService = new DepartmentService();
export const specialtyService = new SpecialtyService();
