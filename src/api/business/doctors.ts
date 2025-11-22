
import { DoctorListParams, DoctorListResponse } from '@/types/api/business/doctors';
import request from '@/utils/http';


export function fetchDoctorList(params?: DoctorListParams) {
  return request.get<DoctorListResponse>({
    params,
    showErrorMessage: true,
    showSuccessMessage: true,
    url: 'doctors/list',
  });
}