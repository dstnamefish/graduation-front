<!-- 面包屑导航组件：显示当前页面的路由层级，支持点击跳转 -->
<template>
  <nav class="max-lg:hidden!" aria-label="breadcrumb">
    <ul class="flex items-center h-full">
      <li v-for="(item, index) in breadcrumbItems" :key="item.path" class="flex items-center">
        <div :class="isClickable(item, index) ? 'c-p py-1 px-2 rounded-md hover:bg-color-slate-100 transition-colors group' : ''" @click="handleBreadcrumbClick(item, index)">
          <span :class="['text-xl font-extrabold block tracking-tight transition-colors ', isLastItem(index) ? ' text-color-text-main' : 'text-color-text-sub group-hover:text-color-text-body']">
            {{ formatMenuTitle(item.meta?.title as string) }}
          </span>
        </div>
        <div v-if="!isLastItem(index) && item.meta?.title" class="mx-2 text-xl font-extrabold text-color-text-muted" aria-hidden="true">/</div>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter, type RouteRecordRaw, type RouteLocationMatched } from 'vue-router';
import { formatMenuTitle } from '@/utils/router';

defineOptions({ name: 'WnBreadcrumb' });

export interface BreadcrumbItem {
  path: string;
  meta: RouteRecordRaw['meta'];
}

const route = useRoute();
const router = useRouter();

/** 面包屑项目列表 */
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const { matched } = route;
  const matchedLength = matched.length;
  if (!matchedLength || isHomeRoute(matched[0])) return [];
  const firstRoute = matched[0];
  const isFirstLevel = firstRoute.meta?.isFirstLevel;
  const lastIndex = matchedLength - 1;
  const currentRoute = matched[lastIndex];
  const currentRouteMeta = currentRoute.meta;
  let items = isFirstLevel ? [createBreadcrumbItem(currentRoute)] : matched.map(createBreadcrumbItem);
  if (items.length > 1 && isWrapperContainer(items[0])) items = items.slice(1);
  if (currentRouteMeta?.isIframe && (items.length === 1 || items.every(isWrapperContainer))) return [createBreadcrumbItem(currentRoute)];
  return items;
});

/** 判断是否为包裹容器路由 */
const isWrapperContainer = (item: BreadcrumbItem): boolean => item.path === '/outside' && !!item.meta?.isIframe;

/** 创建面包屑项目 */
const createBreadcrumbItem = (route: RouteLocationMatched): BreadcrumbItem => ({ meta: route.meta, path: route.path });

/** 判断是否为首页 */
const isHomeRoute = (route: RouteLocationMatched): boolean => route.name === '/';

/** 判断是否为最后一项 */
const isLastItem = (index: number): boolean => index === breadcrumbItems.value.length - 1;

/** 判断是否可点击 */
const isClickable = (item: BreadcrumbItem, index: number): boolean => item.path !== '/outside' && !isLastItem(index);

/** 查找路由的第一个有效子路由 */
const findFirstValidChild = (route: RouteRecordRaw) => route.children?.find((child) => !child.redirect && !child.meta?.isHide);

/** 构建完整路径 */
const buildFullPath = (childPath: string): string => `/${childPath}`.replace('//', '/');

/** 处理面包屑点击事件 */
async function handleBreadcrumbClick(item: BreadcrumbItem, index: number): Promise<void> {
  if (isLastItem(index) || item.path === '/outside') return;
  try {
    const routes = router.getRoutes();
    const targetRoute = routes.find((route) => route.path === item.path);
    if (!targetRoute?.children?.length) {
      await router.push(item.path);
      return;
    }
    const firstValidChild = findFirstValidChild(targetRoute);
    if (firstValidChild) await router.push(buildFullPath(firstValidChild.path));
    else await router.push(item.path);
  } catch (error) {
    console.error('导航失败:', error);
  }
}
</script>
