/**
 * 格式化金额 (e.g., 1234.5 -> $1,234.50)
 */
export function formatCurrency(amount: number | string, symbol = '$'): string {
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(val)) return '-';
  return (
    symbol + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}
