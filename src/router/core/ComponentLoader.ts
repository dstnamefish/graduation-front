/**
 * 组件加载器 (ComponentLoader)
 *
 * 核心任务：将后台返回的「组件标识符」(如 "views/doctors/list", "Layout")
 * 映射并动态加载前端物理目录（src/features 或 src/pages）下的 .vue 组件。
 *
 * @module router/core/ComponentLoader
 */
import { h, type Component } from 'vue';

export class ComponentLoader {
  // 静态全局扫描所有 Vue 组件，提升路径查找性能
  private components = import.meta.glob(['../../pages/**/*.vue', '../../features/**/*.vue']);

  /**
   * 按路径加载组件
   * @param componentPath 后端返回的组件路径或关键字
   */
  load(componentPath: string): () => Promise<Component> {
    if (!componentPath) return this.createEmptyComponent();

    // 0. 特殊处理布局容器关键字
    if (componentPath.toLowerCase() === 'layout') {
      return this.loadLayout();
    }

    // 1. 生成所有可能的物理路径组合
    const paths = this.generatePossiblePaths(componentPath);

    // 2. 遍历尝试匹配
    for (const path of paths) {
      if (this.components[path]) {
        return this.components[path] as () => Promise<Component>;
      }
    }

    // 3. 容错处理：打印详细的调试信息
    console.error(
      `[ComponentLoader] 加载失败! 物理文件不存在。
      原始标识: ${componentPath}
      尝试过的路径清单:`,
      paths,
    );

    return this.createErrorComponent(componentPath);
  }

  /**
   * 生成可能的物理组件路径 (极致鲁棒版)
   * 目标：兼容单复数冲突、多余的 views 前缀、以及 features/[mod]/views/[sub]/index.vue 的嵌套逻辑
   */
  private generatePossiblePaths(componentPath: string): string[] {
    const paths: string[] = [];

    // 1. 预处理：规范化路径
    let rawPath = componentPath.replace(/^\//, '').replace(/^views\//, '');

    // 处理常见的单复数映射 (针对文件名/文件夹名)
    const singularPath = rawPath.replace(/s\//g, '/').replace(/s$/, '');

    const segments = rawPath.split('/');
    const moduleKey = segments[0] || '';
    const featureName = this.mapToFeatureModule(moduleKey);

    // 2. 核心探测序列

    // A. 系统页面探测 (src/pages)
    [rawPath, singularPath].forEach(p => {
      paths.push(`../../pages/${p}.vue`);
      paths.push(`../../pages/${p}/index.vue`);
    });

    // B. 业务模块探测 (src/features)
    if (featureName) {
      // 获取除去模块名后的剩余路径
      const restPath = segments.slice(1).join('/');
      const singularRest = restPath.replace(/s\//g, '/').replace(/s$/, '');

      // 模式 1: 标准特性视图 (e.g. features/appointment/views/index.vue)
      paths.push(`../../features/${featureName}/views/index.vue`);

      // 模式 2: 带子路径的特性视图 (e.g. features/doctor/views/doctors/index.vue)
      [rawPath, singularPath, restPath, singularRest].forEach(p => {
        if (!p || p === 'index') return;
        paths.push(`../../features/${featureName}/views/${p}.vue`);
        paths.push(`../../features/${featureName}/views/${p}/index.vue`);
      });

      // 模式 2.1: 处理模块名与视图目录名相同的情况 (e.g. features/doctor/views/doctors/index.vue)
      paths.push(`../../features/${featureName}/views/${moduleKey}/index.vue`);
      paths.push(`../../features/${featureName}/views/${singularPath}/index.vue`);

      // 模式 2.2: 处理后端返回的 views/ 前缀路径 (e.g. views/doctors/list -> features/doctor/views/doctors/index.vue)
      if (componentPath.startsWith('views/')) {
        const viewPath = componentPath.replace('views/', '');
        const viewSegments = viewPath.split('/');
        if (viewSegments.length >= 2) {
          const viewModule = viewSegments[0];
          const viewRest = viewSegments.slice(1).join('/');
          paths.push(`../../features/${featureName}/views/${viewModule}/${viewRest}.vue`);
          paths.push(`../../features/${featureName}/views/${viewModule}/${viewRest}/index.vue`);
          paths.push(`../../features/${featureName}/views/${viewModule}/index.vue`);
        }
      }

      // 模式 3: 处理详情页路径 (e.g. features/doctor/views/doctors/detail/index.vue)
      if (rawPath.includes('detail') || rawPath.includes('details')) {
         // 处理 /doctors/detail 路径
         paths.push(`../../features/${featureName}/views/${moduleKey}/detail/index.vue`);
         paths.push(`../../features/${featureName}/views/${singularPath}/detail/index.vue`);
         paths.push(`../../features/${featureName}/views/doctors/detail/index.vue`);
         paths.push(`../../features/${featureName}/views/${moduleKey}/${rawPath.split('/')[1]}/index.vue`);
      }
    }

    // C. 历史降级探测 (src 根目录下)
    paths.push(`../../${rawPath}.vue`);
    paths.push(`../../${rawPath}/index.vue`);

    return [...new Set(paths.filter(p => !p.includes('//')))];
  }

  /**
   * 模块名转换：后端由于生成习惯路径往往是复数，前端 features 文件夹统一为单数
   */
  private mapToFeatureModule(moduleName: string): string {
    const mapping: Record<string, string> = {
      'appointments': 'appointment',
      'patients': 'patient',
      'doctors': 'doctor',
      'departments': 'department',
      'inventories': 'inventory',
      'payments': 'payment',
      'messages': 'message',
      'doctors-schedule': 'doctor',
      'settings': 'system',
    };
    return mapping[moduleName] || moduleName;
  }

  /**
   * 加载主布局容器
   */
  loadLayout(): () => Promise<Component> {
    return () => import('@/app/layouts/index/index.vue');
  }

  /**
   * 加载内嵌 iframe 页
   */
  loadIframe(): () => Promise<Component> {
    return () => import('@/pages/sys/outside/Iframe.vue');
  }

  /**
   * 创建空占位组件
   */
  private createEmptyComponent = () => () =>
    Promise.resolve({
      render: () => h('div'),
    });

  /**
   * 创建错误组件
   */
  private createErrorComponent(path: string): () => Promise<Component> {
    return () => Promise.resolve({
      render() {
        return h('div', { class: 'route-error' }, `组件未找到: ${path}`);
      }
    });
  }
}