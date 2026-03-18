<!-- 侧边栏子菜单组件：递归渲染多级菜单，支持图标、徽章和外部链接 -->
<template>
  <template v-for="(item, idx) in filteredMenuItems" :key="getUniqueKey(item, idx)">
    <ElSubMenu v-if="hasChildren(item)" :index="item.path || item.meta.title" :level="level">
      <template #title>
        <div class="flex items-center w-full">
          <div class="flex-cc w-5 h-5 mr-2.5 shrink-0">
            <WnSvgIcon :icon="item.meta.icon" :size="18" />
          </div>
          <span class="text-sm">{{ formatMenuTitle(item.meta.title) }}</span>
          <div v-if="item.meta.showBadge" class="ml-2 w-1.5 h-1.5 bg-color-destructive rounded-full ring-2 ring-white" />
        </div>
      </template>
      <SidebarSubmenu :list="item.children" :isMobile="isMobile" :level="level + 1" :theme="theme" @close="closeMenu" />
    </ElSubMenu>
    <ElMenuItem v-else :index="isExternalLink(item) ? undefined : item.path || item.meta.title" @click="goPage(item)">
      <div class="flex-ic w-full">
        <div class="flex-cc w-5 h-5 mr-2.5 shrink-0">
          <WnSvgIcon :icon="item.meta.icon" :size="18" />
        </div>
        <span class="text-sm truncate">{{ formatMenuTitle(item.meta.title) }}</span>
        <div v-if="item.meta.showBadge" class="ml-auto w-5 h-5 rounded-full bg-color-destructive flex-cc text-[10px] text-white font-bold">{{ item.meta.badgeValue || '1' }}</div>
        <div v-if="item.meta.showTextBadge" class="ml-auto px-2 py-0.5 rounded bg-color-accent text-color-accent-foreground text-[10px] font-bold uppercase tracking-wider">{{ item.meta.showTextBadge }}</div>
      </div>
    </ElMenuItem>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { AppRouteRecord } from '@/types/router';
import { useSettingStore } from '@/store/setting';
import { formatMenuTitle } from '@/utils/router';
import { handleMenuJump } from '@/utils/navigation/jump';

interface MenuTheme {
  iconColor?: string;
}

interface Props {
  title?: string;
  list?: AppRouteRecord[];
  theme?: MenuTheme;
  isMobile?: boolean;
  level?: number;
}

interface Emits {
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), { isMobile: false, level: 0, list: () => [], theme: () => ({}), title: '' });

const emit = defineEmits<Emits>();
const settingStore = useSettingStore();
const { menuOpen } = storeToRefs(settingStore);

/** 过滤后的菜单项 */
const filteredMenuItems = computed(() => filterRoutes(props.list));

const goPage = (item: AppRouteRecord): void => {
  closeMenu();
  handleMenuJump(item);
};

const closeMenu = (): void => {
  emit('close');
};

/** 过滤路由 */
const filterRoutes = (items: AppRouteRecord[]): AppRouteRecord[] => {
  return items
    .filter((item) => {
      if (item.meta.isHide) return false;
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterRoutes(item.children);
        return filteredChildren.length > 0;
      }
      return true;
    })
    .map((item) => ({ ...item, children: item.children ? filterRoutes(item.children) : undefined }));
};

/** 是否有子菜单 */
const hasChildren = (item: AppRouteRecord): boolean => {
  if (!item.children || item.children.length === 0) return false;
  return filterRoutes(item.children).length > 0;
};

/** 是否为外部链接 */
const isExternalLink = (item: AppRouteRecord): boolean => {
  return !!(item.meta.link && !item.meta.isIframe);
};

/** 获取唯一键 */
const getUniqueKey = (item: AppRouteRecord, index: number): string => {
  return `${item.path || item.meta.title || 'menu'}-${props.level}-${index}`;
};
</script>
