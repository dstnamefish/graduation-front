export function resolveLocalizedText(value: string | undefined | null, locale?: string): string {
  if (!value) return '';
  const targetLocale = locale?.toString().toLowerCase() || 'en';
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null) {
      const normalized = Object.keys(parsed).reduce<Record<string, any>>((acc, key) => {
        acc[key.toLowerCase()] = parsed[key];
        return acc;
      }, {});
      return (
        normalized[targetLocale] ??
        normalized.en ??
        normalized.zh ??
        normalized['zh-CN'] ??
        normalized['en-US'] ??
        value
      );
    }
    return value;
  } catch {
    return value;
  }
}
