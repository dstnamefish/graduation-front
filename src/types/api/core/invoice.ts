/**
 * 发票模块类型定义
 * @module types/api/core/invoice
 */

import type { PaginationParams, PaginatedResponse } from './common';

/** 发票状态 */
export enum InvoiceStatus {
  DELETED = -1, // 已删除
  OVERDUE = 0,  // 已逾期
  PENDING = 1,  // 待支付
  PAID = 2,     // 已支付
}

/** 发票 - 请求参数 */
export interface CreateInvoiceParams {
  date?: string;
  amount: number;
  invoiceNo?: string;
  status?: number;
  appointmentId?: number;
}

/** 发票 - 更新请求参数 */
export interface UpdateInvoiceParams extends Partial<CreateInvoiceParams> {
  id: number;
}

/** 发票 - 查询参数 */
export interface GetInvoiceParams extends Partial<PaginationParams> {
  status?: InvoiceStatus;
  appointmentId?: number;
}

/** 发票 - 响应数据 */
export interface InvoiceResponse {
  id: number;
  date: string;
  amount: number;
  invoiceNo: string;
  status: InvoiceStatus;
  appointmentId?: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
}

/** 发票 - 分页列表 */
export type InvoiceListResponse = PaginatedResponse<InvoiceResponse>;
