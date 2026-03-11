/**
 * 顶部栏功能配置
 *
 * 统一管理顶部栏各个功能模块的启用状态。
 * 通过修改此配置文件可以快速启用或禁用顶部栏的功能按钮。
 *
 * @module config/headerBar
 * @author 16518
 */

import { HeaderBarFeatureConfig } from '@/types';

/**
 * 顶部栏功能配置对象
 */
export const headerBarConfig: HeaderBarFeatureConfig = {
  breadcrumb: {
    description: '面包屑导航，显示当前页面路径',
    enabled: true,
  },
  globalSearch: {
    description: '全局搜索功能，支持快捷键 Ctrl+K 或 Cmd+K',
    enabled: true,
  },
};

export default headerBarConfig;
