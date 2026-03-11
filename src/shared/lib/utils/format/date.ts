/**
 * 格式化日期 (e.g., 2026-03-03 -> 3 March 2026)
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = new Date(date);
  return d.getDate() + ' ' + d.toLocaleString('en-US', { month: 'long' }) + ' ' + d.getFullYear();
}

/**
 * 格式化时间 (e.g., 14:30 -> 02:30 AM/PM)
 */
export function formatTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return hour12.toString().padStart(2, '0') + ':' + m + ' ' + ampm;
}
