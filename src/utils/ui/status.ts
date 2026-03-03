/**
 * 通用状态类映射
 */
export const STATUS_COLORS = {
  success: 'bg-status-success-bg border-status-success-border text-status-success-text',
  error: 'bg-status-error-bg border-status-error-border text-status-error-text',
  warning: 'bg-status-warning-bg border-status-warning-border text-status-warning-text',
  info: 'bg-status-info-bg border-status-info-border text-status-info-text',
  teal: 'bg-teal-50 border-teal-100 text-teal-600',
  orange: 'bg-orange-50 border-orange-100 text-orange-600',
  red: 'bg-red-50 border-red-100 text-red-600',
  slate: 'bg-slate-50 border-slate-100 text-slate-600',
};

/**
 * 获取状态列的 CSS 类
 * @param status 状态字符串
 * @param customMap 自定义映射
 */
export function getStatusClass(status: string, customMap?: Record<string, string>) {
  if (customMap && customMap[status]) return customMap[status];

  const lowerStatus = status.toLowerCase();

  // Success / Positive
  if (
    ['available', 'paid', 'active', 'confirmed', 'completed', 'active patient'].includes(
      lowerStatus,
    )
  )
    return STATUS_COLORS.teal;

  // Warning / Neutral
  if (['pending', 'low', 'new patient'].includes(lowerStatus)) return STATUS_COLORS.orange;

  // Error / Negative
  if (['unavailable', 'overdue', 'cancelled', 'out of stock', 'inactive'].includes(lowerStatus))
    return STATUS_COLORS.red;

  return STATUS_COLORS.slate;
}

/**
 * 获取状态圆点的 CSS 类
 * @param status 状态字符串
 */
export function getStatusDotClass(status: string) {
  const lowerStatus = status.toLowerCase();

  const DOT_COLORS = {
    teal: 'bg-teal-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    slate: 'bg-slate-400',
  };

  if (
    ['available', 'paid', 'active', 'confirmed', 'completed', 'active patient'].includes(
      lowerStatus,
    )
  )
    return DOT_COLORS.teal;

  if (['pending', 'low', 'new patient'].includes(lowerStatus)) return DOT_COLORS.orange;

  if (['unavailable', 'overdue', 'cancelled', 'out of stock', 'inactive'].includes(lowerStatus))
    return DOT_COLORS.red;

  return DOT_COLORS.slate;
}
