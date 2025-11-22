
/**
 * 医生列表参数
 * 
 *
 */
export interface DoctorListParams{
  name?: string;
  id?: number;
  age?: number;
  department?: string;
  specialist?: string;
  status?: number;
}

/**
 * 医生列表响应
 */
export interface DoctorListResponse {
  name: string;
  id: number;
  department: string;
  speciality: string;
  status: number;
}