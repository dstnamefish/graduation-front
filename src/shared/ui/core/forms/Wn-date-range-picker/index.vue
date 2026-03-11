<template>
  <div class="relative inline-block w-full min-w-[300px]">
    <ElPopover
      v-model:visible="popoverVisible"
      trigger="click"
      placement="bottom-start"
      :width="600"
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
              (!modelValue || modelValue.length === 0) && 'text-slate-400',
              $attrs.class as any,
            )
          "
        >
          <div class="flex items-center overflow-hidden">
            <CalendarIcon class="mr-2 h-4 w-4 shrink-0 text-slate-400" />
            <span class="truncate">{{ rangeDisplay || placeholder }}</span>
          </div>
          <div
            v-if="modelValue && modelValue.length > 0"
            class="ml-2 hover:text-slate-900 transition-colors"
            @click.stop="clearRange"
          >
            <XIcon class="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </template>

      <!-- Range Calendar Content -->
      <div class="flex p-3 bg-white rounded-lg select-none gap-4">
        <!-- Left Month -->
        <div class="flex flex-col w-[260px]">
          <div class="flex items-center justify-between mb-4">
            <button
              type="button"
              @click="prevMonth"
              class="flex items-center justify-center h-8 w-8 rounded-md border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <ChevronLeftIcon class="h-4 w-4" />
            </button>
            <div class="text-sm font-semibold text-slate-700">
              {{ formatMonthYear(leftViewDate) }}
            </div>
            <div class="w-8"></div>
          </div>

          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-slate-400 w-8 h-8 flex items-center justify-center text-[0.75rem] font-medium"
            >
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="(date, index) in leftDays"
              :key="index"
              type="button"
              @click="handleDateClick(date.fullDate)"
              :class="getDayClasses(date)"
              @mouseenter="handleMouseEnter(date.fullDate)"
            >
              {{ date.day }}
            </button>
          </div>
        </div>

        <!-- Right Month -->
        <div class="flex flex-col w-[260px]">
          <div class="flex items-center justify-between mb-4">
            <div class="w-8"></div>
            <div class="text-sm font-semibold text-slate-700">
              {{ formatMonthYear(rightViewDate) }}
            </div>
            <button
              type="button"
              @click="nextMonth"
              class="flex items-center justify-center h-8 w-8 rounded-md border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <ChevronRightIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-slate-400 w-8 h-8 flex items-center justify-center text-[0.75rem] font-medium"
            >
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="(date, index) in rightDays"
              :key="index"
              type="button"
              @click="handleDateClick(date.fullDate)"
              :class="getDayClasses(date)"
              @mouseenter="handleMouseEnter(date.fullDate)"
            >
              {{ date.day }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div class="text-[12px] text-slate-500">
          <span v-if="hoverDate && modelValue?.length === 1">选择结束日期</span>
          <span v-else-if="modelValue?.length === 2">已选择范围</span>
          <span v-else>选择起始日期</span>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            @click="setQuickRange('today')"
            class="text-[12px] px-2 py-1 rounded hover:bg-white hover:shadow-sm transition-all"
          >
            今天
          </button>
          <button
            type="button"
            @click="setQuickRange('last7')"
            class="text-[12px] px-2 py-1 rounded hover:bg-white hover:shadow-sm transition-all"
          >
            最近7天
          </button>
          <button
            v-if="modelValue && modelValue.length > 0"
            type="button"
            @click="clearRange"
            class="text-[12px] text-slate-400 hover:text-slate-600 px-2 py-1 transition-colors"
          >
            清除
          </button>
        </div>
      </div>
    </ElPopover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElPopover } from 'element-plus';
import {
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  X as XIcon,
} from 'lucide-vue-next';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/zh-cn';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

dayjs.extend(isBetween);
dayjs.locale('zh-cn');

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

defineOptions({ name: 'WnDateRangePicker', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
    format?: string;
  }>(),
  {
    placeholder: '选择日期范围',
    format: 'YYYY-MM-DD',
  },
);

const modelValue = defineModel<string[] | null>({ default: [] });

const popoverVisible = ref(false);
const leftViewDate = ref(dayjs().startOf('month'));
const rightViewDate = computed(() => leftViewDate.value.add(1, 'month'));
const hoverDate = ref<string | null>(null);

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const rangeDisplay = computed(() => {
  if (!modelValue.value || modelValue.value.length === 0) return null;
  const start = dayjs(modelValue.value[0]).format(props.format);
  if (modelValue.value.length === 1) return `${start} - ...`;
  const end = dayjs(modelValue.value[1]).format(props.format);
  return `${start} 至 ${end}`;
});

const formatMonthYear = (date: dayjs.Dayjs) => {
  return date.format('YYYY年 MMMM');
};

const getDays = (viewDate: dayjs.Dayjs) => {
  const startOfMonth = viewDate.startOf('month');
  const startDay = startOfMonth.day();
  const days = [];

  // Previous month padding
  const prevMonth = startOfMonth.subtract(1, 'month');
  const daysInPrevMonth = prevMonth.daysInMonth();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      currentMonth: false,
      fullDate: prevMonth.date(daysInPrevMonth - i).format('YYYY-MM-DD'),
    });
  }

  // Current month
  const currentMonthDays = startOfMonth.daysInMonth();
  for (let i = 1; i <= currentMonthDays; i++) {
    days.push({
      day: i,
      currentMonth: true,
      fullDate: startOfMonth.date(i).format('YYYY-MM-DD'),
    });
  }

  // Fill to 42
  const remaining = 42 - days.length;
  const nextMonth = startOfMonth.add(1, 'month');
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      currentMonth: false,
      fullDate: nextMonth.date(i).format('YYYY-MM-DD'),
    });
  }

  return days;
};

const leftDays = computed(() => getDays(leftViewDate.value));
const rightDays = computed(() => getDays(rightViewDate.value));

const getDayClasses = (date: any) => {
  const isSelected = modelValue.value?.includes(date.fullDate);
  const isStart = modelValue.value?.[0] === date.fullDate;
  const isEnd = modelValue.value?.[1] === date.fullDate;

  let inRange = false;
  if (modelValue.value?.length === 2) {
    inRange = dayjs(date.fullDate).isBetween(modelValue.value[0], modelValue.value[1], 'day', '[]');
  } else if (modelValue.value?.length === 1 && hoverDate.value) {
    const start = modelValue.value[0];
    const end = hoverDate.value;
    const [realStart, realEnd] = dayjs(start).isBefore(end) ? [start, end] : [end, start];
    inRange = dayjs(date.fullDate).isBetween(realStart, realEnd, 'day', '[]');
  }

  return cn(
    'h-8 w-8 p-0 font-normal flex items-center justify-center rounded-md transition-all text-sm relative',
    !date.currentMonth && 'text-slate-300 opacity-50',
    inRange && 'bg-slate-100 rounded-none first:rounded-l-md last:rounded-r-md',
    (isStart || isEnd) &&
      'bg-slate-900 text-white hover:bg-slate-900 hover:text-white rounded-md z-10 shadow-sm',
    !isSelected && !inRange && date.currentMonth && 'text-slate-700 hover:bg-slate-100',
    date.fullDate === dayjs().format('YYYY-MM-DD') && !isSelected && 'text-blue-600 font-bold',
  );
};

const handleDateClick = (date: string) => {
  if (!modelValue.value || modelValue.value.length !== 1) {
    modelValue.value = [date];
  } else {
    const start = modelValue.value[0];
    const range = dayjs(date).isBefore(start) ? [date, start] : [start, date];
    modelValue.value = range;
    popoverVisible.value = false;
  }
};

const handleMouseEnter = (date: string) => {
  if (modelValue.value?.length === 1) {
    hoverDate.value = date;
  } else {
    hoverDate.value = null;
  }
};

const prevMonth = () => {
  leftViewDate.value = leftViewDate.value.subtract(1, 'month');
};

const nextMonth = () => {
  leftViewDate.value = leftViewDate.value.add(1, 'month');
};

const clearRange = () => {
  modelValue.value = [];
  hoverDate.value = null;
};

const setQuickRange = (type: 'today' | 'last7') => {
  const today = dayjs().format('YYYY-MM-DD');
  if (type === 'today') {
    modelValue.value = [today, today];
  } else if (type === 'last7') {
    modelValue.value = [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), today];
  }
  popoverVisible.value = false;
};

watch(popoverVisible, (val) => {
  if (val && modelValue.value?.[0]) {
    leftViewDate.value = dayjs(modelValue.value[0]).startOf('month');
  }
});
</script>
