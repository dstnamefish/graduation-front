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

const isLocalIcon = computed(() => !!props.icon && props.icon.startsWith('local-'));

const localIconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size;

  if (!props.icon) return {};

  const name = props.icon.replace('local-', '');
  const path = `/src/assets/svg/${name}.svg`;

  const style: any = {
    'display': 'inline-block',
    'vertical-align': 'middle',
    'height': size,
    'width': size,
    'backgroundColor': props.color || 'currentColor',
    'maskImage': `url(${path})`,
    'maskRepeat': 'no-repeat',
    'maskPosition': 'center',
    'maskSize': 'contain',
    '-webkit-mask-image': `url(${path})`,
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
