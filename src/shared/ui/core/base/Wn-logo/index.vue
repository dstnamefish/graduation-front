<!-- 系统logo -->
<template>
  <div class="flex-cc">
    <img :style="logoStyle" src="/favicon.svg" alt="logo"
class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WnLogo' });

interface Props {
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 36,
});

const logoStyle = computed(() => ({ width: `${props.size}px` }));
</script>