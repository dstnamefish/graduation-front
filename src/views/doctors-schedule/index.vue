<template>
  <div class="schedule-page">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-secondary">{{ currentMonthYear }}</h1>
        <div class="flex items-center gap-1">
          <ElButton :icon="ArrowLeft" circle size="small" @click="prevMonth" />
          <ElButton :icon="ArrowRight" circle size="small" @click="nextMonth" />
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex rounded-lg overflow-hidden border border-default-border">
          <button
            v-for="view in viewOptions"
            :key="view.value"
            :class="[
              'px-4 py-2 text-xs font-medium transition-all',
              currentView === view.value
                ? 'bg-secondary text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            ]"
            @click="currentView = view.value"
          >
            {{ view.label }}
          </button>
        </div>
        <ElSelect v-model="selectedAgenda" placeholder="All Agenda" clearable class="w-32">
          <ElOption label="All Agenda" value="" />
          <ElOption label="Check-Up" value="checkup" />
          <ElOption label="Surgery" value="surgery" />
          <ElOption label="Consultation" value="consultation" />
        </ElSelect>
        <ElButton type="primary" @click="handleAddSchedule">
          <WnSvgIcon icon="solar:add-circle-bold" :size="16" class="mr-1" />
          Add Schedule
        </ElButton>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="bg-white rounded-2xl border border-default-border overflow-hidden flex-1">
      <!-- Week Header -->
      <div class="grid grid-cols-7 border-b border-default-border">
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-3 text-center text-sm font-semibold text-gray-500 border-r border-default-border last:border-r-0"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 flex-1" style="min-height: 500px;">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'p-2 border-r border-b border-default-border last:border-r-0 min-h-[120px] relative',
            !day.isCurrentMonth && 'bg-gray-50'
          ]"
        >
          <!-- Day Number -->
          <div class="flex items-center justify-between mb-2">
            <span
              :class="[
                'w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full',
                day.isToday ? 'bg-primary text-white' : 'text-gray-600',
                !day.isCurrentMonth && 'text-gray-300'
              ]"
            >
              {{ day.date }}
            </span>
          </div>

          <!-- Events -->
          <div class="space-y-1 overflow-hidden" style="max-height: 80px;">
            <div
              v-for="event in day.events.slice(0, 2)"
              :key="event.id"
              :class="[
                'px-2 py-1 rounded text-[10px] font-medium truncate cursor-pointer hover:opacity-80 transition-opacity',
                event.color
              ]"
              @click="handleEventClick(event)"
            >
              <div class="flex items-center gap-1">
                <img :src="event.avatar" class="w-4 h-4 rounded-full" />
                <span class="truncate">{{ event.doctorName }}</span>
              </div>
              <div class="text-[9px] opacity-80 truncate">{{ event.title }}</div>
            </div>
            <div
              v-if="day.events.length > 2"
              class="text-[10px] text-gray-400 pl-2"
            >
              +{{ day.events.length - 2 }} more
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { scheduleService } from '@/api/services';

defineOptions({ name: 'DoctorsSchedule' });

// State
const currentDate = ref(new Date(2028, 6, 1)); // July 2028 as shown in screenshot
const currentView = ref('Month');
const selectedAgenda = ref('');

const viewOptions = [
  { label: 'Day', value: 'Day' },
  { label: 'Week', value: 'Week' },
  { label: 'Month', value: 'Month' },
];

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ScheduleEvent {
  id: number;
  doctorName: string;
  avatar: string;
  title: string;
  time: string;
  color: string;
  date: Date;
}

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

  // Add days from next month to complete the grid (6 rows)
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
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const fetchSchedules = async () => {
  try {
    const res = await scheduleService.fetchSchedules({
      startDate: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).toISOString().split('T')[0],
    });
    events.value = (res.list || []).map((s: any) => ({
      id: s.id,
      doctorName: s.doctorName || 'Unknown Doctor',
      avatar: s.doctorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor',
      title: s.title || 'Appointment',
      time: s.startTime || '09:00',
      color: getRandomColor(),
      date: new Date(s.scheduleDate),
    }));
  } catch {
    events.value = getMockEvents();
  }
};

const getRandomColor = (): string => {
  const colors = [
    'bg-primary/20 text-primary',
    'bg-success/20 text-success',
    'bg-warning/20 text-warning',
    'bg-info/20 text-info',
    'bg-secondary/20 text-secondary',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const handleAddSchedule = () => {
  ElMessage.info('Add Schedule dialog would open here');
};

const handleEventClick = (event: ScheduleEvent) => {
  ElMessage.info(`Viewing ${event.doctorName}'s schedule: ${event.title}`);
};

// Mock data
const getMockEvents = (): ScheduleEvent[] => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const doctors = [
    { name: 'Dr. John Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { name: 'Dr. Emily Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    { name: 'Dr. Petra Winsburry', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petra' },
    { name: 'Dr. Michael Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
    { name: 'Dr. Linda Green', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda' },
  ];

  const titles = [
    'Routine Check-Up',
    'Patient Consultation',
    'Follow-up Visit',
    'Acute Illness Treatment',
    'Chronic Disease Management',
    'Preventive Care Consultation',
  ];

  const mockEvents: ScheduleEvent[] = [];
  let id = 1;

  // Generate random events for the month
  for (let day = 1; day <= 31; day++) {
    const numEvents = Math.floor(Math.random() * 3);
    for (let i = 0; i < numEvents; i++) {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      mockEvents.push({
        id: id++,
        doctorName: doctor.name,
        avatar: doctor.avatar,
        title: titles[Math.floor(Math.random() * titles.length)],
        time: `${Math.floor(Math.random() * 8) + 8}:00`,
        color: getRandomColor(),
        date: new Date(year, month, day),
      });
    }
  }

  return mockEvents;
};

// Lifecycle
onMounted(() => {
  fetchSchedules();
});
</script>

<style scoped>
.schedule-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>