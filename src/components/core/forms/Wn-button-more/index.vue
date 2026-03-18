<!-- 更多按钮组件：下拉菜单式按钮，支持权限控制和动态菜单项 -->
<template>
  <div>
    <ElDropdown v-if="hasAnyAuthItem">
      <WnIconButton icon="ri:more-2-fill" class="size-8! bg-color-slate-200 dark:bg-color-slate-300/45 text-sm" />
      <template #dropdown>
        <ElDropdownMenu>
          <template v-for="item in list" :key="item.key">
            <ElDropdownItem v-if="!item.auth || hasAuth(item.auth)" :disabled="item.disabled" @click="handleClick(item)">
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
defineOptions({ name: 'WnButtonMore' });

const { hasAuth } = useAuth();

/** 更多按钮项接口 */
export interface ButtonMoreItem {
  key: string | number;
  label: string;
  disabled?: boolean;
  auth?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
}

/** 更多按钮组件属性 */
interface Props {
  list: ButtonMoreItem[];
  auth?: string;
}

const props = withDefaults(defineProps<Props>(), {});

/** 检查是否有任何有权限的 item */
const hasAnyAuthItem = computed(() => {
  return props.list.some((item) => !item.auth || hasAuth(item.auth));
});

const emit = defineEmits<{
  (e: 'click', item: ButtonMoreItem): void;
}>();

const handleClick = (item: ButtonMoreItem) => {
  emit('click', item);
};
</script>
