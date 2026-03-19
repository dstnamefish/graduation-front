<template>
  <div class="flex flex-col gap-6">
    <!-- 头部 -->
    <div class="flex items-center justify-between px-1">
      <h2 class="text-xl font-bold text-title">{{ currentMonthYear }}</h2>
      <div class="flex items-center gap-1">
        <WnIconButton
          icon="hugeicons:arrow-left-01"
          @click="changeMonth(-1)"
          class="bg-transparent! hover:text-action-text!"
        />
        <WnIconButton
          icon="hugeicons:arrow-right-01"
          @click="changeMonth(1)"
          class="bg-transparent! hover:text-action-text!"
        />
      </div>
    </div>

    <!-- 周日标题 -->
    <div class="grid grid-cols-7 text-center">
      <span v-for="day in weekDays" :key="day" class="text-sm text-placeholder">
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
          dayObj.isSelected ? 'bg-primary text-primary-foreground z-10' : 'hover:bg-surface-bg text-body',
          !dayObj.isCurrentMonth ? 'opacity-20 cursor-default' : 'cursor-pointer',
          dayObj.isToday && !dayObj.isSelected ? 'text-link' : '',
        ]"
      >
        {{ dayObj.date.getDate() }}
        <!-- 当前日期指示器 -->
        <span v-if="dayObj.isToday && !dayObj.isSelected" class="absolute bottom-1.5 w-1 h-1 bg-link rounded-full"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DayObj {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

const props = defineProps<{
  modelValue: Date; // 选中的日期
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
  const isSelected = date.toDateString() === props.modelValue.toDateString();
  return {
    date,
    isCurrentMonth,
    isToday: date.toDateString() === today.toDateString(),
    isSelected,
  };
}

function changeMonth(delta: number) {
  const newDate = new Date(viewDate.value);
  newDate.setMonth(newDate.getMonth() + delta);
  viewDate.value = newDate;
}

function selectDate(date: Date) {
  emit('update:modelValue', date);
}
</script>