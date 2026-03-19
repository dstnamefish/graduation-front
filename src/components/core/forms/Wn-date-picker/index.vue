<template>
  <div
    class="relative inline-flex"
    :class="cn(autoWidth && 'w-auto', !autoWidth && 'w-full min-w-56')"
    @mouseenter="popoverVisible = true"
    @mouseleave="popoverVisible = false"
  >
    <ElPopover
      v-model:visible="popoverVisible"
      trigger="hover"
      :placement="computedPlacement"
      :width="280"
      popper-class="!p-3 !rounded-xl !border-border !shadow-xl !bg-surface"
      :show-arrow="false"
      :offset="4"
      persistent
    >
      <template #reference>
        <button
          ref="buttonRef"
          type="button"
          :class="
            cn(
              'flex h-9 items-center justify-between rounded-xl bg-action-bg px-3 py-2 text-sm font-normal transition-colors border border-action-bg hover:border-field-muted-active focus-within:outline-none text-muted',
              autoWidth ? 'w-auto' : 'w-full',
              $attrs.class as any,
            )
          "
        >
          <div class="flex items-center">
            <CalendarIcon class="mr-2 h-4 w-4 shrink-0 text-muted" />
            <span class="whitespace-nowrap">
              {{ selectedDateDisplay || placeholder }}
            </span>
          </div>
          <ChevronDownIcon
            class="ml-2 h-4 w-4 text-muted transition-transform duration-200"
            :class="cn(popoverVisible && 'rotate-180')"
          />
        </button>
      </template>

      <div class="flex flex-col bg-surface select-none">
        <div class="flex items-center justify-between pt-1 relative mb-4">
          <button
            type="button"
            @click="prevMonth"
            class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center transition-colors active:scale-95 hover:bg-surface-sunken rounded-md"
          >
            <ChevronLeftIcon class="h-4 w-4 text-title" />
          </button>
          <div class="text-sm font-medium text-title">{{ currentMonthName }} {{ currentYear }}</div>
          <button
            type="button"
            @click="nextMonth"
            class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center transition-colors active:scale-95 hover:bg-surface-sunken rounded-md"
          >
            <ChevronRightIcon class="h-4 w-4 text-title" />
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-muted rounded-md w-8 h-8 flex items-center justify-center text-xs font-normal"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="(date, index) in daysInMonth"
            :key="index"
            type="button"
            @click="selectDate(date)"
            :disabled="!date.currentMonth && !showOutsideDays"
            :class="
              cn(
                'h-8 w-8 p-0 text-sm font-normal flex items-center justify-center rounded-md transition-colors',
                !date.isSelected && date.currentMonth && 'text-body hover:bg-surface-sunken',
                date.isSelected &&
                  'bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground shadow-md font-medium',
                !date.currentMonth &&
                  !date.isSelected &&
                  'text-placeholder opacity-50 hover:bg-surface-sunken hover:text-body',
              )
            "
          >
            {{ date.day }}
          </button>
        </div>

        <div class="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <button
            type="button"
            @click="goToToday"
            class="text-xs font-medium text-title hover:text-muted transition-colors"
          >
            Today
          </button>
          <button
            v-if="modelValue"
            type="button"
            @click="clearDate"
            class="text-xs font-medium text-destructive hover:text-destructive-text transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </ElPopover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElPopover } from 'element-plus';
import {
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
} from 'lucide-vue-next';
import dayjs from 'dayjs';
// 移除 'zh-cn' 以确保 1:1 贴合 shadcn/ui 的纯英文极简界面
import 'dayjs/locale/en';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

dayjs.locale('en');

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

defineOptions({ name: 'WnDatePicker', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    format?: string;
    showOutsideDays?: boolean;
    autoWidth?: boolean;
    placement?: 'left' | 'right';
  }>(),
  {
    placeholder: 'Pick a date',
    format: 'YYYY-MM-DD',
    showOutsideDays: true,
    autoWidth: true,
    placement: 'right',
  },
);

const computedPlacement = computed(() => {
  return props.placement === 'right' ? 'bottom-end' : 'bottom-start';
});

const modelValue = defineModel<string | null>({ default: null });

const popoverVisible = ref(false);
const viewDate = ref(dayjs());

// 严格按照 shadcn 星期展示格式
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// 格式化输出完整的英文月份，例如: "March"
const currentMonthName = computed(() => viewDate.value.format('MMMM'));

const currentYear = computed(() => viewDate.value.year());

const selectedDateDisplay = computed(() => {
  if (!modelValue.value) return null;
  const today = dayjs().format('YYYY-MM-DD');
  const selected = dayjs(modelValue.value).format('YYYY-MM-DD');
  if (selected === today) return 'Today';
  return dayjs(modelValue.value).format('MMMM D, YYYY');
});

const daysInMonth = computed(() => {
  const startOfMonth = viewDate.value.startOf('month');
  const endOfMonth = viewDate.value.endOf('month');
  const startDay = startOfMonth.day();
  const days = [];
  const prevMonth = startOfMonth.subtract(1, 'month');
  const daysInPrevMonth = prevMonth.daysInMonth();

  for (let i = startDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const fullDate = prevMonth.date(d).format('YYYY-MM-DD');
    days.push({ day: d, currentMonth: false, isToday: false, isSelected: false, fullDate });
  }

  const today = dayjs().format('YYYY-MM-DD');
  const selected = modelValue.value ? dayjs(modelValue.value).format('YYYY-MM-DD') : null;
  const currentMonthDaysCount = startOfMonth.daysInMonth();

  for (let i = 1; i <= currentMonthDaysCount; i++) {
    const fullDate = startOfMonth.date(i).format('YYYY-MM-DD');
    days.push({
      day: i,
      currentMonth: true,
      isToday: fullDate === today,
      isSelected: fullDate === selected,
      fullDate,
    });
  }

  const totalDays = 42;
  const remaining = totalDays - days.length;
  const nextMonth = startOfMonth.add(1, 'month');

  for (let i = 1; i <= remaining; i++) {
    const fullDate = nextMonth.date(i).format('YYYY-MM-DD');
    days.push({ day: i, currentMonth: false, isToday: false, isSelected: false, fullDate });
  }
  return days;
});

const prevMonth = () => {
  viewDate.value = viewDate.value.subtract(1, 'month');
};

const nextMonth = () => {
  viewDate.value = viewDate.value.add(1, 'month');
};

const selectDate = (date: any) => {
  modelValue.value = date.fullDate;
  popoverVisible.value = false;
};

const clearDate = () => {
  modelValue.value = null;
  popoverVisible.value = false;
};

const goToToday = () => {
  const today = dayjs();
  viewDate.value = today;
  modelValue.value = today.format('YYYY-MM-DD');
  popoverVisible.value = false;
};

watch(modelValue, (val) => {
  if (val && !popoverVisible.value) {
    viewDate.value = dayjs(val);
  }
});

onMounted(() => {
  if (modelValue.value) {
    viewDate.value = dayjs(modelValue.value);
  }
});
</script>
