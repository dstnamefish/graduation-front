<template>
  <div
    class="flex flex-col h-full overflow-hidden bg-surface border border-border rounded-2xl z-10"
  >
    <ScheduleHeader
      v-model="currentView"
      v-model:selected-agenda="selectedAgenda"
      :current-date="currentDate"
      :week-days-data="weekDaysData"
      @navigate="handleNavigate"
      @today="goToToday"
      @add="handleAddSchedule"
    />

    <div class="flex-1 min-h-0 relative overflow-hidden">
      <Transition
        name="view-fade"
        mode="out-in"
      >
        <ScheduleMonthView
          v-if="currentView === 'Month'"
          :current-date="currentDate"
          :events="events"
          :selected-agenda="selectedAgenda"
          @event-click="handleEventClick"
          @view-change="handleViewChange"
        />

        <ScheduleWeekView
          v-else-if="currentView === 'Week'"
          :current-date="currentDate"
          :events="events"
          :selected-agenda="selectedAgenda"
          @event-click="handleEventClick"
        />

        <ScheduleDayView
          v-else-if="currentView === 'Day'"
          :current-date="currentDate"
          :events="events"
          :selected-agenda="selectedAgenda"
          @event-click="handleEventClick"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import ScheduleHeader from './modules/ScheduleHeader.vue';
import ScheduleMonthView from './modules/ScheduleMonthView.vue';
import ScheduleWeekView from './modules/ScheduleWeekView.vue';
import ScheduleDayView from './modules/ScheduleDayView.vue';
import { fetchCalendar } from '@/api/appointment';
import type { AgendaEvent } from '@/types/api/appointment';
import type { ScheduleEvent } from '@/types/api/doctor-schedule';

defineOptions({ name: 'DoctorsSchedule' });

const { t } = useI18n();

const currentDate = ref(new Date(2028, 6, 1));
const currentView = ref<'Day' | 'Week' | 'Month'>('Month');
const selectedAgenda = ref('');
const events = ref<ScheduleEvent[]>([]);

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const weekDaysData = computed(() => {
  const curr = new Date(currentDate.value);
  const first = curr.getDate() - curr.getDay();
  const days = [];
  const today = new Date(2028, 6, 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(curr.getFullYear(), curr.getMonth(), first + i);
    days.push({
      fullDate: d,
      isToday: d.toDateString() === today.toDateString(),
      events: getEventsForDate(d),
      dayName: weekDays[i].substring(0, 3),
      dateNum: d.getDate(),
    });
  }
  return days;
});

const getEventsForDate = (date: Date): ScheduleEvent[] => {
  return events.value.filter((e) => {
    if (selectedAgenda.value && e.type !== selectedAgenda.value) return false;
    return e.date.toDateString() === date.toDateString();
  });
};

const getDateRange = () => {
  let startDate = new Date();
  let endDate = new Date();

  if (currentView.value === 'Month') {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    startDate = new Date(year, month, 1 - startOffset);
    endDate = new Date(year, month + 1, 42 - (lastDay.getDate() + startOffset));
  } else if (currentView.value === 'Week') {
    const curr = new Date(currentDate.value);
    const first = curr.getDate() - curr.getDay();
    startDate = new Date(curr.getFullYear(), curr.getMonth(), first);
    endDate = new Date(curr.getFullYear(), curr.getMonth(), first + 6);
  } else {
    startDate = currentDate.value;
    endDate = currentDate.value;
  }

  const formatLocalYYYYMMDD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    startDate: formatLocalYYYYMMDD(startDate),
    endDate: formatLocalYYYYMMDD(endDate),
  };
};

const mapColorTheme = (colorTheme: string): 'mint' | 'cyan' | 'purple' => {
  const themeMap: Record<string, 'mint' | 'cyan' | 'purple'> = {
    green: 'mint',
    blue: 'cyan',
    purple: 'purple',
  };
  return themeMap[colorTheme] || 'cyan';
};

const fetchSchedules = async () => {
  const { startDate, endDate } = getDateRange();

  try {
    const data = await fetchCalendar({
      startDate,
      endDate,
    });

    events.value = data.map((item: AgendaEvent) => ({
      id: item.id,
      title: item.description,
      doctorName: item.doctorName,
      time: item.time,
      date: new Date(item.date),
      type: getTypeFromDescription(item.description),
      color: mapColorTheme(item.colorTheme),
      status: item.status,
    }));
  } catch (error) {
    console.error('Failed to fetch agenda', error);
    ElMessage.error(t('doctorSchedule.loadFailed'));
    events.value = [];
  }
};

const getTypeFromDescription = (description: string): string => {
  if (
    description.toLowerCase().includes('checkup') ||
    description.toLowerCase().includes('check-up')
  ) {
    return 'checkup';
  }
  if (description.toLowerCase().includes('surgery')) {
    return 'surgery';
  }
  if (description.toLowerCase().includes('consultation')) {
    return 'consultation';
  }
  return '';
};

const handleNavigate = (direction: number) => {
  const newDate = new Date(currentDate.value);
  if (currentView.value === 'Month') {
    newDate.setMonth(newDate.getMonth() + direction);
  } else if (currentView.value === 'Week') {
    newDate.setDate(newDate.getDate() + direction * 7);
  } else {
    newDate.setDate(newDate.getDate() + direction);
  }
  currentDate.value = newDate;
  fetchSchedules();
};

const goToToday = () => {
  currentDate.value = new Date(2028, 6, 1);
  fetchSchedules();
};

watch(currentView, () => {
  fetchSchedules();
});

const handleAddSchedule = () => {
  ElMessage.success(t('doctorSchedule.openingScheduleForm'));
};

const handleEventClick = (event: ScheduleEvent) => {
  ElMessage.success(`Doctor: ${event.doctorName} - ${event.time}`);
};

const handleViewChange = (view: 'Day' | 'Week' | 'Month', date: Date) => {
  currentView.value = view;
  currentDate.value = date;
};

onMounted(() => {
  fetchSchedules();
});
</script>

<style scoped>
.view-fade-enter-active,
.view-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-fade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.view-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}
</style>
