/**
 * 医生管理 API 服务
 * @module api/services/doctor.service
 */

import request from '@/shared/lib/utils/http';
import type {
  CreateDoctorParams,
  UpdateDoctorParams,
  GetDoctorParams,
  DoctorResponse,
  DoctorListResponse,
} from './types';

const BASE_URL = '/doctor';

class DoctorService {
  /** 获取医生分页列表 */
  async fetchDoctors(params?: GetDoctorParams): Promise<DoctorListResponse> {
    return request.get<DoctorListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 获取所有医生 */
  async fetchAllDoctors(): Promise<DoctorResponse[]> {
    return request.get<DoctorResponse[]>({
      url: `${BASE_URL}/list`,
    });
  }

  /** 获取医生详情 */
  async getDoctorById(id: number | string): Promise<DoctorResponse> {
    return request.get<DoctorResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 根据科室获取医生列表 */
  async getDoctorsByDepartment(departmentId: number | string): Promise<DoctorResponse[]> {
    return request.get<DoctorResponse[]>({
      url: `${BASE_URL}/department/${departmentId}`,
    });
  }

  /** 创建医生 */
  async createDoctor(data: CreateDoctorParams): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      data,
    });
  }

  /** 更新医生 */
  async updateDoctor(data: UpdateDoctorParams): Promise<boolean> {
    return request.put<boolean>({
      url: BASE_URL,
      data,
    });
  }

  /** 删除医生 */
  async deleteDoctor(id: number | string): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }
}

export const doctorService = new DoctorService();
