<template>
  <div class="flex flex-col h-full absolute inset-0">
    <div class="grid grid-cols-7 border-b border-border shrink-0 bg-foreground">
      <div
        v-for="day in weekDays"
        :key="day"
        class="py-2.5 text-center bg-background text-muted font-bold"
      >
        {{ day.substring(0, 3) }}
      </div>
    </div>
    <div class="grid grid-cols-7 grid-rows-6 flex-1 min-h-0">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'p-1 relative flex flex-col overflow-hidden min-h-0 border-table-border transition-colors',
          !day.isCurrentMonth ? 'bg-stripes pointer-events-none' : 'bg-surface',
          index % 7 !== 6 ? 'border-r' : '',
          index < 35 ? 'border-b' : '',
        ]"
      >
        <div class="flex justify-between items-start pr-1 pl-0.5 pt-0.5 mb-1 shrink-0 w-full">
          <div
            v-if="day.isCurrentMonth && day.events.length > 2"
            class="text-xs font-bold text-slate-400 hover:text-title cursor-pointer mt-0.5 transition-colors"
          >
            +{{ day.events.length - 2 }} more
          </div>
          <div v-else></div>

          <span
            :class="[
              'w-6 h-6 shrink-0 flex-cc rounded-lg text-sm font-medium leading-6',
              day.fullDate.getDay() === 0 && !day.isToday ? 'text-destructive' : 'text-foreground',
              day.isToday ? 'bg-overlay text-white' : '',
              !day.isCurrentMonth ? 'text-muted' : '',
            ]"
          >
            {{ day.date }}
          </span>
        </div>

        <div class="flex-1 overflow-hidden w-full flex flex-col gap-1 px-0.5">
          <template v-if="day.isCurrentMonth">
            <div
              v-for="(event, eventIndex) in day.events.slice(0, 2)"
              :key="event.id"
              :class="[
                'px-2 py-1.5 rounded-lg text-left cursor-pointer flex flex-col',
                getAlternatingColorClass(eventIndex),
              ]"
              @click="$emit('event-click', event)"
            >
              <div class="text-foreground font-semibold text-sm w-full">
                {{ event.doctorName }}
              </div>
              <div
                v-if="day.events.length === 1"
                class="text-sm mt-0.5 text-muted"
              >
                {{ event.type }}
              </div>
              <div class="text-sm text-body mt-0.5">
                {{ event.time }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScheduleEvent } from '@/types/api/doctor-schedule';

defineOptions({ name: 'ScheduleMonthView' });

const props = defineProps<{
  currentDate: Date;
  events: ScheduleEvent[];
  selectedAgenda: string;
}>();

defineEmits<{
  (e: 'event-click', event: ScheduleEvent): void;
}>();

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getAlternatingColorClass = (index: number): string => {
  return index % 2 === 0 ? 'bg-accent' : 'bg-accent-background';
};

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear();
  const month = props.currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let i = firstDay.getDay() - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(createDayObject(d, false));
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(createDayObject(new Date(year, month, i), true));
  }
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(createDayObject(new Date(year, month + 1, i), false));
  }
  return days;
});

const createDayObject = (date: Date, isCurrentMonth: boolean) => {
  const today = new Date(2028, 6, 1);
  return {
    date: date.getDate(),
    fullDate: date,
    isCurrentMonth,
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

<style scoped>
.bg-stripes {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    var(--color-slate-100) 20px,
    var(--color-slate-100) 20px
  );
}
</style>
