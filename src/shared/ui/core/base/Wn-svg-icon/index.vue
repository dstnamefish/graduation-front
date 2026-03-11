<template>
  <!-- 本地 SVG 图标渲染 -->
  <div
    v-if="isLocalIcon"
    class="Wn-svg-icon local-svg"
    v-bind="attrs"
    :style="localIconStyle"
  ></div>

  <!-- Iconify 图标渲染 -->
  <Icon
    v-else-if="props.icon"
    :icon="props.icon"
    v-bind="{ ...bindAttrs, ...attrs }"
    class="Wn-svg-icon inline"
    :style="iconifyStyle"
  />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({ inheritAttrs: false, name: 'WnSvgIcon' });

interface Props {
  icon?: string;
  size?: number | string;
  color?: string;
  isClickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  isClickable: true,
});

const attrs = useAttrs();

// 使用 Vite 的 glob 导入功能，自动获取所有 SVG 的运行时 URL
// { eager: true, as: 'url' } 确保我们拿到的是字符串路径而不是异步组件
const svgModules = import.meta.glob('/src/shared/assets/svg/**/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
});

const isLocalIcon = computed(() => !!props.icon && props.icon.startsWith('local-'));

const localIconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size;

  if (!props.icon) return {};

  const name = props.icon.replace('local-', '');
  // 匹配 glob 导入的键名
  const fullPath = `/src/shared/assets/svg/${name}.svg`;
  const iconUrl = svgModules[fullPath] as string;

  if (!iconUrl) {
    console.warn(`[WnSvgIcon] 本地图标未找到: ${fullPath}`);
    return {};
  }

  const style: any = {
    'display': 'inline-block',
    'vertical-align': 'middle',
    'height': size,
    'width': size,
    'backgroundColor': props.color || 'currentColor',
    'maskImage': `url("${iconUrl}")`,
    'maskRepeat': 'no-repeat',
    'maskPosition': 'center',
    'maskSize': 'contain',
    '-webkit-mask-image': `url("${iconUrl}")`,
    '-webkit-mask-repeat': 'no-repeat',
    '-webkit-mask-position': 'center',
    '-webkit-mask-size': 'contain',
    ...((attrs.style as any) || {}),
  };

  return style;
});

const iconifyStyle = computed(() => ({
  color: props.color || 'inherit',
  fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
}));

const bindAttrs = computed(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as any) || {},
}));
</script>
