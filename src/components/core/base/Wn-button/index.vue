<!-- 基础按钮组件：基于Element Plus Button封装的增强版按钮，支持预设模式、图标、加载状态等 -->
<template>
  <ElButton
    v-bind="$attrs"
    :type="resolvedType"
    :loading="props.loading"
    :class="buttonClasses"
  >
    <div class="flex-cc gap-2">
      <WnSvgIcon
        v-if="props.loading"
        icon="solar:round-alt-arrow-right-bold-duotone"
        :size="props.iconSize"
        class="animate-spin"
      />
      <template v-else>
        <span v-if="shouldShowLabel && iconPosition === 'right'">
          <slot>{{ resolvedLabel }}</slot>
        </span>
        <WnSvgIcon
          v-if="shouldShowIcon"
          :icon="resolvedIcon"
          :size="props.iconSize"
          :class="iconColorClass"
        />
        <span v-if="shouldShowLabel && iconPosition === 'left'">
          <slot>{{ resolvedLabel }}</slot>
        </span>
      </template>
    </div>
  </ElButton>
</template>

<script setup lang="ts">
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import type { ButtonProps } from 'element-plus';

defineOptions({ name: 'WnButton', inheritAttrs: false });

type ButtonMode = 'add' | 'delete' | 'edit' | 'export' | 'search' | 'default';

interface WnButtonProps {
  mode?: ButtonMode; // 按钮模式，预定义了几种常用按钮的配置
  type?: ButtonProps['type']; // 挌钮类型，会覆盖mode中的默认type
  icon?: string; // 自定义图标，会覆盖mode中的默认图标
  label?: string; // 自定义文本，会覆盖mode中的默认文本
  iconSize?: number | string; // 图标尺寸，默认18
  loading?: boolean; // 加载状态
  premium?: boolean; // 是否启用高级样式
  showIcon?: boolean; // 是否显示图标，默认true
  iconPosition?: 'left' | 'right'; // 图标位置，默认left
}

// 按钮模式配置：每种模式预定义了type、icon、label
const MODE_CONFIGS: Record<ButtonMode, { type: ButtonProps['type']; icon: string; label: string }> =
  {
    add: { type: 'primary', icon: 'mingcute:add-line', label: 'Add New' },
    delete: { type: 'danger', icon: 'solar:trash-bin-trash-bold', label: 'Delete' },
    edit: { type: 'default', icon: 'solar:pen-new-square-bold', label: 'Edit' },
    export: { type: 'default', icon: 'solar:export-bold', label: 'Export' },
    search: { type: 'default', icon: 'local-actions/search', label: 'Search' },
    default: { type: 'default', icon: '', label: '' },
  };

const props = withDefaults(defineProps<WnButtonProps>(), {
  mode: 'default',
  type: undefined,
  iconSize: 18,
  premium: true,
  loading: false,
  showIcon: true,
  iconPosition: 'left',
});

const slots = useSlots();

// 根据mode获取当前配置
const config = computed(() => MODE_CONFIGS[props.mode] || MODE_CONFIGS.default);

// 最终使用的属性：props优先，其次使用mode配置
const resolvedType = computed(() => props.type ?? config.value.type);
const resolvedIcon = computed(() => props.icon || config.value.icon);
const resolvedLabel = computed(() => props.label || config.value.label);

// 是否显示图标和文本的判断
const shouldShowIcon = computed(() => props.showIcon && !!resolvedIcon.value);
const shouldShowLabel = computed(() => !!slots.default || !!resolvedLabel.value);

// 按钮样式类
const buttonClasses = computed(() => [
  `mode-${props.mode}`,
  { 'is-premium': props.premium, 'has-icon': !!resolvedIcon.value },
]);

// 图标颜色类：根据按钮类型决定图标颜色
const iconColorClass = computed(() => {
  const whiteIconTypes = ['primary', 'danger', 'success', 'warning'];
  return whiteIconTypes.includes(resolvedType.value || '')
    ? 'text-title-inverse'
    : 'text-slate-400';
});
</script>
