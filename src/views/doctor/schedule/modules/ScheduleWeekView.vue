<template>
  <div class="flex flex-col h-full absolute inset-0 bg-background">
    <div class="grid grid-cols-7 border-b border-border shrink-0 bg-surface-sunken">
      <div
        v-for="(day, index) in weekDaysData"
        :key="index"
        class="py-2 flex flex-col items-center justify-center border-r border-border last:border-r-0"
      >
        <span class="text-xs font-semibold text-placeholder uppercase">
          {{ day.dayName }}
        </span>
        <span
          :class="[
            'text-lg font-bold mt-0.5 w-8 h-8 flex items-center justify-center rounded-full',
            day.isToday ? 'bg-overlay text-title-inverse shadow-md' : 'text-body',
          ]"
        >
          {{ day.dateNum }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-7 flex-1">
      <div
        v-for="(day, index) in weekDaysData"
        :key="index"
        class="border-r border-border last:border-r-0 p-1.5 flex flex-col gap-2 min-h-full"
      >
        <div
          v-for="(event, eventIndex) in day.events"
          :key="event.id"
          :class="[
            'p-2 rounded-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border',
            getAlternatingColorClass(eventIndex),
          ]"
          @click="$emit('event-click', event)"
        >
          <div class="font-bold text-xs leading-tight">
            {{ event.doctorName }}
          </div>
          <div class="text-xs mt-1 opacity-80 line-clamp-2">
            {{ event.title }}
          </div>
          <div class="text-xs font-bold mt-2 flex items-center gap-1">
            <WnSvgIcon icon="ri:time-line" :size="12" />
            {{ event.time }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import type { ScheduleEvent } from '@/types/api/doctor-schedule';

defineOptions({ name: 'ScheduleWeekView' });

const props = defineProps<{
  currentDate: Date;
  events: ScheduleEvent[];
  selectedAgenda: string;
}>();

defineEmits<{
  (e: 'event-click', event: ScheduleEvent): void;
}>();

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// 核心修改：利用 Tailwindcss 主题体系实现交替色
const getAlternatingColorClass = (index: number): string => {
  return index % 2 === 0
    ? 'bg-success-100 border-success-200 text-success-800'
    : 'bg-primary-100 border-primary-200 text-primary-800';
};

const weekDaysData = computed(() => {
  const curr = new Date(props.currentDate);
  const first = curr.getDate() - curr.getDay();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(curr.getFullYear(), curr.getMonth(), first + i);
    days.push({
      ...createDayObject(d),
      dayName: weekDays[i].substring(0, 3),
      dateNum: d.getDate(),
    });
  }
  return days;
});

const createDayObject = (date: Date) => {
  const today = new Date(2028, 6, 1);
  return {
    fullDate: date,
    isToday: date.toDateString() === today.toDateString(),
    events: getEventsForDate(date),
  };
};

const getEventsForDate = (date: Date): ScheduleEvent[] => {
  return props.events.filter((e) => {
    if (props.selectedAgenda && e.type !== props.selectedAgenda) return false;
    return e.date.toDateString() === date.toDateString();
  });
};
</script>