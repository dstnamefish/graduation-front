<!-- 表单组件：动态表单生成器，支持多种表单控件、校验、响应式布局 -->
<template>
  <section class="px-0 pb-0 pt-4 md:px-0 md:pt-4">
    <ElForm ref="formRef" :model="modelValue" :rules="mergedRules" :label-position="labelPosition" :validate-on-rule-change="false" v-bind="{ ...$attrs }">
      <ElRow class="flex flex-wrap" :gutter="gutter">
        <ElCol v-for="item in visibleFormItems" :key="item.key" :xs="getColSpan(item.span, 'xs')" :sm="getColSpan(item.span, 'sm')" :md="getColSpan(item.span, 'md')" :lg="getColSpan(item.span, 'lg')" :xl="getColSpan(item.span, 'xl')">
          <ElFormItem :label="item.label" :prop="item.key" :label-width="item.label ? item.labelWidth || labelWidth : undefined">
            <slot :name="item.key" :item="item" :modelValue="modelValue">
              <component :is="getComponent(item)" v-model="modelValue[item.key]" v-bind="getProps(item)">
                <template v-if="item.type === 'select' && getProps(item)?.options">
                  <ElOption v-for="option in getProps(item).options" v-bind="option" :key="option.value" />
                </template>
                <template v-if="item.type === 'checkboxgroup' && getProps(item)?.options">
                  <ElCheckbox v-for="option in getProps(item).options" v-bind="option" :key="option.value" />
                </template>
                <template v-if="item.type === 'radiogroup' && getProps(item)?.options">
                  <ElRadio v-for="option in getProps(item).options" v-bind="option" :key="option.value" />
                </template>
                <template v-for="(slotFn, slotName) in getSlots(item)" :key="slotName" #[slotName]>
                  <component :is="slotFn" />
                </template>
              </component>
            </slot>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="24" :md="span" :lg="span" :xl="span" class="max-w-full flex-1">
          <div class="mb-3 flex-c flex-wrap justify-end md:flex-row md:items-stretch md:gap-2" :style="actionButtonsStyle">
            <div class="flex gap-2 md:justify-center">
              <ElButton v-if="showReset" class="reset-button" @click="handleReset" v-ripple>{{ t('table.form.reset') }}</ElButton>
              <ElButton v-if="showSubmit" type="primary" class="submit-button" @click="handleSubmit" v-ripple :disabled="disabledSubmit">{{ t('table.form.submit') }}</ElButton>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import type { Component } from 'vue';
import { h } from 'vue';
import { ElCascader, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElInput, ElInputTag, ElInputNumber, ElRadioGroup, ElRate, ElSelect, ElSlider, ElSwitch, ElTimePicker, ElTimeSelect, ElTreeSelect, type FormInstance } from 'element-plus';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnDatePicker from '@/components/core/forms/Wn-date-picker/index.vue';
import WnDateRangePicker from '@/components/core/forms/Wn-date-range-picker/index.vue';
import { calculateResponsiveSpan, type ResponsiveBreakpoint } from '@/utils/form/responsive';

defineOptions({ name: 'WnForm' });

/** 组件类型映射 */
const componentMap = {
  input: ElInput,
  inputtag: ElInputTag,
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
  rate: ElRate,
  slider: ElSlider,
  cascader: ElCascader,
  timepicker: ElTimePicker,
  timeselect: ElTimeSelect,
  treeselect: ElTreeSelect,
  'shadcn-date': WnDatePicker,
  'shadcn-daterange': WnDateRangePicker,
};

/** 默认图标映射 */
const defaultIconMap: Record<string, string> = {
  input: 'cuida:search-outline',
  select: 'jam:filter',
  number: 'local-actions/hash',
  date: 'local-actions/calendar',
  daterange: 'local-actions/range',
  datetime: 'local-actions/clock',
  datetimerange: 'local-actions/clock',
  'shadcn-date': 'local-actions/calendar',
  'shadcn-daterange': 'local-actions/range',
  cascader: 'local-actions/filter',
  treeselect: 'local-actions/filter',
  timeselect: 'local-actions/clock',
  timepicker: 'local-actions/clock',
  switch: 'local-actions/toggle',
  checkbox: 'local-actions/check',
  radiogroup: 'local-actions/radio',
};

/** 需要自动添加 w-full 的组件类型 */
const fullWidthTypes = ['select', 'treeselect', 'cascader', 'date', 'datetime', 'daterange', 'datetimerange', 'shadcn-date', 'shadcn-daterange', 'timepicker', 'timeselect'];

const { width } = useWindowSize();
const { t } = useI18n();

/** 是否为移动端 */
const isMobile = computed(() => width.value < 500);
const formInstance = useTemplateRef<FormInstance>('formRef');

/** 表单项配置 */
export interface FormItem {
  key: string;
  label: string;
  labelWidth?: string | number;
  type?: keyof typeof componentMap | string;
  render?: (() => VNode) | Component;
  hidden?: boolean;
  span?: number;
  options?: Record<string, any>;
  props?: Record<string, any>;
  slots?: Record<string, (() => any) | undefined>;
  placeholder?: string;
  icon?: string;
  rules?: any[];
}

/** 表单配置 */
interface FormProps {
  items: FormItem[];
  span?: number;
  gutter?: number;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string | number;
  buttonLeftLimit?: number;
  showReset?: boolean;
  showSubmit?: boolean;
  disabledSubmit?: boolean;
  showDefaultIcons?: boolean;
  rules?: Record<string, any>;
}

const props = withDefaults(defineProps<FormProps>(), {
  items: () => [],
  span: 6,
  gutter: 12,
  labelPosition: 'right',
  labelWidth: '70px',
  buttonLeftLimit: 2,
  showReset: true,
  showSubmit: true,
  disabledSubmit: false,
  showDefaultIcons: false,
});

interface FormEmits {
  reset: [];
  submit: [];
}

const emit = defineEmits<FormEmits>();
const modelValue = defineModel<Record<string, any>>({ default: {} });

/** 需要从props中排除的属性 */
const rootProps = ['label', 'labelWidth', 'key', 'type', 'hidden', 'span', 'slots', 'icon'];

/** 获取组件props */
const getProps = (item: FormItem) => {
  const props = item.props ? { ...item.props } : { ...item };
  rootProps.forEach((key) => delete (props as Record<string, any>)[key]);

  if (item.type && fullWidthTypes.includes(item.type)) {
    const existingClass = (props as Record<string, any>).class || '';
    if (!existingClass.includes('w-full')) {
      (props as Record<string, any>).class = existingClass ? `${existingClass} w-full` : 'w-full';
    }
  }

  return props;
};

/** 获取图标 */
const getIconForItem = (item: FormItem) => {
  if (item.icon) return item.icon;
  if (item.type && item.type in defaultIconMap) {
    return defaultIconMap[item.type];
  }
  return null;
};

/** 获取插槽 */
const getSlots = (item: FormItem) => {
  const slots = item.slots || {};
  const validSlots: Record<string, () => any> = {};

  Object.entries(slots).forEach(([key, slotFn]) => {
    if (slotFn) validSlots[key] = slotFn;
  });

  if (props.showDefaultIcons && !validSlots.prefix) {
    const icon = getIconForItem(item);
    if (icon) {
      validSlots.prefix = () =>
        h('div', { class: 'flex-cc' }, [
          h(WnSvgIcon, {
            icon,
            size: 18,
          }),
        ]);
    }
  }

  return validSlots;
};

/** 获取组件 */
const getComponent = (item: FormItem) => {
  if (item.render) return item.render;
  const { type } = item;
  return componentMap[type as keyof typeof componentMap] || componentMap['input'];
};

/** 获取列宽 span 值 */
const getColSpan = (itemSpan: number | undefined, breakpoint: ResponsiveBreakpoint): number => {
  return calculateResponsiveSpan(itemSpan, span.value, breakpoint);
};

/** 可见的表单项 */
const visibleFormItems = computed(() => props.items.filter((item) => !item.hidden));

/** 合并校验规则 */
const mergedRules = computed(() => {
  const rules: Record<string, any> = { ...props.rules };
  props.items.forEach((item) => {
    if (item.rules) {
      rules[item.key] = item.rules;
    }
  });
  return rules;
});

/** 操作按钮样式 */
const actionButtonsStyle = computed(() => ({
  'justify-content': isMobile.value ? 'flex-end' : props.items.filter((item) => !item.hidden).length <= props.buttonLeftLimit ? 'flex-start' : 'flex-end',
}));

/** 处理重置事件 */
const handleReset = () => {
  formInstance.value?.resetFields();
  Object.assign(modelValue.value, Object.fromEntries(props.items.map(({ key }) => [key, undefined])));
  emit('reset');
};

/** 处理提交事件 */
const handleSubmit = () => {
  emit('submit');
};

defineExpose({
  ref: formInstance,
  validate: () => {
    return new Promise<boolean>((resolve) => {
      formInstance.value?.validate((valid) => {
        resolve(valid);
      });
    });
  },
  resetFields: () => formInstance.value?.resetFields(),
  clearValidate: (props?: string | string[]) => {
    if (props) {
      formInstance.value?.clearValidate(props);
    } else {
      formInstance.value?.clearValidate();
    }
  },
  reset: handleReset
});

const { span, gutter, labelPosition, labelWidth } = toRefs(props);
</script>

<style lang="scss" scoped>
/* 针对在使用 WnForm 并且显式传参指定了 .is-filterable-select 的组件进行修复 */
:deep(.el-select.is-filterable-select) {
  width: 100% !important;
}

:deep(.el-select.is-filterable-select .el-select__selection) {
  position: relative !important;
  width: 100% !important;
}

:deep(.el-select.is-filterable-select .el-select__placeholder) {
  position: absolute !important;
  top: 50% !important;
  left: 0 !important;
  right: 0 !important;
  transform: translateY(-50%) !important;
  pointer-events: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
