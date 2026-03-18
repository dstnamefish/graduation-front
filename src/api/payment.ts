/**
 * 账单模块API调用
 * @module api/payment
 * @description 提供账单管理相关的所有API接口，包括账单列表查询、统计、新增等功能
 */

import request from '@/utils/http';
import { InvoiceQuery, InvoiceForm, InvoiceStats, InvoicePageResponse } from '@/types/payment';

/**
 * 分页查询账单列表
 * @description 用于账单管理列表页的表格展示，支持按日期范围、支付状态、关键词等多条件筛选
 * @param params 账单查询参数，包含页码、每页条数、开始日期、结束日期、支付状态、关键词等筛选条件
 * @returns 返回账单分页数据，包含账单列表、总记录数、当前页码等信息
 */
export function fetchPage(params?: InvoiceQuery) {
  return request.get<InvoicePageResponse>({
    params,
    url: `billing/page`,
  });
}

/**
 * 获取账单统计数据
 * @description 用于账单页面的统计卡片展示，显示总账单数、已支付、待支付、逾期等统计数值
 * @returns 返回账单统计数据，包含总金额、已支付金额、待支付金额、逾期金额等
 */
export function fetchStats() {
  return request.get<InvoiceStats>({
    url: `billing/stats`,
  });
}

/**
 * 新增账单
 * @description 用于创建新账单，记录患者的费用明细
 * @param data 新增账单表单数据，包含患者ID、费用项目、金额、备注等信息
 * @returns 返回新创建的账单ID，可用于后续操作或跳转详情
 */
export function create(data: InvoiceForm) {
  return request.post<number>({
    data,
    url: `billing/add`,
  });
}
