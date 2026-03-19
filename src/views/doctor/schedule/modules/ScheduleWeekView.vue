<template>
  <div class="flex flex-col h-full absolute inset-0 overflow-hidden">
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

    <div class="flex-1 grid grid-cols-7 min-h-0 relative">
      <div
        v-for="(day, index) in weekDaysData"
        :key="index"
        class="relative border-r border-border last:border-r-0 overflow-hidden flex flex-col"
      >
        <div
          ref="columnRefs"
          class="flex-1 overflow-y-auto p-1.5 hide-scrollbar"
          @scroll="handleScroll(day.fullDate, $event)"
        >
          <div class="flex flex-col gap-2 pb-12">
            <div
              v-for="(event, eventIndex) in day.events"
              :key="event.id"
              :class="[
                'p-2 rounded-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
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

            <div v-if="day.events.length === 0" class="text-placeholder text-xs text-center py-4">
              {{ t('doctorSchedule.noEvents') }}
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <Transition name="vertical-pop">
            <button
              v-if="showBackToTop[formatDateKey(day.fullDate)]"
              @click="scrollToTop(index, day.fullDate)"
              class="pointer-events-auto w-10 h-10 flex-cc rounded-full 
                     bg-surface border border-border shadow-lg 
                     hover:bg-field-hover hover:scale-110 active:scale-95
                     transition-all duration-300 group"
            >
              <WnSvgIcon
                icon="ri:arrow-up-s-line"
                :size="20"
                class="text-body group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import type { ScheduleEvent } from '@/types/api/doctor-schedule';

defineOptions({ name: 'ScheduleWeekView' });

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

const showBackToTop = ref<Record<string, boolean>>({});
const columnRefs = ref<HTMLElement[]>([]);

const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const handleScroll = (date: Date, event: Event) => {
  const target = event.target as HTMLElement;
  const dateKey = formatDateKey(date);
  showBackToTop.value[dateKey] = target.scrollTop > 200;
};

const scrollToTop = (index: number, date: Date) => {
  if (columnRefs.value[index]) {
    columnRefs.value[index].scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    showBackToTop.value[formatDateKey(date)] = false;
  }
};

const getAlternatingColorClass = (index: number): string => {
  return index % 2 === 0 ? 'bg-accent' : 'bg-accent-background';
};

const weekDaysData = computed(() => {
  const curr = new Date(props.currentDate);
  const first = curr.getDate() - curr.getDay();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(curr.getFullYear(), curr.getMonth(), first + i);
    days.push({
      fullDate: d,
      isToday: d.toDateString() === new Date().toDateString(),
      events: getEventsForDate(d),
      dayName: weekDays[i].substring(0, 3),
      dateNum: d.getDate(),
    });
  }
  return days;
});

const getEventsForDate = (date: Date): ScheduleEvent[] => {
  return props.events.filter((e) => {
    if (props.selectedAgenda && e.type !== props.selectedAgenda) return false;
    if (!e.date) return false;
    // 兼容 Date 对象或字符串
    const eventDate = e.date instanceof Date ? e.date : new Date(e.date);
    return eventDate.toDateString() === date.toDateString();
  });
};

onMounted(() => {
  showBackToTop.value = {};
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

/* 🚀 垂直弹出动画：严格垂直位移，不带任何侧向偏差 */
.vertical-pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.vertical-pop-leave-active {
  transition: all 0.25s ease-in;
}

.vertical-pop-enter-from,
.vertical-pop-leave-to {
  opacity: 0;
  /* 仅在 Y 轴位移，从下方 40px 的位置冒出 */
  transform: translateY(40px) scale(0.5);
}

.vertical-pop-enter-to,
.vertical-pop-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>