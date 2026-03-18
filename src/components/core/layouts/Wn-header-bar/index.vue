<!-- 顶部栏组件：包含面包屑导航、全局搜索、通知、主题切换、语言切换、设置和用户菜单 -->
<template>
  <header class="flex-cb h-20 w-full px-6 select-none bg-surface">
    <div class="flex flex-1 items-center min-w-0 gap-4">
      <WnBreadcrumb v-if="shouldShowBreadcrumb && !isDetailPage" />
      <WnBackToBefore v-if="isDetailPage" />
      <WnGlobalSearch
        v-if="shouldShowGlobalSearch"
        class="w-full sm:w-1/2 md:w-1/4 transition-all duration-300"
      />
    </div>
    <div class="flex shrink-0 items-center gap-4">
      <!-- 通知按钮 -->
      <WnIconButton
        icon="tdesign:notification"
        @click="handleOpenNotification"
      />
      <!-- 主题切换按钮 -->
      <WnIconButton
        :icon="isDark ? 'uil:sun' : 'iconamoon:mode-dark-bold'"
        @click="handleToggleTheme"
      />
      <!-- 语言切换下拉菜单 -->
      <ElDropdown
        trigger="hover"
        @command="handleChangeLanguage"
      >
        <WnIconButton
          icon="meteor-icons:language"
        />
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="item in languageOptions"
              :key="item.value"
              :command="item.value"
              :class="{ 'is-active': locale === item.value }"
            >
              <div class="flex-cb w-full gap-2">
                <span class="text-sm">{{ item.label }}</span>
                <WnSvgIcon
                  v-if="locale === item.value"
                  icon="charm:tick"
                  class="text-color-text-main!"
                />
              </div>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <!-- 设置按钮 -->
      <WnIconButton
        icon="icon-park-outline:setting-two"
        @click="handleOpenSetting"
      />
      <!-- 用户菜单 -->
      <WnUserMenu />
    </div>
  </header>
</template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useWindowSize } from '@vueuse/core';
import { useSettingStore } from '@/store/setting';
import { useUserStore } from '@/types/api/user.model';
import { HeaderBarFeatureConfig } from '@/types/config';
import { LanguageEnum } from '@/enums/appEnum';
import { languageOptions } from '@/locales';
import { resetRouterState } from '@/router/guards/beforeEach';
import mittBus from '@/utils/sys/mittBus';
import { themeAnimation } from '@/utils/ui/animation';
import { useCommon } from '@/hooks/core/useCommon';
import { useHeaderBar } from '@/hooks/core/useHeaderBar';

defineOptions({ name: 'WnHeaderBar' });

/** 顶部栏配置 */
interface Props {
  config?: Partial<HeaderBarFeatureConfig>;
}

const props = withDefaults(defineProps<Props>(), { config: () => ({}) });

const headerBar = useHeaderBar();

/** 是否显示面包屑和全局搜索 */
const { shouldShowBreadcrumb, shouldShowGlobalSearch } = headerBar;

const router = useRouter();
const route = useRoute();
const { locale, t } = useI18n();
const { width } = useWindowSize();

const settingStore = useSettingStore();
const userStore = useUserStore();

const { language } = storeToRefs(userStore);

/** 是否为暗色主题 */
const isDark = computed(() => settingStore.isDark);

/** 是否为详情页 */
const isDetailPage = computed(() => !!route.meta.isDetail);

/** 打开通知面板 */
const handleOpenNotification = () => {
  return 0;
};

/** 打开设置面板 */
const handleOpenSetting = () => {
  mittBus.emit('openSetting');
};

/** 切换主题 */
const handleToggleTheme = (e: MouseEvent) => {
  themeAnimation(e);
};

/** 初始化语言 */
const initLanguage = (): void => {
  locale.value = language.value;
  localStorage.setItem('language', language.value);
};

/** 刷新页面 */
const reload = (time: number = 0): void => {
  setTimeout(() => {
    useCommon().refresh();
  }, time);
};

/** 切换语言 */
const handleChangeLanguage = async (lang: LanguageEnum): Promise<void> => {
  if (locale.value === lang) return;
  locale.value = lang;
  userStore.setLanguage(lang);
  localStorage.setItem('language', lang);
  resetRouterState();
  await router.replace({ path: route.fullPath, force: true });
  reload(50);
};

onMounted(() => {
  initLanguage();
});

watch(language, (newLang) => {
  localStorage.setItem('language', newLang);
});
</script>