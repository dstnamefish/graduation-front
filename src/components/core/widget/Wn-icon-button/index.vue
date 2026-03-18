<!-- 图标按钮组件：可点击的图标容器，支持圆形和自定义尺寸 -->
<template>
  <div class="h-10 w-10 inline-flex items-center justify-center 
    bg-field-muted! hover:bg-field-muted-hover! text-title rounded-xl! overflow-hidden c-p outline-none! select-none transition-all duration-300"
      :class="{ 'rounded-full!': props.circle }">
    <WnSvgIcon :icon="props.icon" :size="props.size" class="shrink-0" />
    <slot v-if="slots.default" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'WnIconButton' });

const slots = useSlots();

/** 图标按钮组件属性 */
interface Props {
  icon: string;
  size?: number | string;
  circle?: boolean;
}

const props = withDefaults(defineProps<Props>(), { size: 24 });
</script>
