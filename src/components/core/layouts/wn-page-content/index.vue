<!-- 布局内容 -->
<template>
  <div :style="containerStyle">
    <div id="app-content-header">
      <!-- 路由信息调试 -->
      <div
        v-if="isOpenRouteInfo === 'true'"
        class="px-2 py-1.5 mb-3 text-sm text-color-slate-500 bg-color-slate-200 border-full-d rounded-md"
      >
        router meta：{{ route.meta }}
      </div>
    </div>

    <RouterView
      v-if="isRefresh"
      #default="{ Component, route }"
      :style="contentStyle"
    >
      <!-- 缓存路由动画 -->
      <Transition
        :name="actualTransition"
        mode="out-in"
        appear
      >
        <KeepAlive
          :max="10"
          :exclude="keepAliveExclude"
        >
          <component
            class="Wn-page-view"
            :is="Component"
            :key="route.path"
            v-if="route.meta.keepAlive"
          />
        </KeepAlive>
      </Transition>

      <!-- 非缓存路由动画 -->
      <Transition
        :name="actualTransition"
        mode="out-in"
        appear
      >
        <component
          class="Wn-page-view"
          :is="Component"
          :key="route.path"
          v-if="!route.meta.keepAlive"
        />
      </Transition>
    </RouterView>
  </div>
</template>
<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { useRoute } from 'vue-router';
import { useAutoLayoutHeight } from '@/hooks/core/useLayoutHeight';
import { useSettingStore } from '@/store/modules/setting';
import { useWorktabStore } from '@/store/modules/worktab';

defineOptions({ name: 'ArtPageContent' });

const route = useRoute();
const { containerMinHeight } = useAutoLayoutHeight(
  ['app-header', 'app-content-header', 'app-footer'],
  {
    extraSpacing: 24,
  },
);
const { containerWidth, pageTransition, refresh } = storeToRefs(useSettingStore());
const { keepAliveExclude } = storeToRefs(useWorktabStore());

const isRefresh = shallowRef(true);
const isOpenRouteInfo = import.meta.env.VITE_OPEN_ROUTE_INFO;

// 标记是否是首次加载（浏览器刷新）
const isFirstLoad = ref(true);

// 切换动画名称：首次加载时不使用动画
const actualTransition = computed(() => {
  if (isFirstLoad.value) {
    return '';
  }
  return pageTransition.value;
});

const containerStyle = computed(
  (): CSSProperties => ({
    maxWidth: containerWidth.value,
    height: route.meta.fixedHeight ? '100%' : 'auto',
  }),
);

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

// 组件挂载后标记首次加载完成
onMounted(() => {
  // 延迟一帧，确保首次渲染完成
  nextTick(() => {
    isFirstLoad.value = false;
  });
});
</script>