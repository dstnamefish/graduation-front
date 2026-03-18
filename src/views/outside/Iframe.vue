<template>
  <div class="iframe-container" v-loading="isLoading">
    <iframe
      ref="iframeRef"
      :src="iframeUrl"
      frameborder="0"
      class="iframe-content"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { IframeRouteManager } from '@/router/core/IframeRouteManager';

const route = useRoute();
const isLoading = ref(true);
const iframeUrl = ref('');
const iframeRef = ref<HTMLIFrameElement | null>(null);

onMounted(() => {
  const iframeRoute = IframeRouteManager.getInstance().getAll().find((item: any) => item.path === route.path);

  if (iframeRoute?.meta) {
    iframeUrl.value = iframeRoute.meta.link || '';
  }
});

const handleIframeLoad = () => {
  isLoading.value = false;
};
</script>

<style scoped>
  .iframe-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .iframe-content {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 120px);
    border: none;
  }
</style>