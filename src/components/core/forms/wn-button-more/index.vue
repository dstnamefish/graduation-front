<!-- 更多按钮 -->
<template>
  <div>
    <ElDropdown v-if="hasAnyAuthItem">
      <WnIconButton icon="ri:more-2-fill" class="size-8! bg-g-200 dark:bg-g-300/45 text-sm" />
      <template #dropdown>
        <ElDropdownMenu>
          <template v-for="item in list" :key="item.key">
            <ElDropdownItem
              v-if="!item.auth || hasAuth(item.auth)"
              :disabled="item.disabled"
              @click="handleClick(item)"
            >
              <div class="flex-c gap-2" :style="{ color: item.color }">
                <WnSvgIcon v-if="item.icon" :icon="item.icon" />
                <span>{{ item.label }}</span>
              </div>
            </ElDropdownItem>
          </template>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/hooks/core/useAuth';

defineOptions({ name: 'WnButtonMore' });

const { hasAuth } = useAuth();

/**
 * 更多按钮项接口
 * 用于定义更多按钮的每个下拉项的属性。
 * 每个项可以有自己的权限、图标、文本颜色等。
 * @interface ButtonMoreItem
 * @property {string | number} key - 按钮标识，可用于点击事件
 * @property {string} label - 按钮文本
 * @property {boolean} [disabled=false] - 是否禁用
 * @property {string} [auth] - 权限标识
 * @property {string} [icon] - 图标组件
 * @property {string} [color] - 文本颜色
 * @property {string} [iconColor] - 图标颜色（优先级高于 color）
 */
export interface ButtonMoreItem {
  key: string | number
  label: string
  disabled?: boolean
  auth?: string
  icon?: string
  color?: string
  iconColor?: string
}

/**
 * 更多按钮组件属性接口
 * 定义更多按钮组件的属性，包括下拉项列表和整体权限控制。
 * @interface Props
 * @property {ButtonMoreItem[]} list - 下拉项列表，每个项包含权限、图标、文本等属性
 * @property {string} [auth] - 整体权限控制，用于检查是否显示更多按钮
 */
interface Props {
  list: ButtonMoreItem[]
  auth?: string
}

const props = withDefaults(defineProps<Props>(), {});

// 检查是否有任何有权限的 item
const hasAnyAuthItem = computed(() => {
  return props.list.some((item) => !item.auth || hasAuth(item.auth));
});

const emit = defineEmits<{
    (e: 'click', item: ButtonMoreItem): void
  }>();

const handleClick = (item: ButtonMoreItem) => {
  emit('click', item);
};
</script>