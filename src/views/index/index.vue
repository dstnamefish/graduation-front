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
      <div class="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <!-- 顶部栏：正常流 flex 子元素 -->
        <header
          id="app-header"
          class="shrink-0 z-10 bg-surface pr-2"
        >
          <WnHeaderBar />
        </header>

        <!-- 滚动容器：scrollbar-gutter 始终预留滚动条空间，确保与 header/footer 对齐 -->
        <main
          class="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
          style="scrollbar-gutter: stable"
        >
          <WnPageContent class="h-full px-6 py-1 bg-surface" />
        </main>

        <!-- 底部栏：正常流 flex 子元素 -->
        <footer
          id="app-footer"
          class="shrink-0 z-10 bg-surface border-t border-slate-100/50 pr-2"
        >
          <WnFooter />
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppLayout' });

const route = useRoute();
</script>