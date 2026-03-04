<!-- 顶部栏 -->
<template>
  <header class="flex-cb h-20 w-full px-6 select-none bg-surface">
    <!-- 左侧区域 -->
    <div class="flex flex-1 items-center min-w-0 gap-4">
      <!-- 面包屑 -->
      <WnBreadcrumb v-if="shouldShowBreadcrumb && !isDetailPage" />
      <WnBackToBefore v-if="isDetailPage" />
      <!-- 全局搜索 -->
      <WnGlobalSearch
        v-if="shouldShowGlobalSearch"
        class="w-full sm:w-1/2 md:w-1/4 transition-all duration-300"
      />
    </div>

    <!-- 右侧区域 -->
    <div class="flex shrink-0 items-center gap-4">
      <!-- 通知 -->
      <WnNotification />
      <!-- 主题切换 -->
      <WnThemeToggle />
      <!-- 语言 -->
      <WnLanguage />
      <!-- 设置 -->
      <WnSetting />
      <!-- 用户信息、菜单 -->
      <WnUserMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { useWindowSize } from '@vueuse/core';
import { useSettingStore } from '@/store/modules/setting';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';

import { WEB_LINKS } from '@/utils/constants';
import { mittBus } from '@/utils/sys';
import { useHeaderBar } from '@/hooks/core/useHeaderBar';
import { HeaderBarFeatureConfig } from '@/types/config';

defineOptions({ name: 'WnHeaderBar' });

interface Props {
  config?: Partial<HeaderBarFeatureConfig>;
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
});

const headerBar = useHeaderBar(props.config);

// 直接使用配置
const { shouldShowBreadcrumb, shouldShowGlobalSearch } = headerBar;

// 原有的业务逻辑保持不变
const router = useRouter();
const { locale, t } = useI18n();
const { width } = useWindowSize();

const settingStore = useSettingStore();
const userStore = useUserStore();
const menuStore = useMenuStore();

const { showSettingGuide, systemThemeColor, tabStyle } = storeToRefs(settingStore);
const { getUserInfo: userInfo, language } = storeToRefs(userStore);
const { menuList } = storeToRefs(menuStore);

const showNotice = ref(false);
const notice = ref(null);
const userMenuPopover = ref();

// 检测操作系统类型
const isWindows = navigator.userAgent.includes('Windows');

// 暗色主题状态
const isDark = computed(() => settingStore.isDark);

// 详情页状态
const route = useRoute();
const isDetailPage = computed(() => !!route.meta.isDetail);

onMounted(() => {
  document.addEventListener('click', bodyCloseNotice);
});

onUnmounted(() => {});

// 原有的业务方法保持不变
const goPage = (path: string): void => {
  router.push(path);
};

const toDocs = (): void => {
  window.open(WEB_LINKS.DOCS);
};

const toGithub = (): void => {
  window.open(WEB_LINKS.GITHUB);
};

const loginOut = (): void => {
  closeUserMenu();
  setTimeout(() => {
    ElMessageBox.confirm(t('common.logOutTips'), t('common.tips'), {
      cancelButtonText: t('common.cancel'),
      confirmButtonText: t('common.confirm'),
      customClass: 'login-out-dialog',
    }).then(() => {
      userStore.logOut();
    });
  }, 200);
};

const bodyCloseNotice = (e: any): void => {
  let { className } = e.target;
  if (showNotice.value) {
    if (typeof className === 'object') {
      showNotice.value = false;
      return;
    }
    if (className.indexOf('notice-btn') === -1) {
      showNotice.value = false;
    }
  }
};

const visibleNotice = (): void => {
  showNotice.value = !showNotice.value;
};

const emitEvent = (eventName: string): void => {
  mittBus.emit(eventName);
};

const closeUserMenu = (): void => {
  setTimeout(() => {
    userMenuPopover.value.hide();
  }, 100);
};
</script>
