<template>
  <div class="w-full h-screen overflow-hidden">
    <div class="flex flex-row h-full">
      <!-- 侧边栏 -->
      <aside
        class="shrink-0 transition-all duration-300 max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:z-30 max-lg:h-screen"
      >
        <WnSidebarMenu />
      </aside>

      <!-- 主体内容区域 -->
      <div class="relative flex flex-col flex-1 min-w-0">
        <!-- 顶部固定遮盖层 -->
        <header
          id="app-header"
          class="absolute top-0 left-0 right-0 z-[300] shrink-0 bg-white"
        >
          <WnHeaderBar />
        </header>

        <!-- 滚动容器 -->
        <main class="flex-1 overflow-y-auto overflow-x-hidden pt-20 pb-16">
          <WnPageContent class="h-full px-6 py-1 bg-surface" />
        </main>

        <!-- 底部固定遮盖层 -->
        <footer
          id="app-footer"
          class="absolute bottom-0 left-0 right-0 z-[300] shrink-0 bg-surface border-t border-slate-100/50"
        >
          <WnFooter />
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
defineOptions({ name: 'AppLayout' });

const route = useRoute();
</script>

<style scoped lang="scss">
/* 移动端/小屏幕适配 */
@media only screen and (width <= 800px) {
  :deep(.layout-content) {
    width: calc(100% - 40px);
  }
}

@media only screen and (width <= 640px) {
  :deep(.layout-content) {
    width: calc(100% - 30px);
  }
}
</style>
