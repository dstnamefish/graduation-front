<!-- 返回上一页组件：显示当前页面标题并提供返回上一级或指定页面的功能 -->
<template>
  <div class="flex items-center gap-4">
    <WnIconButton @click="handleBack" icon="local-directions/chevron-left" />
    <div class="flex flex-col">
      <span class="text-[10px] text-slate-950 mb-0.5 tracking-wide">{{ backText }}</span>
      <h1 class="text-xl font-extrabold text-slate-950">{{ currentTitle }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatMenuTitle } from '@/utils/router';

defineOptions({ name: 'WnBackToBefore' });

const router = useRouter();
const route = useRoute();

const handleBack = () => {
  if (route.meta.activePath) {
    router.push(route.meta.activePath as string);
  } else {
    router.back();
  }
};

/** 当前页面标题 */
const currentTitle = computed(() => {
  return formatMenuTitle(route.meta.title as string) || 'Details';
});

/** 返回按钮文本 */
const backText = computed(() => {
  const activePath = route.meta.activePath;
  if (!activePath) return 'Back';
  const routes = router.getRoutes();
  const parentRoute = routes.find((r: any) => r.path === activePath);
  if (parentRoute && parentRoute.meta?.title) {
    const parentTitle = formatMenuTitle(parentRoute.meta.title as string);
    return `Back to ${parentTitle} List`;
  }
  return 'Back to List';
});
</script>
