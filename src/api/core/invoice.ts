/**
 * 发票管理 API 服务
 * @module api/services/invoice.service
 */

import request from '@/utils/http';
import type {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  GetInvoiceParams,
  InvoiceResponse,
  InvoiceListResponse,
} from '@/types/api';

const BASE_URL = '/api/invoice';

class InvoiceService {
  /** 获取发票分页列表 */
  async fetchInvoices(params?: GetInvoiceParams): Promise<InvoiceListResponse> {
    return request.get<InvoiceListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 获取所有发票 */
  async fetchAllInvoices(): Promise<InvoiceResponse[]> {
    return request.get<InvoiceResponse[]>({
      url: `${BASE_URL}/list`,
    });
  }

  /** 获取发票详情 */
  async getInvoiceById(id: number): Promise<InvoiceResponse> {
    return request.get<InvoiceResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 获取待支付发票列表 */
  async getPendingInvoices(): Promise<InvoiceResponse[]> {
    return request.get<InvoiceResponse[]>({
      url: `${BASE_URL}/pending`,
    });
  }

  /** 创建发票 */
  async createInvoice(data: CreateInvoiceRequest): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 更新发票 */
  async updateInvoice(data: UpdateInvoiceRequest): Promise<boolean> {
    return request.put<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 标记为已支付 */
  async markAsPaid(id: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/paid`,
    });
  }

  /** 删除发票 */
  async deleteInvoice(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }
}

export const invoiceService = new InvoiceService();
