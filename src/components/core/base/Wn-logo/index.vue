<!-- 系统Logo组件：显示系统标志图片，支持自定义尺寸 -->
<template>
  <div class="flex-cc">
    <img :style="logoStyle" src="/favicon.svg" alt="logo" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WnLogo' });

interface Props {
  size?: number | string;  // Logo尺寸
}

const props = withDefaults(defineProps<Props>(), { size: 40 });

// Logo样式：根据size计算宽高
const logoStyle = computed(() => ({
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  width: typeof props.size === 'number' ? `${props.size}px` : props.size
}));
</script>
