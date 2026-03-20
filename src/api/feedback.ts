import request from '@/utils/http';

/**
 * 获取医患反馈列表（分页）
 */
export function getFeedbackPage(params?: any) {
  return request.get({
    url: 'feedbacks/page',
    params,
  });
}

/**
 * 获取医生的反馈列表
 */
export function getFeedbacksByDoctorId(doctorId: number) {
  return request.get({
    url: `feedbacks/doctor/${doctorId}`,
  });
}

/**
 * 提交反馈
 */
export function submitFeedback(data: any) {
  return request.post({
    url: 'feedbacks',
    data,
  });
}

/**
 * 回复反馈
 */
export function replyFeedback(id: number, reply: string) {
  return request.put({
    url: `feedbacks/${id}/reply`,
    data: { reply },
  });
}
