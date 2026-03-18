/**
 * Dashboard statistics module type definitions
 */

/**
 * Dashboard statistics
 * @description Statistics data for homepage dashboard
 * @property {number} totalPatients - Total patients
 * @property {number} todayAppointments - Today's appointments
 * @property {number} totalAppointments - Total appointments
 * @property {number} pendingAppointments - Pending appointments
 * @property {number} totalInvoices - Total invoices
 * @property {number} unPaidInvoices - Unpaid invoices
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
 * Chart data
 * @description Dashboard chart data
 * @property {string[]} labels - Chart labels
 * @property {number[]} data - Chart data
 */
export interface ChartData {
  labels: string[];
  data: number[];
}

/**
 * Todo item
 * @description Today's todo item
 * @property {number} id - Todo ID
 * @property {string} title - Todo title
 * @property {string} description - Todo description
 * @property {string} time - Todo time
 * @property {string} status - Todo status
 */
export interface TodoItem {
  id: number;
  title: string;
  description: string;
  time: string;
  status: string;
}

/**
 * Dashboard response
 * @description Response for getting dashboard statistics
 * @property {DashboardStats} data - Dashboard statistics
 */
export interface DashboardResponse {
  data: DashboardStats;
}

/**
 * Chart data response
 * @description Response for getting chart data
 * @property {ChartData} data - Chart data
 */
export interface ChartDataResponse {
  data: ChartData;
}

/**
 * Todo list response
 * @description Response for getting today's todos
 * @property {Array<TodoItem>} data - Todo list
 */
export interface TodoListResponse {
  data: TodoItem[];
}
