import { LanguageEnum } from '@/enums/appEnum';
import { StorageKeyManager } from '@/utils/storage/storage-key-manager';

const storageKeyManager = new StorageKeyManager();

/**
 * 获取当前语言设置
 */
function getCurrentLocale(): string {
  try {
    const storageKey = storageKeyManager.getStorageKey('user');
    const userStore = localStorage.getItem(storageKey);
    if (userStore) {
      const { language } = JSON.parse(userStore);
      if (language) return language;
    }
  } catch (error) {
    // ignore
  }
  return LanguageEnum.EN;
}

/**
 * 格式化日期 (支持国际化)
 * 英文: 3 March 2026
 * 中文: 2026年3月3日
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = new Date(date);
  const locale = getCurrentLocale();

  if (locale === LanguageEnum.ZH) {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  return d.getDate() + ' ' + d.toLocaleString('en-US', { month: 'long' }) + ' ' + d.getFullYear();
}

/**
 * 格式化时间 (支持国际化)
 * 英文: 02:30 PM
 * 中文: 下午 02:30
 */
export function formatTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const locale = getCurrentLocale();

  if (locale === LanguageEnum.ZH) {
    const chineseAmpm = hour >= 12 ? '下午' : '上午';
    return `${chineseAmpm} ${hour12.toString().padStart(2, '0')}:${m}`;
  }

  return hour12.toString().padStart(2, '0') + ':' + m + ' ' + ampm;
}
