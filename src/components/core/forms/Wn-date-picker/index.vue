<template>
  <div class="relative inline-block w-full min-w-[200px]">
    <ElPopover
      v-model:visible="popoverVisible"
      trigger="click"
      placement="bottom-start"
      :width="280"
      popper-class="!p-0 !rounded-lg !border-slate-200 !shadow-lg"
      :show-arrow="false"
      :offset="8"
      persistent
    >
      <template #reference>
        <div
          :class="
            cn(
              'flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white transition-all hover:bg-slate-50 hover:border-slate-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
              !modelValue && 'text-slate-400',
              $attrs.class as any,
            )
          "
        >
          <div class="flex items-center overflow-hidden">
            <CalendarIcon class="mr-2 h-4 w-4 shrink-0 text-slate-400" />
            <span class="truncate">{{ selectedDateDisplay || placeholder }}</span>
          </div>
          <div
            v-if="modelValue"
            class="ml-2 hover:text-slate-900 transition-colors"
            @click.stop="clearDate"
          >
            <XIcon class="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </template>

      <!-- Calendar Content -->
      <div class="flex flex-col p-3 bg-white rounded-lg select-none">
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-4">
          <button
            type="button"
            @click="prevMonth"
            class="flex items-center justify-center h-8 w-8 rounded-md border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          <div class="text-sm font-semibold text-slate-700 flex items-center gap-1">
            <span>{{ currentMonthName }}</span>
            <span class="text-slate-400 font-normal">{{ currentYear }}</span>
          </div>
          <button
            type="button"
            @click="nextMonth"
            class="flex items-center justify-center h-8 w-8 rounded-md border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- Weekdays -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-slate-400 rounded-md w-8 h-8 flex items-center justify-center text-[0.75rem] font-medium"
          >
            {{ day }}
          </div>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="(date, index) in daysInMonth"
            :key="index"
            type="button"
            @click="selectDate(date)"
            :disabled="!date.currentMonth && !showOutsideDays"
            :class="
              cn(
                'h-8 w-8 p-0 font-normal flex items-center justify-center rounded-md transition-all text-sm relative',
                !date.currentMonth &&
                  'text-slate-300 opacity-50 hover:bg-transparent cursor-default',
                date.isToday &&
                  !date.isSelected &&
                  'text-blue-600 font-bold after:content-[\'\'] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-600 after:rounded-full',
                date.isSelected &&
                  'bg-slate-900 text-white hover:bg-slate-800 hover:text-white focus:bg-slate-900 focus:text-white font-medium shadow-sm active:scale-90',
                !date.isSelected && date.currentMonth && 'text-slate-700 hover:bg-slate-100',
              )
            "
          >
            {{ date.day }}
          </button>
        </div>

        <!-- Footer / Shortcuts (Optional) -->
        <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <button
            type="button"
            @click="goToToday"
            class="text-[12px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            今天
          </button>
          <button
            v-if="modelValue"
            type="button"
            @click="clearDate"
            class="text-[12px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            清除
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
  X as XIcon,
} from 'lucide-vue-next';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 设置 dayjs 语言
dayjs.locale('zh-cn');

/**
 * 合并 Tailwind 类
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

defineOptions({ name: 'WnDatePicker', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    format?: string;
    showOutsideDays?: boolean;
  }>(),
  {
    placeholder: '选择日期',
    format: 'YYYY-MM-DD',
    showOutsideDays: true,
  },
);

const modelValue = defineModel<string | null>({ default: null });

const popoverVisible = ref(false);
const viewDate = ref(dayjs()); // 当前在日历中查看的日期

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const currentMonthName = computed(() => {
  return viewDate.value.format('MMMM');
});

const currentYear = computed(() => viewDate.value.year());

const selectedDateDisplay = computed(() => {
  if (!modelValue.value) return null;
  return dayjs(modelValue.value).format(props.format);
});

/**
 * 计算日历网格中的日期
 */
const daysInMonth = computed(() => {
  const startOfMonth = viewDate.value.startOf('month');
  const endOfMonth = viewDate.value.endOf('month');
  const startDay = startOfMonth.day(); // 0 (Sun) to 6 (Sat)

  const days = [];

  // 上个月的补全日期
  const prevMonth = startOfMonth.subtract(1, 'month');
  const daysInPrevMonth = prevMonth.daysInMonth();
  for (let i = startDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const fullDate = prevMonth.date(d).format('YYYY-MM-DD');
    days.push({
      day: d,
      currentMonth: false,
      isToday: false,
      isSelected: false,
      fullDate,
    });
  }

  // 本月的日期
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

  // 下个月的补全日期 (固定 42 格，即 6 行)
  const totalDays = 42;
  const remaining = totalDays - days.length;
  const nextMonth = startOfMonth.add(1, 'month');
  for (let i = 1; i <= remaining; i++) {
    const fullDate = nextMonth.date(i).format('YYYY-MM-DD');
    days.push({
      day: i,
      currentMonth: false,
      isToday: false,
      isSelected: false,
      fullDate,
    });
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

// 当外部 modelValue 改变时，同步日历视图（如果在关闭状态）
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
