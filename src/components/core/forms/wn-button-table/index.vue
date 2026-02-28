<!-- 表格按钮 -->
<template>
  <div
    :class="[
      'inline-flex items-center justify-center min-w-8 h-8 px-2.5 mr-2.5 text-sm c-p rounded-md',
      buttonClass
    ]"
    :style="{ backgroundColor: props.buttonBgColor, color: props.iconColor }"
    @click="handleClick"
  >
    <WnSvgIcon :icon="iconContent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'WnButtonTable' });

/**
 * 表格按钮组件属性接口
 */
interface Props {
  type?: 'add' | 'edit' | 'delete' | 'more' | 'view'
  icon?: string
  iconClass?: string
  iconColor?: string
  buttonBgColor?: string
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{(e: 'click'): void}>();

// 默认按钮配置
const defaultButtons = {
  add: { class: 'bg-theme/12 text-theme', icon: 'ri:add-fill' },
  delete: { class: 'bg-error/12 text-error', icon: 'ri:delete-bin-5-line' },
  edit: { class: 'bg-secondary/12 text-secondary', icon: 'ri:pencil-line' },
  more: { class: '', icon: 'ri:more-2-fill' },
  view: { class: 'bg-info/12 text-info', icon: 'ri:eye-line' },
} as const;

// 获取图标内容
const iconContent = computed(() => {
  return props.icon || (props.type ? defaultButtons[props.type]?.icon : '') || '';
});

// 获取按钮样式类
const buttonClass = computed(() => {
  return props.iconClass || (props.type ? defaultButtons[props.type]?.class : '') || '';
});

const handleClick = () => {
  emit('click');
};
</script>