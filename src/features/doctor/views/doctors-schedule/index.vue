<template>
  <div
    class="schedule-page flex flex-col h-full bg-slate-50 rounded-3xl p-6 shadow-sm border border-slate-100/50"
  >
    <!-- Header Area -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-6">
        <h1 class="text-3xl font-extrabold text-slate-800">{{ currentMonthYear }}</h1>
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shadow-inner-sm">
          <WnIconButton
            icon="ri:arrow-left-s-line"
            :size="20"
            @click="prevMonth"
            class="!w-8 !h-8 !bg-transparent hover:!bg-white"
          />
          <WnIconButton
            icon="ri:arrow-right-s-line"
            :size="20"
            @click="nextMonth"
            class="!w-8 !h-8 !bg-transparent hover:!bg-white"
          />
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center bg-slate-100 p-1.5 rounded-xl shadow-inner-sm gap-1">
          <button
            v-for="view in viewOptions"
            :key="view.value"
            :class="[
              'px-4 py-1.5 text-[13px] font-bold rounded-lg transition-all duration-300',
              currentView === view.value
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50',
            ]"
            @click="currentView = view.value"
          >
            {{ view.label }}
          </button>
        </div>

        <ElSelect
          v-model="selectedAgenda"
          placeholder="All Agenda"
          clearable
          class="w-36 custom-dark-select"
        >
          <ElOption
            label="All Agenda"
            value=""
          />
          <ElOption
            label="Check-Up"
            value="checkup"
          />
          <ElOption
            label="Surgery"
            value="surgery"
          />
          <ElOption
            label="Consultation"
            value="consultation"
          />
        </ElSelect>

        <WnButton
          type="primary"
          @click="handleAddSchedule"
          class="!rounded-xl !px-5 shadow-md"
        >
          <WnSvgIcon
            icon="ri:add-line"
            :size="16"
            class="mr-1.5"
          />
          Add Schedule
        </WnButton>
      </div>
    </div>

    <!-- Calendar Grid Area -->
    <div
      class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col flex-1 shadow-sm"
    >
      <!-- Week Header -->
      <div class="grid grid-cols-7 border-b border-slate-200 bg-slate-100">
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-3.5 text-center text-[13px] font-bold text-slate-400 border-r border-slate-200 last:border-r-0"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days Body -->
      <div class="grid grid-cols-7 flex-1 min-h-[600px] auto-rows-fr">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'p-1.5 border-r border-b border-slate-200 last:border-r-0 relative flex flex-col min-h-[140px]',
            !day.isCurrentMonth && 'bg-stripes pointer-events-none',
          ]"
        >
          <!-- Date Number Overlay -->
          <div class="flex justify-end pr-1 pt-1 mb-1">
            <span
              :class="[
                'text-[11px] font-bold tracking-tight',
                day.isToday
                  ? 'bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full'
                  : '',
                !day.isToday && day.fullDate.getDay() === 0 ? 'text-red-500' : '',
                !day.isToday && day.fullDate.getDay() !== 0 && day.isCurrentMonth
                  ? 'text-slate-600'
                  : '',
                !day.isCurrentMonth ? 'text-slate-300' : '',
              ]"
            >
              {{ day.date }}
            </span>
          </div>

          <!-- Events Overlay -->
          <div class="flex-1 overflow-y-auto w-full no-scrollbar space-y-1">
            <template v-if="day.isCurrentMonth">
              <div
                v-for="event in day.events.slice(0, 3)"
                :key="event.id"
                :class="[
                  'px-2 py-1.5 rounded-lg text-left cursor-pointer transition-transform hover:scale-[1.02] border',
                  event.color === 'mint'
                    ? 'bg-[#a5f3e4]/80 border-[#a5f3e4] text-[#0e5b60]'
                    : 'bg-[#c5f0f3] border-[#c5f0f3] text-[#147d83]',
                ]"
                @click="handleEventClick(event)"
              >
                <div class="font-bold text-[11px] truncate w-full">
                  {{ event.doctorName }}
                </div>
                <div class="text-[10px] opacity-80 mt-0.5 leading-tight line-clamp-2">
                  {{ event.title }}
                </div>
                <div class="flex items-center gap-1 mt-1.5 opacity-70">
                  <WnSvgIcon
                    icon="ri:time-line"
                    :size="10"
                  />
                  <span class="text-[9px] font-semibold">{{ event.time }}</span>
                </div>
              </div>
              <div
                v-if="day.events.length > 3"
                class="text-[10px] font-bold text-slate-400 pl-2 pt-1 hover:text-primary-500 cursor-pointer"
              >
                +{{ day.events.length - 3 }} more
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { getMockScheduleEvents, type ScheduleEvent } from '@/mock/doctors-schedule';

defineOptions({ name: 'DoctorsSchedule' });

// State - Defaulting to July 2028 as specified in design
const currentDate = ref(new Date(2028, 6, 1));
const currentView = ref('Month');
const selectedAgenda = ref('');

const viewOptions = [
  { label: 'Day', value: 'Day' },
  { label: 'Week', value: 'Week' },
  { label: 'Month', value: 'Month' },
];

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const events = ref<ScheduleEvent[]>([]);

// Computed
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Add days from previous month
  const startDayOfWeek = firstDay.getDay();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date: date.getDate(),
      fullDate: date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date),
    });
  }

  // Add days of current month
  const today = new Date();
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date: i,
      fullDate: date,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      events: getEventsForDate(date),
    });
  }

  // Complete grid with next month days up to 42 cells total (6 rows precisely)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date: i,
      fullDate: date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date),
    });
  }

  return days;
});

// Methods
const getEventsForDate = (date: Date): ScheduleEvent[] => {
  return events.value.filter((e) => e.date.toDateString() === date.toDateString());
};

const prevMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  );
  fetchSchedules();
};
const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  );
  fetchSchedules();
};
const fetchSchedules = async () => {
  // Using Mock Data instead of API for showcase
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  events.value = getMockScheduleEvents(year, month);
};

const handleAddSchedule = () => {
  ElMessage.success('Add Schedule dialog would open here');
};

const handleEventClick = (event: ScheduleEvent) => {
  ElMessage.success(`Viewing ${event.doctorName}'s schedule: ${event.title}`);
};

onMounted(() => {
  fetchSchedules();
});
</script>