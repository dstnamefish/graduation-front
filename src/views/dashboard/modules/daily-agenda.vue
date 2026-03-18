<script setup lang="ts">
import { computed } from 'vue';

interface CalendarEvent {
  id: number;
  title: string;
  timeRange: string;
  type: 'meeting' | 'consultation' | 'surgery' | 'break' | 'training';
  description?: string;
}

const CONFIG = {
  START_HOUR: 8,
  END_HOUR: 17,
  SLOT_HEIGHT: 100,
  BORDER_WIDTH: 4,
  CARD_PADDING_Y: 4,
  PLACEHOLDER_MARGIN_TOP: 4,
} as const;

const props = defineProps<{
  date: Date;
  events: CalendarEvent[];
}>();

const formattedDate = computed(() => {
  return props.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
});

const parseTimeToHour = (timeStr: string): number => {
  const parts = timeStr.trim().split(' ');
  if (parts.length < 2) return 0;

  const [time, modifier] = parts;
  let [h] = time.split(':').map(Number);
  if (modifier === 'PM' && h !== 12) h += 12;
  if (modifier === 'AM' && h === 12) h = 0;
  return h;
};

const timelineData = computed(() => {
  const eventMap = new Map<number, { event: CalendarEvent; span: number }>();
  const coveredHours = new Set<number>();

  props.events.forEach((event) => {
    const parts = event.timeRange.split(' - ');
    if (parts.length < 2) return;

    const startH = parseTimeToHour(parts[0]);
    const endH = parseTimeToHour(parts[1]);
    const span = Math.max(1, endH - startH);

    eventMap.set(startH, { event, span });
    for (let i = startH + 1; i < startH + span; i++) {
      coveredHours.add(i);
    }
  });

  const result = [];
  for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour++) {
    const label = `${(hour > 12 ? hour - 12 : hour).toString().padStart(2, '0')}:00`;

    if (coveredHours.has(hour)) {
      result.push({ hour, label, type: 'covered' as const });
    } else if (eventMap.has(hour)) {
      const { event, span } = eventMap.get(hour)!;
      result.push({ hour, label, type: 'event' as const, event, span });
    } else {
      result.push({ hour, label, type: 'placeholder' as const });
    }
  }
  return result;
});

const getEventTheme = (type: CalendarEvent['type']) => {
  const themes = {
    meeting: 'bg-[#a2f2ef] text-[#1A2E44]',
    surgery: 'bg-[#a2f2ef] text-[#1A2E44]',
    consultation: 'bg-[#dff9fa] text-[#1A2E44]',
    training: 'bg-[#dff9fa] text-[#1A2E44]',
    break: 'bg-[#f0f0f0] text-[#718096]',
  };
  return themes[type] || 'bg-[#f0f0f0] text-[#1A2E44]';
};
</script>

<template>
  <div
    class="agenda-container flex flex-col bg-white rounded-3xl p-6 h-full shadow-sm w-full mx-auto"
    :style="{
      '--slot-height': `${CONFIG.SLOT_HEIGHT}px`,
      '--card-pad-y': `${CONFIG.CARD_PADDING_Y}px`,
      '--border-w': `${CONFIG.BORDER_WIDTH}px`,
      '--placeholder-mt': `${CONFIG.PLACEHOLDER_MARGIN_TOP}px`,
    }"
  >
    <header class="flex items-center justify-between mb-8">
      <h3 class="text-[#2D3748] font-bold text-lg cursor-default">{{ formattedDate }}</h3>
      <button
        class="add-btn w-9 h-9 bg-[#1A2E44] hover:bg-[#2D4566] cursor-pointer text-white rounded-xl flex items-center justify-center transition-all"
        aria-label="Add event"
      >
        <WnSvgIcon
          icon="local-actions/add"
          :size="20"
        />
      </button>
    </header>

    <div class="timeline-scroll-area flex-1 overflow-y-auto pr-2 pl-14 custom-scrollbar">
      <div class="timeline-list flex flex-col">
        <div
          v-for="slot in timelineData"
          :key="slot.hour"
          class="hour-slot relative border-[#f0f0f0]"
          :class="[slot.hour === CONFIG.START_HOUR ? 'mt-8' : '']"
          :style="{
            zIndex: slot.type === 'event' ? 20 : 1,
            borderTopWidth: 'var(--border-w)',
            borderTopStyle: 'solid',
          }"
        >
          <time
            class="hour-label absolute left-[-56px] text-sm text-gray-400 w-12 text-right z-30"
            :style="{ top: 'calc(var(--border-w) / -2)', transform: 'translateY(-50%)' }"
          >
            {{ slot.label }}
          </time>

          <div
            v-if="slot.type === 'event' && slot.event"
            class="content-wrapper relative h-full"
          >
            <article
              class="event-card absolute left-0 right-0 rounded-2xl p-4 flex flex-col justify-start border transition-all cursor-pointer border-transparent z-10"
              :class="getEventTheme(slot.event.type)"
              :style="{
                top: 'var(--card-pad-y)',
                height: `calc((${slot.span} * var(--slot-height)) - var(--border-w) - (var(--card-pad-y) * 2))`,
              }"
            >
              <h4 class="font-bold text-sm mb-1.5 leading-snug">{{ slot.event.title }}</h4>
              <p class="text-xs font-medium opacity-60">{{ slot.event.timeRange }}</p>
            </article>
          </div>

          <div
            v-else-if="slot.type === 'placeholder'"
            class="placeholder-slot bg-[#f0f0f0] rounded-xl w-full border border-red-100/30 transition-colors hover:bg-red-50"
          ></div>
        </div>

        <div
          class="hour-slot relative border-[#f0f0f0] h-0"
          :style="{ borderTopWidth: 'var(--border-w)', borderTopStyle: 'solid' }"
        >
          <time
            class="hour-label absolute left-[-56px] text-sm text-gray-400 w-12 text-right z-30"
            :style="{ top: 'calc(var(--border-w) / -2)', transform: 'translateY(-50%)' }"
          >
            {{ CONFIG.END_HOUR + 1 }}:00
          </time>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hour-slot {
  height: var(--slot-height);
  contain: layout style;
}

.placeholder-slot {
  height: calc(var(--slot-height) - var(--border-w) - (var(--placeholder-mt) * 2));
  margin-top: var(--placeholder-mt);
}

.timeline-scroll-area {
  will-change: scroll-position;
  backface-visibility: hidden;
  -webkit-overflow-scrolling: touch;
}

.event-card {
  contain: content;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 99px;
  background-color: #edf2f7;
}
</style>
