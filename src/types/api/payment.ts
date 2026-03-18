/**
 * Invoice module type definitions
 * @module features/payment/types
 */

/**
 * Payment status enum
 * @description Invoice payment status
 */
export enum PaymentStatus {
  PENDING = 1,
  PAID = 2,
  OVERDUE = 3,
}

/**
 * Invoice query params
 * @description Request params for invoice pagination query
 * @property {number} pageNum - Current page number
 * @property {number} pageSize - Page size
 * @property {string} query - Search keyword for patient name, treatment item, etc.
 * @property {string} dateRange - Date range filter, format: "2024-01-01 - 2024-01-31"
 * @property {PaymentStatus} paymentStatus - Payment status filter
 */
export interface InvoiceQuery {
  pageNum?: number;
  pageSize?: number;
  query?: string;
  dateRange?: string;
  paymentStatus?: PaymentStatus;
}

/**
 * Invoice creation form
 * @description Form data for creating new invoice
 * @property {number} appointmentId - Appointment/visit ID for associating visit record to get department, patient, etc.
 * @property {number} amount - Invoice amount
 */
export interface InvoiceForm {
  appointmentId: number;
  amount: number;
}

/**
 * Invoice list item
 * @description Query result display for invoice list page
 * @property {number} id - Invoice ID
 * @property {string} invoiceId - Invoice number, e.g. INV-WNH-001
 * @property {string} patientName - Patient name
 * @property {string} treatment - Treatment item
 * @property {string} department - Department name
 * @property {string} date - Invoice date
 * @property {string} amount - Invoice amount
 * @property {string} statusText - Payment status text
 * @property {PaymentStatus} paymentStatus - Payment status code
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
  paymentStatus: PaymentStatus;
}

/**
 * Invoice statistics
 * @description Display for statistics cards at top of invoice list page
 * @property {number} totalInvoice - Total invoices
 * @property {number} paidInvoice - Paid invoices
 * @property {number} pendingInvoice - Pending invoices
 * @property {number} overdue - Overdue invoices
 */
export interface InvoiceStats {
  totalInvoice: number;
  paidInvoice: number;
  pendingInvoice: number;
  overdue: number;
}

/**
 * Invoice pagination response
 * @description Paginated response for invoice list
 * @property {number} total - Total records
 * @property {number} size - Page size
 * @property {number} current - Current page
 * @property {Array<Invoice>} records - Invoice list data
 */
export interface InvoicePageResponse {
  total: number;
  size: number;
  current: number;
  records: Invoice[];
}
