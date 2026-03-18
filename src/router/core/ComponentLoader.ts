/**
 * 组件加载器 (ComponentLoader)
 *
 * 核心任务：将后台返回的「组件标识符」(如 "views/doctors/list", "Layout")
 * 映射并动态加载前端物理目录（src/views）下的 .vue 组件。
 *
 * @module router/core/ComponentLoader
 */
import { h, type Component } from 'vue';

export class ComponentLoader {
  private components = import.meta.glob(['/src/views/**/*.vue']);

  load(componentPath: string): () => Promise<Component> {
    if (!componentPath) return this.createEmptyComponent();

    if (componentPath.toLowerCase() === 'layout') {
      return this.loadLayout();
    }

    const paths = this.generatePossiblePaths(componentPath);

    for (const path of paths) {
      if (this.components[path]) {
        return this.components[path] as () => Promise<Component>;
      }
    }

    console.error(
      `[ComponentLoader] 加载失败! 物理文件不存在。
      原始标识: ${componentPath}
      尝试过的路径清单:`,
      paths,
    );

    return () => import('@/views/exception/404/index.vue');
  }

  private generatePossiblePaths(componentPath: string): string[] {
    const paths: string[] = [];

    let rawPath = componentPath.replace(/^\//, '').replace(/^views\//, '');

    const singularPath = rawPath.replace(/s\//g, '/').replace(/s$/, '');

    const segments = rawPath.split('/');
    const moduleKey = segments[0] || '';
    const featureName = this.mapToFeatureModule(moduleKey);

    [rawPath, singularPath].forEach(p => {
      paths.push(`/src/views/${p}.vue`);
      paths.push(`/src/views/${p}/index.vue`);
    });

    if (featureName) {
      const restPath = segments.slice(1).join('/');
      const singularRest = restPath.replace(/s\//g, '/').replace(/s$/, '');

      if (rawPath.includes('detail') || rawPath.includes('details')) {
        paths.push(`/src/views/${featureName}/detail/index.vue`);
        paths.push(`/src/views/${featureName}/details/index.vue`);
        paths.push(`/src/views/${singularPath}/detail/index.vue`);
        paths.push(`/src/views/${singularPath}/details/index.vue`);
      }

      paths.push(`/src/views/${featureName}/index.vue`);

      [rawPath, singularPath, restPath, singularRest].forEach(p => {
        if (!p || p === 'index') return;
        paths.push(`/src/views/${featureName}/${p}.vue`);
        paths.push(`/src/views/${featureName}/${p}/index.vue`);
      });

      paths.push(`/src/views/${featureName}/${moduleKey}/index.vue`);
      paths.push(`/src/views/${singularPath}/index.vue`);

      if (componentPath.startsWith('views/')) {
        const viewPath = componentPath.replace('views/', '');
        const viewSegments = viewPath.split('/');
        if (viewSegments.length >= 2) {
          const viewModule = viewSegments[0];
          const viewRest = viewSegments.slice(1).join('/');
          paths.push(`/src/views/${featureName}/${viewModule}/${viewRest}.vue`);
          paths.push(`/src/views/${featureName}/${viewModule}/${viewRest}/index.vue`);
          paths.push(`/src/views/${featureName}/${viewModule}/index.vue`);
        }
      }
    }

    paths.push(`/src/${rawPath}.vue`);
    paths.push(`/src/${rawPath}/index.vue`);

    return [...new Set(paths.filter(p => !p.includes('//')))];
  }

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

  loadLayout(): () => Promise<Component> {
    return () => import('@/views/index/index.vue');
  }

  loadIframe(): () => Promise<Component> {
    return () => import('@/views/outside/Iframe.vue');
  }

  private createEmptyComponent = () => () =>
    Promise.resolve({
      render: () => h('div'),
    });

  private createErrorComponent(path: string): () => Promise<Component> {
    return () => Promise.resolve({
      render() {
        return h('div', { class: 'route-error' }, `组件未找到: ${path}`);
      }
    });
  }
}
