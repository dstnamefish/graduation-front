<template>
  <div class="flex flex-col gap-6">
    <!-- 头部 -->
    <div class="flex items-center justify-between px-1">
      <h2 class="text-xl font-bold text-slate-900">{{ currentMonthYear }}</h2>
      <div class="flex gap-1">
        <button @click="changeMonth(-1)" class="p-2 hover:bg-slate-100 rounded-lg transition-colors group">
          <ZenSvgIcon icon="local-common/arrow-left" :size="18" class="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
        <button @click="changeMonth(1)" class="p-2 hover:bg-slate-100 rounded-lg transition-colors group">
          <ZenSvgIcon icon="local-common/arrow-right" :size="18" class="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      </div>
    </div>

    <!-- 周日历 -->
    <div class="grid grid-cols-7 text-center">
      <span v-for="day in weekDays" :key="day" class="text-sm text-slate-400 ">
        {{ day.substring(0, 3) }}
      </span>
    </div>

    <!-- 日历选择器 -->
    <div class="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
      <button
        v-for="(dayObj, index) in calendarGrid"
        :key="index"
        @click="selectDate(dayObj.date)"
        :disabled="!dayObj.isCurrentMonth"
        class="relative w-8 h-8 mx-auto flex items-center justify-center rounded-lg transition-all duration-300"
        :class="[
          dayObj.isSelected ? 'bg-[#243956] text-white z-10' : 'hover:bg-slate-50 text-slate-600',
          !dayObj.isCurrentMonth ? 'opacity-20 cursor-default' : 'cursor-pointer',
          dayObj.isToday && !dayObj.isSelected ? 'text-blue-600' : ''
        ]"
      >
        {{ dayObj.date.getDate() }}
        <!-- 当前日期 -->
        <span v-if="dayObj.isToday && !dayObj.isSelected" class="absolute bottom-1.5 w-1 h-1 bg-[#045] rounded-full"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ZenSvgIcon from '@/components/core/base/zen-svg-icon/index.vue';

interface DayObj {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

const props = defineProps<{
  modelValue: Date // 选中的日期
}>();

const emit = defineEmits(['update:modelValue']);

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// 内部维护一个用于显示当前月份的视角
const viewDate = ref(new Date(props.modelValue));

// 计算当前显示的月份标题 (e.g., "July 2028")
const currentMonthYear = computed(() => {
  return viewDate.value.toLocaleString('en-US', { month: 'long', year: 'numeric' });
});

// 生成日历网格
const calendarGrid = computed<DayObj[]>(() => {
  const year = viewDate.value.getFullYear();
  const month = viewDate.value.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const days: DayObj[] = [];
  
  // Padding for last month
  const startDay = firstDayOfMonth.getDay();
  for (let i = startDay; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push(createDayObj(d, false));
  }
  
  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(year, month, i);
    days.push(createDayObj(d, true));
  }
  
  // Padding for next month to fill grid
  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const d = new Date(year, month + 1, i);
    days.push(createDayObj(d, false));
  }
  
  return days;
});

function createDayObj(date: Date, isCurrentMonth: boolean): DayObj {
  const today = new Date();
  return {
    date: date,
    isCurrentMonth,
    isToday: date.toDateString() === today.toDateString(),
    isSelected: date.toDateString() === props.modelValue.toDateString()
  };
}

function changeMonth(step: number) {
  const newDate = new Date(viewDate.value);
  newDate.setMonth(newDate.getMonth() + step);
  viewDate.value = newDate;
}

function selectDate(date: Date) {
  emit('update:modelValue', date);
}

watch(() => props.modelValue, (newVal) => {
  viewDate.value = new Date(newVal);
});
</script>
