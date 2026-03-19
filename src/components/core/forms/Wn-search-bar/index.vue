<template>
  <div class="flex items-center gap-2">
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

    <WnColumnSetting
      v-if="columnConfig"
      :columns="columnConfig"
      :icon="columnSettingIcon"
      :icon-size="columnSettingIconSize"
      :circle="columnSettingCircle"
      :storage-key="columnStorageKey"
      @change="handleColumnChange"
    />

    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
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
import WnDatePicker from '@/components/core/forms/Wn-date-picker/index.vue';
import WnDateRangePicker from '@/components/core/forms/Wn-date-range-picker/index.vue';
import WnColumnSetting from '@/components/core/forms/Wn-column-setting/index.vue';
import type { ColumnConfig } from '@/components/core/forms/Wn-column-setting/index.vue';

defineOptions({ name: 'WnSearchBar' });

const componentMap = {
  'input': ElInput,
  'inputTag': ElInputTag,
  'number': ElInputNumber,
  'select': ElSelect,
  'switch': ElSwitch,
  'checkbox': ElCheckbox,
  'checkboxgroup': ElCheckboxGroup,
  'radiogroup': ElRadioGroup,
  'date': ElDatePicker,
  'daterange': ElDatePicker,
  'datetime': ElDatePicker,
  'datetimerange': ElDatePicker,
  'shadcn-date': WnDatePicker,
  'shadcn-daterange': WnDateRangePicker,
  'rate': ElRate,
  'slider': ElSlider,
  'cascader': ElCascader,
  'timeselect': ElTimeSelect,
  'treeselect': ElTreeSelect,
};

const defaultIconMap = {
  input: 'cuida:search-outline',
  select: 'jam:filter',
  number: 'local-actions/hash',
  date: 'local-actions/calendar',
  daterange: 'local-actions/range',
  datetime: 'local-actions/clock',
  datetimerange: 'local-actions/clock',
  cascader: 'local-actions/filter',
  treeselect: 'local-actions/filter',
  timeselect: 'local-actions/clock',
  switch: 'local-actions/toggle',
  checkbox: 'local-actions/check',
  radiogroup: 'local-actions/radio',
};

const formInstance = ref<FormInstance>();

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

interface SearchBarProps {
  items: SearchFormItem[];
  searchBarBackground?: 'white' | 'soft' | 'gray';
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string | number;
  showDefaultIcons?: boolean;
  columnConfig?: ColumnConfig[];
  columnSettingIcon?: string;
  columnSettingIconSize?: number | string;
  columnSettingCircle?: boolean;
  columnStorageKey?: string;
}

const props = withDefaults(defineProps<SearchBarProps>(), {
  items: () => [],
  searchBarBackground: 'gray',
  labelPosition: 'right',
  labelWidth: '70px',
  showDefaultIcons: true,
  columnSettingIcon: 'solar:settings-linear',
  columnSettingIconSize: 20,
  columnSettingCircle: false,
});

const emit = defineEmits<{
  'column-change': [columns: ColumnConfig[]];
}>();

const modelValue = defineModel<Record<string, any>>({ default: {} });

const rootProps = [
  'label',
  'labelWidth',
  'key',
  'type',
  'hidden',
  'slots',
  'class',
  'background',
  'icon',
];

const getProps = (item: SearchFormItem) => {
  if (item.props) return item.props;
  const propsObj = { ...item };
  rootProps.forEach((key) => delete (propsObj as Record<string, any>)[key]);
  return propsObj;
};

const getSlots = (item: SearchFormItem) => {
  const slots = item.slots || {};
  const validSlots: Record<string, () => any> = {};

  Object.entries(slots).forEach(([key, slotFn]) => {
    if (slotFn) validSlots[key] = slotFn;
  });

  if (!validSlots.prefix && shouldShowIcon(item)) {
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

const shouldShowIcon = (item: SearchFormItem) => {
  if (!props.showDefaultIcons) return false;
  return !!item.type && (item.type in defaultIconMap || !!item.icon);
};

const getIconForItem = (item: SearchFormItem) => {
  if (item.icon) return item.icon;

  if (item.type && item.type in defaultIconMap) {
    return defaultIconMap[item.type as keyof typeof defaultIconMap];
  }

  return null;
};

const getComponent = (item: SearchFormItem) => {
  if (item.render) return item.render;
  const { type } = item;
  return componentMap[type as keyof typeof componentMap] || componentMap['input'];
};

const visibleFormItems = computed(() => props.items.filter((item) => !item.hidden));

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

const handleColumnChange = (columns: ColumnConfig[]) => {
  emit('column-change', columns);
};

defineExpose({
  ref: formInstance,
  validate: (...args: any[]) => formInstance.value?.validate(...args),
});
</script>
