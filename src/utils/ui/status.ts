import { AppointmentStatus } from '@/types/api/appointment';

/**
 * 分业务的状态样式映射表
 * 每一个业务（inventory, doctor, payment, etc.）拥有独立的命名空间，解决同名状态冲突问题
 * 样式类引用自 tailwind.css 中定义的应用层变量
 */
const STATUS_MAP: Record<string, Record<string, string>> = {
  /** 库存业务 (Inventory) */
  inventory: {
    'available': 'bg-inventory-available-bg border-inventory-available-border text-inventory-available-text',
    'low': 'bg-inventory-low-bg border-inventory-low-border text-inventory-low-text',
    'out of stock': 'bg-inventory-out-bg border-inventory-out-border text-inventory-out-text',
  },

  /** 医生业务 (Doctors) */
  doctor: {
    available: 'bg-doctor-available-bg border-doctor-available-border text-doctor-available-text',
    unavailable: 'bg-doctor-unavailable-bg border-doctor-unavailable-border text-doctor-unavailable-text',
  },

  /** 支付业务 (Payments) */
  payment: {
    paid: 'bg-payment-paid-bg border-payment-paid-border text-payment-paid-text',
    pending: 'bg-payment-pending-bg border-payment-pending-border text-payment-pending-text',
  },

  /** 预约业务 (Appointments) */
  appointment: {
    pending: 'bg-appointment-pending-bg border-appointment-pending-border text-appointment-pending-text',
    confirmed: 'bg-appointment-confirmed-bg border-appointment-confirmed-border text-appointment-confirmed-text',
    cancelled: 'bg-appointment-cancelled-bg border-appointment-cancelled-border text-appointment-cancelled-text',
    scheduled: 'bg-indigo-50 border-indigo-100 text-indigo-600',
  },

  /** 患者业务 (Patients) */
  patient: {
    'active': 'bg-patient-active-bg border-patient-active-border text-patient-active-text',
    'new patient': 'bg-patient-new-bg border-patient-new-border text-patient-new-text',
    'inactive': 'bg-patient-inactive-bg border-patient-inactive-border text-patient-inactive-text',
  },

  /** 极致通用的状态 */
  common: {
    active: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    inactive: 'bg-slate-50 border-slate-100 text-slate-400',
  },
};

/** 业务类型枚举 */
export type StatusBizType = 'inventory' | 'doctor' | 'payment' | 'appointment' | 'patient' | 'common';

/** ==================== 业务转换映射 (Business Mappers) ==================== */

/** 预约业务转换 */
export const getAppointmentStatusLabel = (status: number | string): string => {
  const s = Number(status);
  const labelMap: Record<number, string> = {
    [AppointmentStatus.PENDING]: 'Pending',
    [AppointmentStatus.CONFIRMED]: 'Confirmed',
    [AppointmentStatus.CANCELLED]: 'Cancelled',
  };
  return labelMap[s] || 'Unknown';
};

/** 库存业务转换 */
export const mapInventoryStatusToUI = (status: string): string => {
  const s = status.toLowerCase();
  const map: Record<string, string> = { 'available': 'available', 'low': 'low', 'out of stock': 'out of stock' };
  return map[s] || s;
};

/** 患者业务转换 */
export const mapPatientStatusToUI = (status: string): string => {
  const s = status.toLowerCase();
  const map: Record<string, string> = { 'active': 'active', 'new patient': 'new patient', 'inactive': 'inactive' };
  return map[s] || s;
};

/** 支付业务转换 */
export const mapPaymentStatusToUI = (status: string): string => {
  const s = status.toLowerCase();
  const map: Record<string, string> = { paid: 'paid', pending: 'pending', overdue: 'overdue' };
  return map[s] || s;
};

/** 医生业务转换 */
export const getDoctorStatusLabel = (status: string | number): string => {
  const s = String(status).toLowerCase();
  const map: Record<string, string> = { available: 'Available', unavailable: 'Unavailable', '1': 'Available', '0': 'Unavailable' };
  return map[s] || s;
};

/** ==================== 核心工具函数 (Core Utilities) ==================== */

/** 业务映射器集合 */
const BIZ_MAPPERS: Record<string, (val: any) => string> = {
  appointment: getAppointmentStatusLabel,
  inventory: mapInventoryStatusToUI,
  patient: mapPatientStatusToUI,
  payment: mapPaymentStatusToUI,
  doctor: getDoctorStatusLabel,
};

/** 统一的状态预处理逻辑 */
const prepareStatus = (status: string | number, type: StatusBizType): string => {
  let s = status;
  if (type !== 'common' && BIZ_MAPPERS[type]) {
    s = BIZ_MAPPERS[type](status);
  }
  return String(s).toLowerCase();
};

/**
 * 获取状态列的 CSS 类
 * @param status 状态值
 * @param type 业务所属模块，用于区分同名状态
 * @param customMap 可选的自定义覆盖映射
 */
export function getStatusClass(status: string | number, type: StatusBizType = 'common', customMap?: Record<string, string>) {
  const s = prepareStatus(status, type);
  if (customMap && customMap[s]) return customMap[s];
  if (STATUS_MAP[type] && STATUS_MAP[type][s]) return STATUS_MAP[type][s];
  if (STATUS_MAP.common[s]) return STATUS_MAP.common[s];
  for (const biz in STATUS_MAP) {
    if (STATUS_MAP[biz][s]) return STATUS_MAP[biz][s];
  }
  return 'bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800/20 dark:border-slate-800 dark:text-slate-400';
}

/** 获取状态圆点的 CSS 类 */
export function getStatusDotClass(status: string | number, type: StatusBizType = 'common') {
  const s = prepareStatus(status, type);
  const DOT_STYLE_MAP: Record<string, Record<string, string>> = {
    inventory: { 'available': 'bg-primary', 'low': 'bg-destructive', 'out of stock': 'bg-muted' },
  };
  if (DOT_STYLE_MAP[type] && DOT_STYLE_MAP[type][s]) return DOT_STYLE_MAP[type][s];
  for (const biz in DOT_STYLE_MAP) {
    if (DOT_STYLE_MAP[biz][s]) return DOT_STYLE_MAP[biz][s];
  }
  return 'bg-slate-400';
}
