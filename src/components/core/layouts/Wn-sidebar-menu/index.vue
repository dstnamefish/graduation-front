<!-- 侧边栏菜单组件：左侧导航菜单，支持折叠、多级菜单和徽章显示 -->
<template>
  <div
    class="relative flex flex-col h-screen bg-sidebar transition-[width] duration-300 z-50 ease-in-out"
    :class="menuOpen ? 'overflow-hidden' : 'overflow-visible'"
    v-if="showLeftMenu"
    :style="{ width: getMenuOpenWidth }"
  >
    <div
      class="flex-ic h-20 cursor-pointer select-none transition-all"
      :class="menuOpen ? 'px-6 justify-start' : 'justify-center'"
      @click="toggleSidebar"
    >
      <WnLogo
        :size="menuOpen ? 28 : 32"
        class="shrink-0"
        :class="menuOpen ? 'mr-2.5' : ''"
      />
      <span
        v-show="menuOpen"
        class="text-xl font-extrabold tracking-tight text-title whitespace-nowrap"
      >
        WellNest
      </span>
    </div>
    <div
      class="flex-1 w-full hide-scrollbar transition-all duration-300"
      :class="menuOpen ? 'px-4 overflow-y-auto overflow-x-hidden' : 'px-2.5 overflow-visible'"
    >
      <ul class="flex flex-col gap-1 w-full relative pb-4">
        <SidebarSubmenu
          :list="menuList"
          :isMobile="isMobileMode"
          :level="0"
          :collapsed="!menuOpen"
          @close="handleMenuClose"
        />
      </ul>
    </div>
    
    <div
      v-show="menuOpen"
      class="p-4 mt-auto"
    >
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
import { MenuTypeEnum } from '@/enums/appEnum';
import { useMenuStore } from '@/store/menu';
import { useSettingStore } from '@/store/setting';
import SidebarSubmenu from './widget/SidebarSubmenu.vue';

defineOptions({ name: 'WnSidebarMenu' });

const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();

const { getMenuOpenWidth, menuType, uniqueOpened, menuOpen } = storeToRefs(settingStore);

const defaultOpenedMenus = ref<string[]>([]);
const isMobileMode = ref(false);
const currentScreenWidth = ref(0);

/** 是否显示左侧菜单 */
const showLeftMenu = computed(
  () => menuType.value === MenuTypeEnum.LEFT || menuType.value === MenuTypeEnum.TOP_LEFT,
);

/** 当前路由路径 */
const routerPath = computed(() => String(route.meta.activePath || route.path));

/** 菜单列表 */
const menuList = computed(() => {
  const menuStore = useMenuStore();
  const allMenus = menuStore.menuList;
  if (isIframe(route.path)) return findIframeMenuList(route.path, allMenus);
  return allMenus;
});

/** 查找iframe菜单列表 */
const findIframeMenuList = (currentPath: string, menuList: any[]) => {
  const hasPath = (items: any[]): boolean => {
    for (const item of items) {
      if (item.path === currentPath) return true;
      if (item.children && hasPath(item.children)) return true;
    }
    return false;
  };
  for (const menu of menuList) {
    if (menu.children && hasPath(menu.children)) return menu.children;
  }
  return [];
};

/** 切换侧边栏展开/收缩 */
const toggleSidebar = (): void => {
  settingStore.toggleMenuOpen();
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
