<script setup lang="ts">
import { computed } from 'vue';

// --- 类型定义与常量 ---
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
  SLOT_HEIGHT: 100, // 像素
  BORDER_WIDTH: 4, // 像素 (对应 border-t-4)
  CARD_PADDING_Y: 4, // 像素 (卡片距离上下横线的间距)
  PLACEHOLDER_MARGIN_TOP: 4, // 像素
} as const;

// --- 属性定义 ---
const props = defineProps<{
  date: Date;
  events: CalendarEvent[];
}>();

// --- 计算属性 ---
const formattedDate = computed(() => {
  return props.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
});

/**
 * 辅助函数：将 "10:00 AM" 或 "01:00 PM" 解析为 24 小时制数字。
 * 移出循环以获得更好的性能。
 */
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

  // 1. 将事件处理为 Map 以实现 O(1) 查找
  props.events.forEach((event) => {
    const parts = event.timeRange.split(' - ');
    if (parts.length < 2) return;

    const startH = parseTimeToHour(parts[0]);
    const endH = parseTimeToHour(parts[1]);
    const span = Math.max(1, endH - startH);

    eventMap.set(startH, { event, span });
    // 记录被跨小时事件覆盖的小时
    for (let i = startH + 1; i < startH + span; i++) {
      coveredHours.add(i);
    }
  });

  // 2. 将固定小时映射到视觉插槽
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

// --- 样式辅助函数 ---
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
    <!-- 头部：简单且整洁 -->
    <header class="flex items-center justify-between mb-8">
      <h3 class="text-[#2D3748] font-bold text-lg cursor-default">{{ formattedDate }}</h3>
      <button
        class="add-btn w-9 h-9 bg-[#1A2E44] hover:bg-[#2D4566] cursor-pointer text-white rounded-xl flex items-center justify-center transition-all"
        aria-label="添加日程"
      >
        <WnSvgIcon
          icon="local-common/add"
          :size="20"
        />
      </button>
    </header>

    <!-- 时间轴主体：通过 CSS containment 进行性能优化 -->
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
          <!-- 时间标签：在横线上绝对居中 -->
          <time
            class="hour-label absolute left-[-56px] text-sm text-gray-400 w-12 text-right z-30"
            :style="{ top: 'calc(var(--border-w) / -2)', transform: 'translateY(-50%)' }"
          >
            {{ slot.label }}
          </time>

          <!-- 内容：基于条件的渲染以保持 DOM 轻量 -->
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

          <!-- 'covered' 槽位保持为空，保留 'hour-slot' 高度以保持一致性 -->
        </div>

        <!-- 用于最后小时标签的底部横线 -->
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
/**
 * 性能优化
 */

/* 1. 布局包含 (Layout Containment): 告知浏览器该元素的内部变动不会影响外部布局 */
.hour-slot {
  height: var(--slot-height);
  contain: layout style;
}

.placeholder-slot {
  height: calc(var(--slot-height) - var(--border-w) - (var(--placeholder-mt) * 2));
  margin-top: var(--placeholder-mt);
}

/* 2. 图层提升 (Layer Promotion): 将滚动区域移动到 GPU 以实现更平滑的滚动 */
.timeline-scroll-area {
  will-change: scroll-position;
  backface-visibility: hidden;
  -webkit-overflow-scrolling: touch;
}

/* 3. 文章包含 */
.event-card {
  contain: content; /* 将布局/绘制限制在卡片本身 */
}

/* 自定义滚动条 */
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
