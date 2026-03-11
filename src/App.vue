<template>
  <ElConfigProvider
    size="default"
    :locale="locales[language]"
    :zIndex="3000"
  >
    <RouterView #default="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { useUserStore } from '@/entities/user/model';
import zh from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import { storeToRefs } from 'pinia';
import { onBeforeMount, onMounted } from 'vue';
import { systemUpgrade } from '@/shared/lib/utils/sys';
import { toggleTransition } from '@/shared/lib/utils/ui/animation';
import { checkStorageCompatibility } from '@/shared/lib/utils/storage';

const userStore = useUserStore();
const { language } = storeToRefs(userStore);

const locales = {
  en: en,
  zh: zh,
};

onBeforeMount(() => {
  toggleTransition(true);
});

onMounted(() => {
  checkStorageCompatibility();
  toggleTransition(false);
  systemUpgrade();
});
</script>