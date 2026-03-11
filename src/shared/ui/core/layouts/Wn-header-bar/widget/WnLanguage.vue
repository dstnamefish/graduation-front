<!-- 国际化组件 -->
<template>
  <div>
    <ElDropdown
      trigger="hover"
      @command="changeLanguage"
    >
      <WnIconButton
        icon="local-user/language"
        class="[&_.local-svg]:hover:rotate-180 [&_.local-svg]:transition-transform [&_.local-svg]:duration-700"
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
                icon="local-common/tick"
                class="text-color-text-main!"
              />
            </div>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useCommon } from '@/shared/lib/hooks/core/useCommon';
import { LanguageEnum } from '@/shared/config/enums/appEnum';
import { languageOptions } from '@/locales';
import { useUserStore } from '@/entities/user/model';

defineOptions({ name: 'WnLanguage' });

const { locale } = useI18n();
const userStore = useUserStore();

// 使用 storeToRefs 获取响应式状态
const { language } = storeToRefs(userStore);

onMounted(() => {
  initLanguage();
});

const initLanguage = (): void => {
  locale.value = language.value;
};

const reload = (time: number = 0): void => {
  setTimeout(() => {
    useCommon().refresh();
  }, time);
};

const changeLanguage = (lang: LanguageEnum): void => {
  if (locale.value === lang) {
    return;
  }
  locale.value = lang;
  userStore.setLanguage(lang);
  reload(50);
};
</script>
