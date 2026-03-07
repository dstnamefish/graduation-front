/**
 * 医生管理 API 服务
 * @module api/services/doctor.service
 */

import request from '@/utils/http';
import type {
  CreateDoctorRequest,
  UpdateDoctorRequest,
  GetDoctorParams,
  DoctorResponse,
  DoctorListResponse,
} from '@/types/api';

const BASE_URL = '/api/doctor';

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
  async getDoctorById(id: number): Promise<DoctorResponse> {
    return request.get<DoctorResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 根据科室获取医生列表 */
  async getDoctorsByDepartment(departmentId: number): Promise<DoctorResponse[]> {
    return request.get<DoctorResponse[]>({
      url: `${BASE_URL}/department/${departmentId}`,
    });
  }

  /** 创建医生 */
  async createDoctor(data: CreateDoctorRequest): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 更新医生 */
  async updateDoctor(data: UpdateDoctorRequest): Promise<boolean> {
    return request.put<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 删除医生 */
  async deleteDoctor(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }
}

export const doctorService = new DoctorService();
