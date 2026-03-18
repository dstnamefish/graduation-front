<template>
  <div class="flex flex-col h-full absolute inset-0 overflow-hidden bg-background">
    <div class="p-4 border-b border-border bg-surface-sunken shrink-0 flex items-center gap-4">
      <div class="w-14 h-14 bg-overlay text-title-inverse rounded-2xl flex flex-col items-center justify-center shadow-md">
        <span class="text-xs font-medium uppercase opacity-80">
          {{ displayDayName }}
        </span>
        <span class="text-xl font-bold leading-none mt-0.5">
          {{ displayDateNum }}
        </span>
      </div>
      <div>
        <h2 class="text-lg font-bold text-title">{{ displayFullDate }}</h2>
        <p class="text-xs text-muted font-medium">
          {{ dayEvents.length }} Appointments today
        </p>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-6 relative">
      <div class="absolute left-16 top-0 bottom-0 w-0.5 bg-border"></div>

      <div class="flex flex-col gap-6">
        <div
          v-for="(event, index) in dayEvents"
          :key="event.id"
          class="relative flex gap-6"
        >
          <div class="w-10 shrink-0 text-right pt-2 relative z-10">
            <span class="text-xs font-bold text-muted">
              {{ event.time.split(' ')[0] }}
            </span>
            <span class="text-xs font-semibold text-placeholder block">
              {{ event.time.split(' ')[1] }}
            </span>
          </div>

          <div class="absolute left-10 top-3 w-3 h-3 rounded-full bg-surface border-4 border-slate-800 ml-1.5 z-10 shadow-sm"></div>

          <div
            :class="[
              'flex-1 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border ml-2',
              getAlternatingColorClass(index),
            ]"
            @click="$emit('event-click', event)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-sm">{{ event.doctorName }}</h3>
                <p class="text-xs opacity-80 mt-1">{{ event.title }}</p>
              </div>
              <span class="px-2 py-1 bg-white/40 rounded-md text-xs font-bold">
                {{ event.time }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="dayEvents.length === 0"
        class="flex flex-col items-center justify-center h-40 text-placeholder"
      >
        <WnSvgIcon
          icon="ri:calendar-check-line"
          :size="32"
          class="mb-2 opacity-50"
        />
        <p class="text-sm font-semibold">No schedules for this day.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import type { ScheduleEvent } from '@/types/api/doctor-schedule';

defineOptions({ name: 'ScheduleDayView' });

const props = defineProps<{
  currentDate: Date;
  events: ScheduleEvent[];
  selectedAgenda: string;
}>();

defineEmits<{
  (e: 'event-click', event: ScheduleEvent): void;
}>();

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// 🚀 新增安全计算属性：提取星期前三个字母 (如 Mon)
const displayDayName = computed(() => {
  // 防御性编程：确保传来的是正确的 Date 对象
  const d = new Date(props.currentDate);
  if (isNaN(d.getTime())) return '';
  return weekDays[d.getDay()].substring(0, 3);
});

// 🚀 新增安全计算属性：提取号数 (如 12)
const displayDateNum = computed(() => {
  const d = new Date(props.currentDate);
  if (isNaN(d.getTime())) return '';
  return d.getDate();
});

// 🚀 新增安全计算属性：格式化完整日期 (如 July 1, 2028)
const displayFullDate = computed(() => {
  const d = new Date(props.currentDate);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
});

const getAlternatingColorClass = (index: number): string => {
  return index % 2 === 0
    ? 'bg-success-100 border-success-200 text-success-800'
    : 'bg-primary-100 border-primary-200 text-primary-800';
};

const dayEvents = computed(() => {
  return props.events
    .filter((e) => {
      if (props.selectedAgenda && e.type !== props.selectedAgenda) return false;

      // 使用更安全的日期对比方式
      const eventDateStr = new Date(e.date).toDateString();
      const currDateStr = new Date(props.currentDate).toDateString();

      return eventDateStr === currDateStr;
    })
    .sort((a, b) => {
      return (
        new Date('1970/01/01 ' + a.time).getTime() -
        new Date('1970/01/01 ' + b.time).getTime()
      );
    });
});
</script>