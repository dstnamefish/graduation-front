<template>
  <div class="flex flex-col h-full absolute inset-0 overflow-hidden ">
    <div class="p-4 border-b border-border bg-surface-sunken shrink-0 flex items-center gap-4 z-20">
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
          {{ dayEvents.length }} {{ t('doctorSchedule.doctorsScheduleToday') }}
        </p>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 md:p-6 relative hide-scrollbar">

      <TransitionGroup
        name="list-slide"
        tag="div"
        class="flex flex-col relative w-full"
        appear
      >
        <div
          v-for="(event, index) in dayEvents"
          :key="event.id"
          class="flex items-stretch min-h-24 w-full group"
        >
          <div class="w-20 shrink-0 flex items-center justify-end pr-4 z-10">
            <span class="text-sm font-bold text-slate-600">
              {{ parseTimeDisplay(event.time).main }}
            </span>
            <span class="text-xs font-semibold text-slate-400 ml-1">
              {{ parseTimeDisplay(event.time).period }}
            </span>
          </div>

          <div class="relative w-0.5 flex flex-col items-center shrink-0">
            <div
              class="w-full h-1/2 transition-colors duration-300"
              :class="index === 0 ? 'bg-transparent' : 'bg-slate-200'"
            ></div>
            <div
              class="w-full h-1/2 transition-colors duration-300"
              :class="index === dayEvents.length - 1 ? 'bg-transparent' : 'bg-slate-200'"
            ></div>

            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <div
                :class="[
                  'w-3.5 h-3.5 rounded-full z-10 transition-transform duration-300 group-hover:scale-125',
                  getDotColorClass(index)
                ]"
              ></div>
            </div>
          </div>

          <div class="flex-1 py-3 pl-6 pr-2">
            <div
              :class="[
                'p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                getCardColorClass(index),
              ]"
              @click="$emit('event-click', event)"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-sm text-slate-900">{{ event.doctorName }}</h3>
                  <p class="text-xs opacity-80 mt-1 text-slate-700">{{ event.title }}</p>
                </div>
                <span class="px-2 py-1 bg-white/40 rounded-md text-xs font-bold text-slate-800">
                  {{ parseTimeDisplay(event.time).main }} {{ parseTimeDisplay(event.time).period }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <Transition name="fade">
        <div
          v-if="dayEvents.length === 0"
          class="flex flex-col items-center justify-center h-40 text-placeholder absolute inset-0 m-auto"
        >
          <WnSvgIcon
            icon="ri:calendar-check-line"
            :size="32"
            class="mb-2 opacity-50"
          />
          <p class="text-sm font-semibold">{{ t('doctorSchedule.noSchedules') }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import type { ScheduleEvent } from '@/types/api/doctor-schedule';

defineOptions({ name: 'ScheduleDayView' });

const { t } = useI18n();

const props = defineProps<{
  currentDate: Date;
  events: ScheduleEvent[];
  selectedAgenda: string;
}>();

defineEmits<{
  (e: 'event-click', event: ScheduleEvent): void;
}>();

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const displayDayName = computed(() => {
  const d = new Date(props.currentDate);
  if (isNaN(d.getTime())) return '';
  return weekDays[d.getDay()].substring(0, 3);
});

const displayDateNum = computed(() => {
  const d = new Date(props.currentDate);
  if (isNaN(d.getTime())) return '';
  return d.getDate();
});

const displayFullDate = computed(() => {
  const d = new Date(props.currentDate);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
});

// 使用全局定义的 bg-accent 系列来保持你的指定色
const getCardColorClass = (index: number): string => {
  return index % 2 === 0
    ? 'bg-accent'
    : 'bg-accent-background';
};

// 剥离硬编码的色值，使用相近深度的系统颜色作为描边
const getDotColorClass = (index: number): string => {
  return index % 2 === 0
    ? 'bg-accent border-2 border-focus-border'
    : 'bg-accent-background border-2 border-accent-foreground';
};

const parseTimeDisplay = (timeStr: string) => {
  if (!timeStr) return { main: '', period: '' };

  const parts = timeStr.trim().split(/\s+/);
  if (parts.length === 2) {
    return { main: parts[0], period: parts[1].toUpperCase() };
  }

  const timeParts = timeStr.split(':');
  if (timeParts.length >= 2) {
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const period = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    const displayHours = hours.toString().padStart(2, '0');
    return { main: `${displayHours}:${minutes}`, period };
  }

  return { main: timeStr, period: '' };
};

const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const display = parseTimeDisplay(timeStr);
  let [hours, minutes] = display.main.split(':').map(Number);

  if (display.period === 'PM' && hours !== 12) hours += 12;
  if (display.period === 'AM' && hours === 12) hours = 0;

  return (hours || 0) * 60 + (minutes || 0);
};

const dayEvents = computed(() => {
  return props.events
    .filter((e) => {
      if (props.selectedAgenda && e.type !== props.selectedAgenda) return false;
      if (!e.date) return false;

      const eventDate = e.date instanceof Date ? e.date : new Date(e.date);
      const currDate = new Date(props.currentDate);

      return eventDate.toDateString() === currDate.toDateString();
    })
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
});
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* 错落滑动动画保持不变，提供极佳的进出场体验 */
.list-slide-enter-active,
.list-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.list-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

.list-slide-leave-active {
  position: absolute;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>