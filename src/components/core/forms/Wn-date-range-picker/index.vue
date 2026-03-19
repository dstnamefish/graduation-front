<template>
  <div
    class="relative flex flex-col gap-2 w-full max-w-[300px] mx-auto"
    @mouseenter="popoverVisible = true"
    @mouseleave="popoverVisible = false"
  >
    <ElPopover
      v-model:visible="popoverVisible"
      trigger="hover"
      placement="bottom-start"
      :width="560"
      popper-class="!p-4 !rounded-xl !border-border !shadow-xl !bg-surface"
      :show-arrow="false"
      :offset="4"
      persistent
    >
      <template #reference>
        <button
          type="button"
          :class="
            cn(
              'flex h-9 w-full items-center justify-between rounded-xl bg-action-bg px-3 py-2 text-sm font-normal transition-colors border border-action-bg hover:border-field-muted-active focus-within:outline-none text-muted',
              $attrs.class as any,
            )
          "
        >
          <div class="flex items-center">
            <CalendarIcon class="mr-2 h-4 w-4 shrink-0 text-muted" />
            <span class="truncate">{{ rangeDisplay || placeholder }}</span>
          </div>
          <ChevronDownIcon
            class="ml-2 h-4 w-4 text-muted transition-transform duration-200"
            :class="cn(popoverVisible && 'rotate-180')"
          />
        </button>
      </template>

      <div class="flex bg-surface select-none gap-8">
        <div class="flex flex-col flex-1">
          <div class="flex items-center justify-between pt-1 relative mb-4">
            <button
              type="button"
              @click="prevMonth"
              class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center transition-colors active:scale-95 hover:bg-surface-sunken rounded-md"
            >
              <ChevronLeftIcon class="h-4 w-4 text-title" />
            </button>
            <div class="text-sm font-medium text-title">
              {{ currentMonthName(leftViewDate) }} {{ currentYear(leftViewDate) }}
            </div>
            <div class="w-7"></div>
          </div>

          <div class="grid grid-cols-7 gap-0 mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-muted w-9 h-9 flex items-center justify-center text-[0.8rem] font-medium"
            >
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-x-0 gap-y-1">
            <div
              v-for="(date, index) in leftDays"
              :key="index"
              :class="
                cn(
                  'relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20',
                  getRangeBgClass(date.fullDate),
                )
              "
              @mouseenter="handleMouseEnter(date.fullDate)"
            >
              <button
                type="button"
                @click="handleDateClick(date.fullDate)"
                :disabled="!date.currentMonth && !showOutsideDays"
                :class="
                  cn(
                    'h-9 w-9 p-0 font-normal flex items-center justify-center transition-colors absolute inset-0',
                    getButtonClasses(date),
                  )
                "
              >
                {{ date.day }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col flex-1">
          <div class="flex items-center justify-between pt-1 relative mb-4">
            <div class="w-7"></div>
            <div class="text-sm font-medium text-title">
              {{ currentMonthName(rightViewDate) }} {{ currentYear(rightViewDate) }}
            </div>
            <button
              type="button"
              @click="nextMonth"
              class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center transition-colors active:scale-95 hover:bg-surface-sunken rounded-md"
            >
              <ChevronRightIcon class="h-4 w-4 text-title" />
            </button>
          </div>

          <div class="grid grid-cols-7 gap-0 mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-muted w-9 h-9 flex items-center justify-center text-[0.8rem] font-medium"
            >
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-x-0 gap-y-1">
            <div
              v-for="(date, index) in rightDays"
              :key="index"
              :class="
                cn(
                  'relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20',
                  getRangeBgClass(date.fullDate),
                )
              "
              @mouseenter="handleMouseEnter(date.fullDate)"
            >
              <button
                type="button"
                @click="handleDateClick(date.fullDate)"
                :disabled="!date.currentMonth && !showOutsideDays"
                :class="
                  cn(
                    'h-9 w-9 p-0 font-normal flex items-center justify-center transition-colors absolute inset-0',
                    getButtonClasses(date),
                  )
                "
              >
                {{ date.day }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ElPopover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { ElPopover } from 'element-plus';
import {
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
} from 'lucide-vue-next';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/en';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('en');

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

defineOptions({ name: 'WnDateRangePicker', inheritAttrs: false });

const props = withDefaults(defineProps<{ placeholder?: string; showOutsideDays?: boolean }>(), {
  placeholder: 'Pick a date',
  showOutsideDays: true,
});

const modelValue = defineModel<string[] | null>({ default: null });

const popoverVisible = ref(false);
const leftViewDate = ref(dayjs().startOf('month'));
const rightViewDate = computed(() => leftViewDate.value.add(1, 'month'));
const hoverDate = ref<string | null>(null);

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const currentMonthName = (date: dayjs.Dayjs) => date.format('MMMM');
const currentYear = (date: dayjs.Dayjs) => date.year();

const rangeDisplay = computed(() => {
  if (!modelValue.value || modelValue.value.length === 0) return null;

  const startDate = dayjs(modelValue.value[0]);
  const startFormatted = startDate.format('MMM DD, YYYY');

  if (modelValue.value.length === 1) return `${startFormatted} - ...`;

  const endDate = dayjs(modelValue.value[1]);

  const sameYear = startDate.year() === endDate.year();
  const sameMonth = startDate.month() === endDate.month();

  if (sameYear && sameMonth) {
    const startDay = startDate.date();
    const endDay = endDate.date();
    const monthName = startDate.format('MMMM');
    const year = startDate.year();
    return `${startDay}-${endDay} ${monthName} ${year}`;
  }

  return `${startFormatted} - ${endDate.format('MMM DD, YYYY')}`;
});

const getDays = (viewDate: dayjs.Dayjs) => {
  const startOfMonth = viewDate.startOf('month');
  const startDay = startOfMonth.day();
  const days = [];
  const prevMonth = startOfMonth.subtract(1, 'month');
  const daysInPrevMonth = prevMonth.daysInMonth();

  for (let i = startDay - 1; i >= 0; i--) {
    const fullDate = prevMonth.date(daysInPrevMonth - i).format('YYYY-MM-DD');
    days.push({ day: daysInPrevMonth - i, currentMonth: false, fullDate });
  }

  const currentMonthDays = startOfMonth.daysInMonth();
  for (let i = 1; i <= currentMonthDays; i++) {
    const fullDate = startOfMonth.date(i).format('YYYY-MM-DD');
    days.push({ day: i, currentMonth: true, fullDate });
  }

  const remaining = 42 - days.length;
  const nextMonth = startOfMonth.add(1, 'month');
  for (let i = 1; i <= remaining; i++) {
    const fullDate = nextMonth.date(i).format('YYYY-MM-DD');
    days.push({ day: i, currentMonth: false, fullDate });
  }
  return days;
};

const leftDays = computed(() => getDays(leftViewDate.value));
const rightDays = computed(() => getDays(rightViewDate.value));

const isSelectedDate = (fullDate: string) => {
  if (!modelValue.value) return false;
  return modelValue.value[0] === fullDate || modelValue.value[1] === fullDate;
};

const isInRange = (fullDate: string) => {
  if (!modelValue.value || modelValue.value.length === 0) return false;

  if (modelValue.value.length === 2) {
    return dayjs(fullDate).isBetween(modelValue.value[0], modelValue.value[1], 'day', '[]');
  }

  if (modelValue.value.length === 1 && hoverDate.value) {
    const start = modelValue.value[0];
    const end = hoverDate.value;
    const realStart = dayjs(start).isBefore(end) ? start : end;
    const realEnd = dayjs(start).isBefore(end) ? end : start;
    return dayjs(fullDate).isBetween(realStart, realEnd, 'day', '[]');
  }
  return false;
};

// 外层连体范围红底逻辑
const getRangeBgClass = (fullDate: string) => {
  if (!isInRange(fullDate)) return '';

  const isStart =
    modelValue.value?.[0] === fullDate ||
    (modelValue.value?.length === 1 &&
      hoverDate.value === fullDate &&
      dayjs(fullDate).isBefore(modelValue.value[0]));
  const isEnd =
    modelValue.value?.[1] === fullDate ||
    (modelValue.value?.length === 1 &&
      hoverDate.value === fullDate &&
      dayjs(fullDate).isAfter(modelValue.value[0]));

  if (isStart && isEnd) return '';
  if (isStart) return 'bg-accent rounded-l-md';
  if (isEnd) return 'bg-accent rounded-r-md';

  return 'bg-accent rounded-none';
};

// 按钮状态与红底逻辑
const getButtonClasses = (date: any) => {
  const isSelected = isSelectedDate(date.fullDate);
  const isToday = date.fullDate === dayjs().format('YYYY-MM-DD');

  return cn(
    'rounded-md',
    !isSelected && date.currentMonth && 'text-body hover:bg-surface-sunken hover:text-body',
    isSelected &&
      'bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground shadow-md font-medium z-30',
    !date.currentMonth && !isSelected && 'text-placeholder opacity-50',
    !isSelected &&
      isInRange(date.fullDate) &&
      'bg-transparent text-accent-foreground hover:bg-accent',
  );
};

// 🚀 核心优化：智能扩展与收缩逻辑
const handleDateClick = (date: string) => {
  if (!modelValue.value || modelValue.value.length === 0) {
    modelValue.value = [date];
    hoverDate.value = null;
  } else if (modelValue.value.length === 1) {
    const start = modelValue.value[0];
    const range = dayjs(date).isBefore(start) ? [date, start] : [start, date];
    modelValue.value = range;
    popoverVisible.value = false;
  } else if (modelValue.value.length === 2) {
    const start = modelValue.value[0];
    const end = modelValue.value[1];
    const clicked = dayjs(date);

    if (clicked.isBefore(start)) {
      // 1. 点击起点前面：起点向前延展
      modelValue.value = [date, end];
    } else if (clicked.isAfter(end)) {
      // 2. 点击终点后面：终点向后延展
      modelValue.value = [start, date];
    } else {
      // 3. 点击两点之间：终点向前收缩至被点击的日期
      modelValue.value = [start, date];
    }
    // 注：修改已存在区间时，不自动关闭弹窗，以便用户继续微调
  }
};

const handleMouseEnter = (date: string) => {
  if (modelValue.value?.length === 1) {
    hoverDate.value = date;
  }
};

const prevMonth = () => {
  leftViewDate.value = leftViewDate.value.subtract(1, 'month');
};

const nextMonth = () => {
  leftViewDate.value = leftViewDate.value.add(1, 'month');
};

watch(popoverVisible, (val) => {
  if (val && modelValue.value?.[0]) {
    leftViewDate.value = dayjs(modelValue.value[0]).startOf('month');
  }
});

onMounted(() => {
  if (modelValue.value && modelValue.value.length > 0) {
    leftViewDate.value = dayjs(modelValue.value[0]).startOf('month');
  }
});
</script>
