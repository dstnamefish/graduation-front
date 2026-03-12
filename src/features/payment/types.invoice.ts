/**
 * 发票/账单模块类型定义
 */

/**
 * 支付状态
 * @description 账单的支付状态枚举
 * @enum {number}
 */
export enum PaymentStatus {
  PENDING = 1,  // 待支付
  PAID = 2,     // 已支付
  OVERDUE = 3,  // 逾期
}

/**
 * 账单查询参数
 * @description 用于账单列表分页查询的请求参数，支持多条件筛选
 * @property {string} query - 综合搜索关键词，对应前端 "Search name, treatment, etc" 搜索框
 * @property {string} dateRange - 日期范围筛选，格式："2024-01-01 - 2024-01-31"
 * @property {number} paymentStatus - 支付状态筛选：1-待支付（Pending），2-已支付（Paid），3-逾期（Overdue）
 * @property {number} page - 页码，默认1
 * @property {number} size - 每页大小，默认10
 */
export interface InvoiceQuery {
  query?: string;
  dateRange?: string;
  paymentStatus?: number;
  page?: number;
  size?: number;
}

/**
 * 账单创建表单
 * @description 用于新增账单的表单数据
 * @property {number} patientId - 患者ID，关联患者表的主键
 * @property {number} appointmentId - 预约/就诊ID，用于关联就诊记录以获取科室、治疗项目等信息
 * @property {number} amount - 账单金额
 * @property {string} invoiceDate - 账单日期，格式：yyyy-MM-dd
 */
export interface InvoiceForm {
  patientId: number;
  appointmentId: number;
  amount: number;
  invoiceDate: string;
}

/**
 * 账单详情信息
 * @description 用于账单列表分页查询的结果展示
 * @property {number} id - 账单ID
 * @property {string} invoiceId - 账单编号，示例：INV-WNH-001
 * @property {string} patientName - 患者姓名，示例：John Doe
 * @property {string} treatment - 治疗项目，示例：Routine Check-Up
 * @property {string} department - 科室名称，用于UI中显示的灰色小字，示例：General Medicine
 * @property {string} date - 账单日期，格式示例：1 July 2028
 * @property {string} amount - 账单金额，格式示例：$100
 * @property {string} statusText - 支付状态文本，示例：Paid、Pending、Overdue
 * @property {number} paymentStatus - 支付状态码：1-待支付（Pending），2-已支付（Paid），3-逾期（Overdue）
 */
export interface Invoice {
  id: number;
  invoiceId: string;
  patientName: string;
  treatment: string;
  department: string;
  date: string;
  amount: string;
  statusText: string;
  paymentStatus: number;
}

/**
 * 账单统计数据
 * @description 用于账单列表页面顶部统计卡片的展示
 * @property {number} totalInvoice - 总账单数，所有账单的总数量
 * @property {number} paidInvoice - 已支付账单数，状态为已支付的账单数量
 * @property {number} pendingInvoice - 待支付账单数，状态为待支付的账单数量
 * @property {number} overdue - 逾期账单数，状态为逾期的账单数量
 */
export interface InvoiceStats {
  totalInvoice: number;
  paidInvoice: number;
  pendingInvoice: number;
  overdue: number;
}

/**
 * 账单分页响应
 * @description 账单列表的分页响应数据
 * @property {number} total - 总记录数
 * @property {number} size - 每页大小
 * @property {number} current - 当前页码
 * @property {Array<Invoice>} records - 账单列表数据
 */
export interface InvoicePageResponse {
  total: number;
  size: number;
  current: number;
  records: Invoice[];
}

/**
 * 账单统计响应
 * @description 获取账单统计数据的响应数据
 * @property {InvoiceStats} data - 账单统计数据
 */
export interface InvoiceStatsResponse {
  data: InvoiceStats;
}

/**
 * 账单创建响应
 * @description 新增账单的响应数据
 * @property {number} data - 新增账单的ID
 */
export interface InvoiceCreateResponse {
  data: number;
}
