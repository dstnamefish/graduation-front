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
      />

      <WnSvgIcon
        v-else-if="shouldShowIcon"
        :icon="resolvedIcon"
        :size="props.iconSize"
        :class="iconColorClass"
      />

      <span v-if="shouldShowLabel">
        <slot>{{ resolvedLabel }}</slot>
      </span>
    </div>
  </ElButton>
</template>

<script setup lang="ts">
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import type { ButtonProps } from 'element-plus';

defineOptions({ name: 'WnButton', inheritAttrs: false });

type ButtonMode = 'add' | 'delete' | 'edit' | 'export' | 'search' | 'default';

interface WnButtonProps {
  mode?: ButtonMode;
  type?: ButtonProps['type'];
  icon?: string;
  label?: string;
  iconSize?: number | string;
  loading?: boolean;
  premium?: boolean;
  showIcon?: boolean;
}

const MODE_CONFIGS: Record<ButtonMode, { type: ButtonProps['type']; icon: string; label: string }> = {
  add:    { type: 'primary', icon: 'local-common/add',           label: 'Add New' },
  delete: { type: 'danger',  icon: 'solar:trash-bin-trash-bold', label: 'Delete' },
  edit:   { type: 'default', icon: 'solar:pen-new-square-bold',  label: 'Edit' },
  export: { type: 'default', icon: 'solar:export-bold',          label: 'Export' },
  search: { type: 'default', icon: 'local-common/search',        label: 'Search' },
  default:{ type: 'default', icon: '',                           label: '' },
};


const props = withDefaults(defineProps<WnButtonProps>(), {
  mode: 'default',
  type: undefined,
  iconSize: 18,
  premium: true,
  loading: false,
  showIcon: true,
});

const slots = useSlots();

// 解析最终属性
const config = computed(() => MODE_CONFIGS[props.mode] || MODE_CONFIGS.default);

const resolvedType = computed(() => props.type ?? config.value.type);
const resolvedIcon = computed(() => props.icon || config.value.icon);
const resolvedLabel = computed(() => props.label || config.value.label);

// 状态判断
const shouldShowIcon = computed(() => props.showIcon && !!resolvedIcon.value);
const shouldShowLabel = computed(() => !!slots.default || !!resolvedLabel.value);

// 样式计算
const buttonClasses = computed(() => [
  `mode-${props.mode}`,
  {
    'is-premium': props.premium,
    'has-icon': !!resolvedIcon.value,
  }
]);

const iconColorClass = computed(() => {
  const whiteIconTypes = ['primary', 'danger', 'success', 'warning'];
  return whiteIconTypes.includes(resolvedType.value || '') ? 'text-title-inverse' : 'text-slate-400';
});
</script>