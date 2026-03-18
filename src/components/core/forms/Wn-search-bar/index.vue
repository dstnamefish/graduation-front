<!-- 搜索栏组件：行内表单搜索栏，支持多种表单控件和主题样式配置 -->
<template>
  <ElForm ref="formRef" :model="modelValue" :inline="true" :label-position="labelPosition" v-bind="{ ...$attrs }" class="flex flex-wrap items-center gap-2" :style="themeStyles">
    <ElFormItem v-for="item in visibleFormItems" :key="item.key" :label="item.label" :prop="item.key" :label-width="item.label ? item.labelWidth || labelWidth : undefined" class="mb-0! mr-0!">
      <slot :name="item.key" :item="item" :modelValue="modelValue">
        <component :is="getComponent(item)" v-model="modelValue[item.key]" v-bind="getProps(item)" :class="item.class" :style="item.background ? { '--background-color': item.background } : {}">
          <!-- 默认插槽内容：选项等 -->
          <template v-if="item.type === 'select' && getProps(item)?.options">
            <ElOption v-for="option in getProps(item).options" v-bind="option" :key="option.value" />
          </template>
          <template v-if="item.type === 'checkboxgroup' && getProps(item)?.options">
            <ElCheckbox v-for="option in getProps(item).options" v-bind="option" :key="option.value" />
          </template>
          <template v-if="item.type === 'radiogroup' && getProps(item)?.options">
            <ElRadio v-for="option in getProps(item).options" v-bind="option" :key="option.value" />
          </template>

          <!-- 动态插槽（如prefix、suffix等） -->
          <template v-for="(slotFn, slotName) in getSlots(item)" :key="slotName" #[slotName]>
            <component :is="slotFn" />
          </template>
        </component>
      </slot>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { ElCascader, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputTag, ElInputNumber, ElRadio, ElRadioGroup, ElRate, ElSelect, ElOption, ElSlider, ElSwitch, ElTimeSelect, ElTreeSelect, type FormInstance } from 'element-plus';
import WnDatePicker from '@/components/core/forms/Wn-date-picker/index.vue';
import WnDateRangePicker from '@/components/core/forms/Wn-date-range-picker/index.vue';

defineOptions({ name: 'WnSearchBar' });

/** 组件类型映射 */
const componentMap = {
  input: ElInput,
  inputTag: ElInputTag,
  number: ElInputNumber,
  select: ElSelect,
  switch: ElSwitch,
  checkbox: ElCheckbox,
  checkboxgroup: ElCheckboxGroup,
  radiogroup: ElRadioGroup,
  date: ElDatePicker,
  daterange: ElDatePicker,
  datetime: ElDatePicker,
  datetimerange: ElDatePicker,
  'shadcn-date': WnDatePicker,
  'shadcn-daterange': WnDateRangePicker,
  rate: ElRate,
  slider: ElSlider,
  cascader: ElCascader,
  timeselect: ElTimeSelect,
  treeselect: ElTreeSelect,
};

/** 默认图标映射 */
const defaultIconMap = {
  input: 'cuida:search-outline',      // 搜索框默认搜索图标
  select: 'jam:filter',               // 选择框默认筛选图标
  number: 'local-actions/hash',       // 数字输入框
  date: 'local-actions/calendar',     // 日期选择
  daterange: 'local-actions/range',   // 日期范围
  datetime: 'local-actions/clock',    // 日期时间
  datetimerange: 'local-actions/clock', // 日期时间范围
  cascader: 'local-actions/filter',   // 级联选择
  treeselect: 'local-actions/filter', // 树选择
  timeselect: 'local-actions/clock',  // 时间选择
  switch: 'local-actions/toggle',     // 开关
  checkbox: 'local-actions/check',    // 复选框
  radiogroup: 'local-actions/radio',  // 单选框
};

const formInstance = ref<FormInstance>();

/** 表单项配置 */
export interface SearchFormItem {
  key: string;
  label?: string;
  labelWidth?: string | number;
  type?: keyof typeof componentMap | string;
  render?: (() => VNode) | Component;
  hidden?: boolean;
  options?: Record<string, any>;
  props?: Record<string, any>;
  slots?: Record<string, (() => any) | undefined>;
  placeholder?: string;
  class?: string;
  background?: string;
  icon?: string;  // 自定义图标，优先级最高
}

/** 搜索栏配置 */
interface SearchBarProps {
  items: SearchFormItem[];
  searchBarBackground?: 'white' | 'soft' | 'gray';
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string | number;
  showDefaultIcons?: boolean; // 是否显示默认图标，全局控制
}

const props = withDefaults(defineProps<SearchBarProps>(), {
  items: () => [],
  searchBarBackground: 'gray',
  labelPosition: 'right',
  labelWidth: '70px',
  showDefaultIcons: true,
});

const modelValue = defineModel<Record<string, any>>({ default: {} });

/** 需要从props中排除的属性 */
const rootProps = ['label', 'labelWidth', 'key', 'type', 'hidden', 'slots', 'class', 'background', 'icon'];

/** 获取组件props */
const getProps = (item: SearchFormItem) => {
  if (item.props) return item.props;
  const props = { ...item };
  rootProps.forEach((key) => delete (props as Record<string, any>)[key]);
  return props;
};

/** 获取插槽 */
const getSlots = (item: SearchFormItem) => {
  const slots = item.slots || {};
  const validSlots: Record<string, () => any> = {};

  // 先处理用户自定义插槽
  Object.entries(slots).forEach(([key, slotFn]) => {
    if (slotFn) validSlots[key] = slotFn;
  });

  // 如果没有prefix插槽且需要显示图标，添加默认图标
  if (!validSlots.prefix && shouldShowIcon(item)) {
    const icon = getIconForItem(item);
    if (icon) {
      validSlots.prefix = () => h('div', { class: 'flex-cc' }, [
        h(WnSvgIcon, {
          icon,
          size: 18,
        })
      ]);
    }
  }

  return validSlots;
};

/** 判断是否应该显示图标 */
const shouldShowIcon = (item: SearchFormItem) => {
  // 如果全局关闭默认图标，不显示
  if (!props.showDefaultIcons) return false;

  // 如果item.type在默认图标映射中，或者有自定义图标，显示图标
  return !!item.type && (item.type in defaultIconMap || !!item.icon);
};

/** 获取图标的最终值（优先级：自定义图标 > 类型默认图标 > 无图标） */
const getIconForItem = (item: SearchFormItem) => {
  // 1. 优先使用自定义图标
  if (item.icon) return item.icon;

  // 2. 使用类型默认图标
  if (item.type && item.type in defaultIconMap) {
    return defaultIconMap[item.type as keyof typeof defaultIconMap];
  }

  return null;
};

/** 获取组件 */
const getComponent = (item: SearchFormItem) => {
  if (item.render) return item.render;
  const { type } = item;
  return componentMap[type as keyof typeof componentMap] || componentMap['input'];
};

/** 可见的表单项 */
const visibleFormItems = computed(() => props.items.filter((item) => !item.hidden));

/** 主题样式 */
const themeStyles = computed(() => {
  const bgMap = { white: 'var(--color-slate-50)', soft: 'var(--color-slate-80)', gray: 'var(--color-slate-100)' };
  const hoverMap = { white: 'var(--color-slate-100)', soft: 'var(--color-slate-100)', gray: 'var(--color-slate-200)' };
  return {
    '--background-color': bgMap[props.searchBarBackground] || bgMap.gray,
    '--background-color-hover': hoverMap[props.searchBarBackground] || hoverMap.gray,
    '--background-color-focus': '#ffffff',
  };
});

defineExpose({ ref: formInstance, validate: (...args: any[]) => formInstance.value?.validate(...args) });
</script>