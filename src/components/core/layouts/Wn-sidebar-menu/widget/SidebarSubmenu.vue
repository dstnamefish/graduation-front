<!-- 侧边栏子菜单组件：递归渲染多级菜单，支持图标、徽章和外部链接 -->
<template>
  <template v-for="(item, idx) in filteredMenuItems" :key="getUniqueKey(item, idx)">
    <li 
      class="flex flex-col gap-0.5 group relative rounded-xl transition-all duration-300 z-10"
      :class="[
        collapsed ? 'w-11 overflow-hidden hover:w-50 hover:bg-card hover:shadow-lg hover:z-50' : 'w-full'
      ]"
    >
      <button 
        class="peer flex w-full cursor-pointer items-center p-0 outline-none transition-all active:scale-95 border border-transparent text-left h-11 px-3"
        :class="[
          isActive(item) ? 'bg-accent-background rounded-xl' : 'bg-transparent hover:bg-action-hover rounded-xl'
        ]"
        @click="hasChildren(item) ? toggleSubmenu(item) : goPage(item)"
      >
        <div class="flex items-center justify-center shrink-0 transition-colors duration-300"
             :class="isActive(item) ? 'text-primary' : 'text-muted group-hover:text-sidebar-text'">
          <WnSvgIcon :icon="item.meta.icon" :size="24" />
        </div>
        
        <div class="flex flex-1 items-center justify-between font-medium whitespace-nowrap transition-colors duration-300 text-sm ml-2.5"
             :class="[
               isActive(item) ? 'text-primary font-semibold' : 'text-sidebar-text',
               collapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
             ]">
          <span class="truncate">{{ formatMenuTitle(item.meta.title) }}</span>
          
          <div class="flex items-center gap-1.5 shrink-0">
            <!-- 气泡徽章 (如果有) -->
            <div 
              v-if="item.meta.showBadge" 
              class="rounded-full bg-destructive flex-cc text-[10px] text-destructive-foreground font-bold transition-all duration-300 w-5 h-5"
            >
              {{ item.meta.badgeValue || '1' }}
            </div>
            
            <div 
              v-if="item.meta.showTextBadge" 
              class="rounded bg-accent text-accent-foreground font-bold uppercase tracking-wider px-2 py-0.5 text-[10px]"
            >
              {{ item.meta.showTextBadge }}
            </div>

            <!-- 父菜单展开箭头 -->
            <WnSvgIcon 
              v-if="hasChildren(item)"
              icon="lucide:chevron-down" 
              :size="16" 
              class="transition-transform duration-300 opacity-60"
              :class="isSubmenuOpen(item) ? 'rotate-180' : ''"
            />
          </div>
        </div>
      </button>

      <!-- 子菜单容器 -->
      <div 
        v-if="hasChildren(item)"
        class="grid overflow-hidden transition-all duration-500" 
        :style="{ gridTemplateRows: isSubmenuOpen(item) ? '1fr' : '0fr' }"
      >
        <div class="overflow-hidden">
          <ul class="flex flex-col gap-0.5 pl-6 py-0.5 border-l border-border ml-5 relative mt-1 mb-0.5">
            <SidebarSubmenu :list="item.children" :isMobile="isMobile" :level="level + 1" :theme="theme" :collapsed="collapsed" @close="closeMenu" />
          </ul>
        </div>
      </div>
    </li>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
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
  collapsed?: boolean;
}

interface Emits {
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), { collapsed: false, isMobile: false, level: 0, list: () => [], theme: () => ({}), title: '' });

const emit = defineEmits<Emits>();
const settingStore = useSettingStore();
const route = useRoute();

/** 判断是否为当前激活的菜单项 */
const isActive = (item: AppRouteRecord): boolean => {
  return route.path === item.path || route.meta.activePath === item.path;
};

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

// 子菜单状态管理 (仅在未折叠时才展示手风琴展开)
const openKeys = ref<Set<string>>(new Set());

const isSubmenuOpen = (item: AppRouteRecord) => {
  return openKeys.value.has(item.path || item.meta.title || '');
};

const toggleSubmenu = (item: AppRouteRecord) => {
  // 当在侧边栏折叠时点击它，也能触发外层侧边栏的完全展开，让交互更顺畅
  if (props.collapsed) {
    settingStore.toggleMenuOpen();
    // 强制把此菜单自动加入 openKeys
    openKeys.value.add(item.path || item.meta.title || '');
    return;
  }

  const key = item.path || item.meta.title || '';
  if (openKeys.value.has(key)) {
    openKeys.value.delete(key);
  } else {
    openKeys.value.add(key);
  }
};

// 页面加载或路由变化时自动展开包含激活路由的子菜单
const checkActiveOpen = () => {
  const checkHasActive = (items: AppRouteRecord[]): boolean => {
    return items.some(child => {
      if (isActive(child)) return true;
      if (child.children) return checkHasActive(child.children);
      return false;
    });
  };
  
  filteredMenuItems.value.forEach(item => {
    if (hasChildren(item) && item.children && checkHasActive(item.children)) {
      openKeys.value.add(item.path || item.meta.title || '');
    }
  });
};

watch(() => route.path, checkActiveOpen, { immediate: true });
</script>