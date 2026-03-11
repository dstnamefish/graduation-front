<template>
  <footer
    class="flex shrink-0 items-center justify-between px-5 py-4 text-[13px] text-gray-500 backdrop-blur-sm"
  >
    <div class="flex items-center">
      <span class="opacity-60">Copyright © {{ currentYear }} Peterdraw</span>
      <template
        v-for="(link, index) in pageLinks"
        :key="index"
      >
        <span class="mx-3 h-3 bg-gray-200"></span>
        <a
          href="#"
          class="transition-colors hover:text-primary"
        >
          {{ link }}
        </a>
      </template>
    </div>

    <div class="flex items-center space-x-4">
      <a
        v-for="social in socialLinks"
        :key="social"
        href="#"
        class="transition-colors hover:text-primary"
      >
        <WnSvgIcon
          :icon="social"
          :size="16"
        />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();

const pageLinks = ['Privacy Policy', 'Term and conditions', 'Contact'];

const socialLinks = [
  'local-footer/facebook',
  'local-footer/x',
  'local-footer/instagram',
  'local-footer/youtube',
  'local-footer/linkedin',
];
</script>
