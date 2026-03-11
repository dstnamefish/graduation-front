/**
 * 支付模块类型定义
 * @module types/api/core/payment
 */


/** 支付方式 */
export enum PaymentMethod {
  CASH = 0,      // 现金
  BANK_CARD = 1, // 银行卡
  WECHAT = 2,    // 微信
  ALIPAY = 3,    // 支付宝
}

/** 支付状态 */
export enum PaymentStatus {
  FAILED = 0,  // 失败
  SUCCESS = 1, // 成功
}

/** 退款状态 */
export enum RefundStatus {
  NO_REFUND = 0,      // 无退款
  PARTIAL_REFUND = 1, // 部分退款
  FULL_REFUND = 2,    // 全额退款
}

/** 支付 - 请求参数 */
export interface CreatePaymentParams {
  amount: number;
  paymentMethod: PaymentMethod;
  status?: number;
  invoiceId: number;
}

/** 支付 - 查询参数 */
export interface GetPaymentParams extends Partial<PaginationParams> {
  status?: PaymentStatus;
  invoiceId?: number;
}

/** 退款 - 请求参数 */
export interface RefundParams {
  refundedAmount: number;
  refundReason?: string;
}

/** 支付 - 响应数据 */
export interface PaymentResponse {
  id: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt: string;
  refundStatus: RefundStatus;
  refundedAmount?: number;
  refundReason?: string;
  refundedTime?: string;
  invoiceId: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
}

/** 支付 - 分页列表 */
export type PaymentListResponse = PaginatedResponse<PaymentResponse>;
