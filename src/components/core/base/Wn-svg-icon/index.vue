<!-- 图标组件 -->
<template>
  <Icon
    v-if="icon"
    :icon="icon"
    :width="resolvedSize"
    :height="resolvedSize"
    v-bind="bindAttrs"
    class="inline-block"
  />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'WnSvgIcon', inheritAttrs: false });

interface Props {
  icon?: string;
  size?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
});

const attrs = useAttrs();

const resolvedSize = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`;
  }
  return props.size;
});

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}));
</script>