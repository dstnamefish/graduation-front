<template>
  <WnIconButton
    :icon="isDark ? 'local-user/light' : 'local-user/dark'"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingStore } from '@/app/store/setting';

import { themeAnimation } from '@/shared/lib/utils/ui/animation';

defineOptions({ name: 'WnThemeToggle' });

const settingStore = useSettingStore();
const isDark = computed(() => settingStore.isDark);

const toggleTheme = (e: MouseEvent) => {
  themeAnimation(e);
};
</script>
