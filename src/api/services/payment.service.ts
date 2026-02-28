/**
 * 支付管理 API 服务
 * @module api/services/payment.service
 */

import request from '@/utils/http';
import type {
  CreatePaymentRequest,
  GetPaymentParams,
  RefundRequest,
  PaymentResponse,
  PaymentListResponse,
} from '@/types/api';

const BASE_URL = '/api/payment';

class PaymentService {
  /** 获取支付分页列表 */
  async fetchPayments(params?: GetPaymentParams): Promise<PaymentListResponse> {
    return request.get<PaymentListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 获取所有支付记录 */
  async fetchAllPayments(): Promise<PaymentResponse[]> {
    return request.get<PaymentResponse[]>({
      url: `${BASE_URL}/list`,
    });
  }

  /** 获取支付详情 */
  async getPaymentById(id: number): Promise<PaymentResponse> {
    return request.get<PaymentResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 根据发票获取支付记录 */
  async getPaymentsByInvoice(invoiceId: number): Promise<PaymentResponse[]> {
    return request.get<PaymentResponse[]>({
      url: `${BASE_URL}/invoice/${invoiceId}`,
    });
  }

  /** 创建支付 */
  async createPayment(data: CreatePaymentRequest): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 申请退款 */
  async applyRefund(id: number, data: RefundRequest): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/refund`,
      params: data,
    });
  }

  /** 删除支付记录 */
  async deletePayment(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }
}

export const paymentService = new PaymentService();
