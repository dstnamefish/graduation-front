<!-- 页面内容组件：路由视图容器，支持路由缓存、过渡动画和页面刷新 -->
<template>
  <div :style="containerStyle">
    <div id="app-content-header">
      <div v-if="isOpenRouteInfo === 'true'" class="px-2 py-1.5 mb-3 text-sm text-color-slate-500 bg-color-slate-200 border-full-d rounded-md">
        router meta：{{ route.meta }}
      </div>
    </div>
    <RouterView v-if="isRefresh" #default="{ Component, route }" :style="contentStyle">
      <Transition :name="actualTransition" mode="out-in" appear>
        <KeepAlive :max="10" :exclude="keepAliveExclude">
          <component class="Wn-page-view" :is="Component" :key="route.path" v-if="route.meta.keepAlive" />
        </KeepAlive>
      </Transition>
      <Transition :name="actualTransition" mode="out-in" appear>
        <component class="Wn-page-view" :is="Component" :key="route.path" v-if="!route.meta.keepAlive" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingStore } from '@/store/setting';
import { useWorktabStore } from '@/store/worktab';

defineOptions({ name: 'ArtPageContent' });

const route = useRoute();
const { containerMinHeight } = useAutoLayoutHeight(['app-header', 'app-content-header', 'app-footer'], { extraSpacing: 24 });
const { containerWidth, pageTransition, refresh } = storeToRefs(useSettingStore());
const { keepAliveExclude } = storeToRefs(useWorktabStore());

const isRefresh = shallowRef(true);
const isOpenRouteInfo = import.meta.env.VITE_OPEN_ROUTE_INFO;

/** 是否首次加载 */
const isFirstLoad = ref(true);

/** 实际过渡动画名称：首次加载时不使用动画 */
const actualTransition = computed(() => {
  if (isFirstLoad.value) return '';
  return pageTransition.value;
});

/** 容器样式 */
const containerStyle = computed(
  (): CSSProperties => ({
    maxWidth: containerWidth.value,
    height: route.meta.fixedHeight ? '100%' : 'auto',
  }),
);

/** 内容样式 */
const contentStyle = computed((): CSSProperties => {
  const isFixed = !!route.meta.fixedHeight;
  return {
    [isFixed ? 'height' : 'minHeight']: containerMinHeight.value,
    overflow: isFixed ? 'hidden' : 'visible',
  };
});

const reload = () => {
  isRefresh.value = false;
  nextTick(() => {
    isRefresh.value = true;
  });
};

watch(refresh, reload, { flush: 'post' });

onMounted(() => {
  nextTick(() => {
    isFirstLoad.value = false;
  });
});
</script>
