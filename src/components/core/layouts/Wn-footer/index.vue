<!-- 页脚组件：显示版权信息、页面链接和社交媒体图标 -->
<template>
  <footer class="flex shrink-0 items-center justify-between px-5 py-4 text-[13px] text-gray-500 backdrop-blur-sm">
    <div class="flex items-center">
      <span class="opacity-60">Copyright © {{ currentYear }} Peterdraw</span>
      <template v-for="(link, index) in pageLinks" :key="index">
        <span class="mx-3 h-3 bg-gray-200"></span>
        <a href="#" class="transition-colors hover:text-primary">{{ link }}</a>
      </template>
    </div>
    <div class="flex items-center space-x-4">
      <a v-for="social in socialLinks" :key="social" href="#" class="transition-colors hover:text-primary">
        <WnSvgIcon :icon="social" :size="16" />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
/** 当前年份 */
const currentYear = new Date().getFullYear();

/** 页面链接列表 */
const pageLinks = ['Privacy Policy', 'Term and conditions', 'Contact'];

/** 社交媒体图标列表 */
const socialLinks = ['local-social/facebook', 'local-social/x', 'local-social/instagram', 'local-social/youtube', 'local-social/linkedin'];
</script>
