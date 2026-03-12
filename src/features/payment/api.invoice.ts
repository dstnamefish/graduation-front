/**
 * 账单管理 API 调用
 */

import request from '@/shared/lib/utils/http';
import {
  InvoiceQuery,
  InvoiceForm,
  Invoice,
  InvoiceStats,
  InvoicePageResponse
} from './types.invoice';

/**
 * 分页查询账单列表
 * @param params 账单查询参数
 * @returns 账单分页数据
 */
export function getInvoicePage(params: InvoiceQuery) {
  return request.get<InvoicePageResponse>({
    params,
    url: '/billing/page'
  });
}

/**
 * 获取账单统计数据
 * @returns 账单统计数据
 */
export function getInvoiceStats() {
  return request.get<InvoiceStats>({
    url: '/billing/stats'
  });
}

/**
 * 新增账单
 * @param data 账单创建表单数据
 * @returns 新增账单的ID
 */
export function addInvoice(data: InvoiceForm) {
  return request.post<number>({
    data,
    url: '/billing/add'
  });
}
