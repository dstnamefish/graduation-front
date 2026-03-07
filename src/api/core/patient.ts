/**
 * 患者管理 API 服务
 * @module api/services/patient.service
 */

import request from '@/utils/http';
import type {
  CreatePatientRequest,
  UpdatePatientRequest,
  GetPatientParams,
  PatientResponse,
  PatientListResponse,
} from '@/types/api';

const BASE_URL = '/api/patient';

class PatientService {
  /** 获取患者分页列表 */
  async fetchPatients(params?: GetPatientParams): Promise<PatientListResponse> {
    return request.get<PatientListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 获取所有患者 */
  async fetchAllPatients(): Promise<PatientResponse[]> {
    return request.get<PatientResponse[]>({
      url: `${BASE_URL}/list`,
    });
  }

  /** 获取患者详情 */
  async getPatientById(id: number): Promise<PatientResponse> {
    return request.get<PatientResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 创建患者 */
  async createPatient(data: CreatePatientRequest): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 更新患者 */
  async updatePatient(data: UpdatePatientRequest): Promise<boolean> {
    return request.put<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 删除患者 */
  async deletePatient(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }
}

export const patientService = new PatientService();
