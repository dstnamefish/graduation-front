/**
 * 系统设置默认值配置
 * @module config/setting
 * @description 统一管理系统设置的所有默认值，包括菜单、主题、界面显示、功能开关等
 */

import AppConfig from '@/config';
import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum, ContainerWidthEnum } from '@/enums/appEnum';

/** 系统设置默认值配置 */
export const SETTING_DEFAULT_CONFIG = {
  /** 是否自动关闭 */
  autoClose: false,
  /** 边框模式 */
  boxBorderMode: true,
  /** 是否色弱模式 */
  colorWeak: false,
  /** 容器宽度 */
  containerWidth: ContainerWidthEnum.FULL,
  /** 双菜单是否显示文本 */
  dualMenuShowText: false,
  /** 节日日期 */
  festivalDate: '',
  /** 是否加载节日烟花 */
  holidayFireworksLoaded: false,
  /** 菜单是否展开 */
  menuOpen: true,
  /** 菜单展开宽度 */
  menuOpenWidth: 230,
  /** 菜单风格 */
  menuThemeType: MenuThemeEnum.DESIGN,
  /** 菜单类型 */
  menuType: MenuTypeEnum.LEFT,
  /** 页面过渡效果 */
  pageTransition: 'slide-left',
  /** 是否刷新 */
  refresh: false,
  /** 是否显示面包屑 */
  showCrumbs: true,
  /** 是否显示节日文本 */
  showFestivalText: false,
  /** 是否显示进度条 */
  showNprogress: false,
  /** 是否显示设置引导 */
  showSettingGuide: true,
  /** 是否显示工作台标签 */
  showWorkTab: true,
  /** 系统主题颜色 */
  systemThemeColor: AppConfig.systemMainColor[0],
  /** 系统主题模式 */
  systemThemeMode: SystemThemeEnum.AUTO,
  /** 系统主题类型 */
  systemThemeType: SystemThemeEnum.AUTO,
  /** 标签页样式 */
  tabStyle: 'tab-default',
  /** 是否唯一展开 */
  uniqueOpened: true,
  /** 是否显示水印 */
  watermarkVisible: false,
};

/** 获取设置默认值 */
export function getSettingDefaults() {
  return { ...SETTING_DEFAULT_CONFIG };
}

/** 重置为默认设置 */
export function resetToDefaults(currentSettings: Record<string, any>) {
  const defaults = getSettingDefaults();
  Object.keys(defaults).forEach((key) => {
    if (key in currentSettings) {
      currentSettings[key] = defaults[key as keyof typeof defaults];
    }
  });
}
