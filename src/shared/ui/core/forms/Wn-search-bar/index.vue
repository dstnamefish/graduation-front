<!-- 表格搜索组件 - 行内版本 -->
<!-- 支持常用表单组件、自定义组件、插槽、校验、隐藏表单项 -->
<!-- 写法同 ElementPlus 官方文档组件，把属性写在 props 里面就可以了 -->
<template>
  <ElForm
    ref="formRef"
    :model="modelValue"
    :inline="true"
    :label-position="labelPosition"
    v-bind="{ ...$attrs }"
    class="flex flex-wrap items-center gap-2"
    :style="themeStyles"
  >
    <ElFormItem
      v-for="item in visibleFormItems"
      :key="item.key"
      :label="item.label"
      :prop="item.key"
      :label-width="item.label ? item.labelWidth || labelWidth : undefined"
      class="mb-0! mr-0!"
    >
      <slot
        :name="item.key"
        :item="item"
        :modelValue="modelValue"
      >
        <component
          :is="getComponent(item)"
          v-model="modelValue[item.key]"
          v-bind="getProps(item)"
          :class="item.class"
          :style="item.background ? { '--background-color': item.background } : {}"
        >
          <template v-if="item.type === 'select' && getProps(item)?.options">
            <ElOption
              v-for="option in getProps(item).options"
              v-bind="option"
              :key="option.value"
            />
          </template>
          <template v-if="item.type === 'checkboxgroup' && getProps(item)?.options">
            <ElCheckbox
              v-for="option in getProps(item).options"
              v-bind="option"
              :key="option.value"
            />
          </template>
          <template v-if="item.type === 'radiogroup' && getProps(item)?.options">
            <ElRadio
              v-for="option in getProps(item).options"
              v-bind="option"
              :key="option.value"
            />
          </template>
          <template
            v-for="(slotFn, slotName) in getSlots(item)"
            :key="slotName"
            #[slotName]
          >
            <component :is="slotFn" />
          </template>
        </component>
      </slot>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import { h, computed, ref } from 'vue';
import type { Component, VNode } from 'vue';
import WnSvgIcon from '@/shared/ui/core/base/Wn-svg-icon/index.vue';
import {
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputTag,
  ElInputNumber,
  ElRadio,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElOption,
  ElSlider,
  ElSwitch,
  ElTimeSelect,
  ElTreeSelect,
  type FormInstance,
} from 'element-plus';
import WnDatePicker from '@/shared/ui/core/forms/Wn-date-picker/index.vue';
import WnDateRangePicker from '@/shared/ui/core/forms/Wn-date-range-picker/index.vue';

defineOptions({ name: 'WnSearchBar' });

const componentMap = {
  input: ElInput, // 输入框
  inputTag: ElInputTag, // 标签输入框
  number: ElInputNumber, // 数字输入框
  select: ElSelect, // 选择器
  switch: ElSwitch, // 开关
  checkbox: ElCheckbox, // 复选框
  checkboxgroup: ElCheckboxGroup, // 复选框组
  radiogroup: ElRadioGroup, // 单选框组
  date: ElDatePicker, // 日期选择器
  daterange: ElDatePicker, // 日期范围选择器
  datetime: ElDatePicker, // 日期时间选择器
  datetimerange: ElDatePicker, // 日期时间范围选择器
  'shadcn-date': WnDatePicker, // 极简单选日期
  'shadcn-daterange': WnDateRangePicker, // 极简范围日期
  rate: ElRate, // 评分
  slider: ElSlider, // 滑块
  cascader: ElCascader, // 级联选择器
  timeselect: ElTimeSelect, // 时间选择
  treeselect: ElTreeSelect, // 树选择器
};

const formInstance = ref<FormInstance>();
/**
 * @description 表单项配置
 * @interface SearchFormItem
 * @property {string} key - 表单项的唯一标识
 * @property {string} label - 表单项的标签文本
 * @property {string | number} labelWidth - 表单项标签的宽度，会覆盖 Form 的 labelWidth
 * @property {keyof typeof componentMap | string} type - 表单项类型，支持预定义的组件类型
 * @property {(() => VNode) | Component} render - 自定义渲染函数或组件，用于渲染自定义组件（优先级高于 type）
 * @property {boolean} hidden - 是否隐藏该表单项
 * @property {Record<string, any>} options - 选项数据，用于 select、checkbox-group、radio-group 等
 * @property {Record<string, any>} props - 传递给表单项组件的属性
 * @property {Record<string, (() => any) | undefined>} slots - 表单项的插槽配置
 * @property {string} placeholder - 表单项的占位符文本
 */
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
  icon?: string;
}

/**
 * 表单配置
 * @description 表单配置
 * @interface SearchBarProps
 * @property {SearchFormItem[]} items - 表单项配置
 * @property {'left' | 'right' | 'top'} labelPosition - 表单域标签的位置
 * @property {string | number} labelWidth - 文字宽度
 */
interface SearchBarProps {
  items: SearchFormItem[];
  searchBarBackground?: 'white' | 'soft' | 'gray';
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string | number;
}

const props = withDefaults(defineProps<SearchBarProps>(), {
  items: () => [],
  searchBarBackground: 'gray',
  labelPosition: 'right',
  labelWidth: '70px',
});

const modelValue = defineModel<Record<string, any>>({ default: {} });

const rootProps = ['label', 'labelWidth', 'key', 'type', 'hidden', 'slots', 'class', 'background'];

const getProps = (item: SearchFormItem) => {
  if (item.props) return item.props;
  const props = { ...item };
  rootProps.forEach((key) => delete (props as Record<string, any>)[key]);
  return props;
};
// 获取插槽
const getSlots = (item: SearchFormItem) => {
  const slots = item.slots || {};
  const validSlots: Record<string, () => any> = {};

  // 处理显式定义的插槽
  Object.entries(slots).forEach(([key, slotFn]) => {
    if (slotFn) {
      validSlots[key] = slotFn;
    }
  });

  // 处理自定义 icon 属性 (优先级次于 slots.prefix)
  if (item.icon && !validSlots.prefix) {
    validSlots.prefix = () =>
      h('div', { class: 'flex-cc' }, [
        h(WnSvgIcon, { icon: item.icon, size: 18, class: 'text-slate-400' }),
      ]);
  }

  // 统一设置 select 类型的默认前缀图标
  if (item.type === 'select' && !validSlots.prefix) {
    validSlots.prefix = () =>
      h('div', { class: 'flex-cc' }, [
        h(WnSvgIcon, { icon: 'local-table/filter', size: 16, class: 'text-slate-400' }),
      ]);
  }

  return validSlots;
};

// 组件
const getComponent = (item: SearchFormItem) => {
  // 优先使用 render 函数或组件渲染自定义组件
  if (item.render) {
    return item.render;
  }
  // 使用 type 获取预定义组件
  const { type } = item;
  return componentMap[type as keyof typeof componentMap] || componentMap['input'];
};

/**
 * 可见的表单项
 */
const visibleFormItems = computed(() => {
  const filteredItems = props.items.filter((item) => !item.hidden);
  return filteredItems;
});

const themeStyles = computed(() => {
  const bgMap = {
    white: 'var(--color-slate-50)',
    soft: 'var(--color-slate-80)',
    gray: 'var(--color-slate-100)',
  };
  const hoverMap = {
    white: 'var(--color-slate-100)',
    soft: 'var(--color-slate-100)',
    gray: 'var(--color-slate-200)',
  };

  return {
    '--background-color': bgMap[props.searchBarBackground] || bgMap.gray,
    '--background-color-hover': hoverMap[props.searchBarBackground] || hoverMap.gray,
    '--background-color-focus': '#ffffff',
  };
});
defineExpose({
  ref: formInstance,
  validate: (...args: any[]) => formInstance.value?.validate(...args),
});
</script>
