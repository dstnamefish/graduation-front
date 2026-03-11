<!-- 侧边栏菜单 -->
<template>
  <div
    class="flex flex-col h-screen bg-sidebar overflow-hidden transition-all duration-300"
    v-if="showLeftMenu"
    :style="{ width: getMenuOpenWidth }"
  >
    <!-- 侧边栏logo -->
    <div
      class="flex-ic h-20 px-6 cursor-pointer select-none transition-opacity hover:opacity-80"
      @click="navigateToHome"
    >
      <WnLogo
        :size="28"
        class="mr-2.5"
      />
      <span class="text-xl font-extrabold tracking-tight text-color-slate-800">WellNest</span>
    </div>

    <!-- 侧边栏菜单 -->
    <div class="flex-1 overflow-hidden px-3">
      <ElScrollbar class="h-full">
        <ElMenu
          :defaultActive="routerPath"
          :uniqueOpened="uniqueOpened"
          :defaultOpeneds="defaultOpenedMenus"
        >
          <SidebarSubmenu
            :list="menuList"
            :isMobile="isMobileMode"
            :level="0"
            @close="handleMenuClose"
          />
        </ElMenu>
      </ElScrollbar>
    </div>

    <!-- 侧边栏用户信息 -->
    <div class="p-4 mt-auto">
      <div class="relative bg-secondary rounded-2xl p-5 overflow-hidden shadow-sm group">
        <div
          class="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"
        ></div>

        <div class="relative z-10">
          <div
            class="w-10 h-10 bg-primary/20 border border-primary/20 rounded-xl flex items-center justify-center mb-4"
          >
            <WnSvgIcon
              icon="lock"
              color="var(--Wn-primary)"
              :size="20"
            />
          </div>

          <h4 class="text-white text-[13px] font-bold leading-snug mb-1">Unlock New Features</h4>
          <p class="text-white/60 text-[11px] leading-relaxed mb-4">
            & Maximize Your Hospital Management Efficiency
          </p>

          <div class="flex items-center justify-between">
            <button
              class="text-white/50 text-[10px] font-bold hover:text-white transition-colors uppercase tracking-wider"
            >
              What's New?
            </button>
            <button
              class="bg-white text-secondary text-[11px] font-bold py-2.5 px-5 rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-sm"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MenuTypeEnum } from '@/shared/config/enums/appEnum';
import { useMenuStore } from '@/app/store/menu';
import { useSettingStore } from '@/app/store/setting';

import SidebarSubmenu from './widget/SidebarSubmenu.vue';

defineOptions({ name: 'WnSidebarMenu' });

const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();

const { getMenuOpenWidth, menuType, uniqueOpened } = storeToRefs(settingStore);

const defaultOpenedMenus = ref<string[]>([]);
const isMobileMode = ref(false);
const currentScreenWidth = ref(0);

const showLeftMenu = computed(
  () => menuType.value === MenuTypeEnum.LEFT || menuType.value === MenuTypeEnum.TOP_LEFT,
);

const routerPath = computed(() => String(route.meta.activePath || route.path));

const menuList = computed(() => {
  const menuStore = useMenuStore();
  const allMenus = menuStore.menuList;

  if (isIframe(route.path)) {
    return findIframeMenuList(route.path, allMenus);
  }

  return allMenus;
});

const findIframeMenuList = (currentPath: string, menuList: any[]) => {
  const hasPath = (items: any[]): boolean => {
    for (const item of items) {
      if (item.path === currentPath) {
        return true;
      }
      if (item.children && hasPath(item.children)) {
        return true;
      }
    }
    return false;
  };

  for (const menu of menuList) {
    if (menu.children && hasPath(menu.children)) {
      return menu.children;
    }
  }
  return [];
};

const navigateToHome = (): void => {
  router.push(useCommon().homePath.value);
};

const handleMenuClose = (): void => {};

const setupWindowResizeListener = (): void => {
  currentScreenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    currentScreenWidth.value = document.body.clientWidth;
  };
};

onMounted(() => {
  setupWindowResizeListener();
});
</script>
