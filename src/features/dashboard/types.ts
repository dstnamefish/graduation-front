/**
 * 仪表盘统计模块类型定义
 */

/**
 * 仪表盘统计数据
 * @description 首页仪表盘的统计数据
 * @property {number} totalPatients - 总患者数
 * @property {number} todayAppointments - 今日预约数
 * @property {number} totalAppointments - 总预约数
 * @property {number} pendingAppointments - 待处理预约数
 * @property {number} totalInvoices - 总账单数
 * @property {number} unPaidInvoices - 未支付账单数
 */
export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  totalAppointments: number;
  pendingAppointments: number;
  totalInvoices: number;
  unPaidInvoices: number;
}

/**
 * 图表数据
 * @description 仪表盘图表数据
 * @property {string[]} labels - 图表标签
 * @property {number[]} data - 图表数据
 */
export interface ChartData {
  labels: string[];
  data: number[];
}

/**
 * 今日待办
 * @description 今日待办事项
 * @property {number} id - 待办ID
 * @property {string} title - 待办标题
 * @property {string} description - 待办描述
 * @property {string} time - 待办时间
 * @property {string} status - 待办状态
 */
export interface TodoItem {
  id: number;
  title: string;
  description: string;
  time: string;
  status: string;
}

/**
 * 仪表盘响应
 * @description 获取仪表盘统计数据的响应数据
 * @property {DashboardStats} data - 仪表盘统计数据
 */
export interface DashboardResponse {
  data: DashboardStats;
}

/**
 * 图表数据响应
 * @description 获取图表数据的响应数据
 * @property {ChartData} data - 图表数据
 */
export interface ChartDataResponse {
  data: ChartData;
}

/**
 * 今日待办响应
 * @description 获取今日待办的响应数据
 * @property {Array<TodoItem>} data - 今日待办列表
 */
export interface TodoListResponse {
  data: TodoItem[];
}
