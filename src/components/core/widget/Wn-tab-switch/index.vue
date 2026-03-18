<template>
  <div class="tab-group" :class="[`tab-group--${type}`]">
    <ElTabs
      v-model="activeValue"
      :type="tabType"
      :tab-position="tabPosition"
      @tab-change="handleChange"
    >
      <ElTabPane
        v-for="item in options"
        :key="item.value"
        :name="item.value"
        :label="item.label"
        :disabled="item.disabled"
      >
        <template #label>
          <div class="tab-label">
            <span>{{ item.label }}</span>
            <span
              v-if="item.count !== undefined"
              :class="{ 'ml-1': true }"
            >
              ({{ item.count }})
            </span>
          </div>
        </template>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface TabOption {
  /** 选项值 */
  value: string | number;
  /** 显示文本 */
  label: string;
  /** 数量（可选） */
  count?: number;
  /** 是否禁用 */
  disabled?: boolean;
}

type TabType = 'status' | 'time' | 'custom';
type TabStyle = 'card' | 'border-card' | '';

const props = withDefaults(defineProps<{
  /** 当前选中的值 */
  modelValue?: string | number;
  /** 选项卡数据 */
  options: TabOption[];
  /** 选项卡类型：status-状态标签（默认样式），time-时间标签（按钮样式） */
  type?: TabType;
  /** 自定义标签位置 */
  tabPosition?: 'top' | 'right' | 'bottom' | 'left';
  /** 是否显示边框 */
  bordered?: boolean;
}>(), {
  modelValue: '',
  type: 'status',
  tabPosition: 'top',
  bordered: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
}>();

// 根据类型决定 ElTabs 的样式
const tabType = computed(() => {
  if (props.type === 'time') {
    // 时间标签使用卡片样式，模拟按钮效果
    return props.bordered ? 'border-card' : 'card';
  }
  // 状态标签使用默认样式
  return '';
});

// 当前选中的值
const activeValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
    emit('change', val);
  }
});

// 处理切换
const handleChange = (value: string | number) => {
  // 已经通过 computed 的 set 触发了事件
  console.log('tab changed:', value);
};
</script>
