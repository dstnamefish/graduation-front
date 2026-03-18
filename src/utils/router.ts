/**
 * 路由工具函数
 *
 * 提供路由相关的工具函数
 *
 * @module utils/router
 */

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import AppConfig from '@/config';
import i18n, { $t } from '@/locales';
import { LanguageEnum } from '@/enums/appEnum';
import { getSystemStorage } from '@/utils/storage/storage';
import { StorageKeyManager } from '@/utils/storage/storage-key-manager';
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

/** 扩展的路由配置类型 */
export type AppRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean
}

/** 顶部进度条配置 */
export const configureNProgress = () => {
  NProgress.configure({
    easing: 'ease',
    parent: 'body',
    showSpinner: false,
    speed: 600,
    trickleSpeed: 200,
  });
};

/**
 * 设置页面标题，根据路由元信息和系统信息拼接标题
 * @param to 当前路由对象
 */
export const setPageTitle = (to: RouteLocationNormalized): void => {
  const { title } = to.meta;
  if (title) {
    setTimeout(() => {
      document.title = `${formatMenuTitle(String(title))} - ${AppConfig.systemInfo.name}`;
    }, 150);
  }
};

/**
 * 获取当前语言设置
 * @returns 当前语言代码
 */
const getCurrentLanguage = (): string => {
  const storageKeyManager = new StorageKeyManager();

  try {
    const storageKey = storageKeyManager.getStorageKey('user');
    const userStore = localStorage.getItem(storageKey);

    if (userStore) {
      const { language } = JSON.parse(userStore);
      if (language) {
        return language;
      }
    }
  } catch {
    // ignore
  }

  try {
    const sys = getSystemStorage();
    if (sys) {
      const { user } = JSON.parse(sys);
      if (user?.language) {
        return user.language;
      }
    }
  } catch {
    // ignore
  }

  return LanguageEnum.ZH;
};

/**
 * 解析 JSONB 多语言字段
 * @param value 可能是 JSONB 格式的字符串或普通字符串
 * @returns 根据当前语言返回对应的翻译
 */
const parseI18nJsonb = (value: string): string => {
  if (!value || typeof value !== 'string') {
    return value || '';
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return value;
  }

  try {
    const i18nMap: Record<string, string> = JSON.parse(trimmed);
    const currentLang = getCurrentLanguage();

    if (i18nMap[currentLang]) {
      return i18nMap[currentLang];
    }

    if (i18nMap[LanguageEnum.ZH]) {
      return i18nMap[LanguageEnum.ZH];
    }

    if (i18nMap[LanguageEnum.EN]) {
      return i18nMap[LanguageEnum.EN];
    }

    const firstValue = Object.values(i18nMap)[0];
    if (firstValue) {
      return firstValue;
    }

    return value;
  } catch {
    return value;
  }
};

/**
 * 格式化菜单标题
 * @param title 菜单标题，可以是 i18n 的 key、JSONB 格式或普通字符串
 * @returns 格式化后的菜单标题
 */
export const formatMenuTitle = (title: string): string => {
  if (!title) {
    return '';
  }

  const parsedTitle = parseI18nJsonb(title);

  if (parsedTitle !== title) {
    return parsedTitle;
  }

  if (title.startsWith('menus.')) {
    if (i18n.global.te(title)) {
      return $t(title);
    } else {
      return title.split('.').pop() || title;
    }
  }

  return title;
};