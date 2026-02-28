<template>
  <WnIconButton
    :icon="isDark ? 'local-user/light' : 'local-user/dark'"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingStore } from '@/store/modules/setting';
import { SystemThemeEnum } from '@/enums/appEnum';

defineOptions({ name: 'WnThemeToggle' });

const settingStore = useSettingStore();
const isDark = computed(() => settingStore.isDark);

const toggleTheme = () => {
  const newTheme = isDark.value ? SystemThemeEnum.LIGHT : SystemThemeEnum.DARK;
  settingStore.setGlopTheme(newTheme, newTheme);

  if (newTheme === SystemThemeEnum.DARK) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
</script>
