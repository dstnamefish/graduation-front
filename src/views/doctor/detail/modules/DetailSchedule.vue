<template>
  <div class="h-full flex flex-col bg-surface rounded-3xl p-6 xl:p-8 border border-border overflow-hidden">
    <!-- 头部区域 -->
    <div class="flex items-center justify-between mb-6 shrink-0">
      <h3 class="text-base font-bold text-title">{{ t('doctors.schedule.title') }}</h3>
      <WnIconButton icon="ri:more-line" :size="20" class="text-muted shrink-0" />
    </div>

    <!-- 迷你日历选择器 -->
    <div class="bg-accent rounded-2xl p-2 flex items-center justify-between mb-6 shrink-0 relative">
      <WnIconButton icon="ri:arrow-left-s-line" :size="20" @click="scrollDates('left')" class="text-primary shrink-0 transition-transform hover:-translate-x-0.5" />
      <div ref="dateScrollContainer" class="flex flex-1 items-center px-1 overflow-x-auto no-scrollbar scroll-smooth">
        <div v-for="(day, idx) in calendarDays" :key="idx" class="flex items-center shrink-0">
          <div @click="selectDate(day)" class="flex flex-col items-center justify-center min-w-[48px] h-[52px] rounded-xl cursor-pointer transition-colors duration-300" :class="day.isActive ? 'bg-slate-800 text-white' : 'hover:bg-white/50 text-muted'">
            <span class="text-[9px] uppercase mb-1" :class="day.isActive ? 'opacity-80' : 'text-muted'">
              {{ day.weekDay }}
            </span>
            <span class="text-sm font-bold leading-none" :class="day.isActive ? '' : (day.hasAppt ? 'text-title' : 'text-placeholder')">
              {{ day.date }}
            </span>
          </div>
          <div v-if="idx < calendarDays.length - 1" class="w-[1px] h-6 bg-border mx-1 shrink-0"></div>
        </div>
      </div>
      <WnIconButton icon="ri:arrow-right-s-line" :size="20" @click="scrollDates('right')" class="text-primary shrink-0 transition-transform hover:translate-x-0.5" />
    </div>

    <!-- 当前日期摘要 -->
    <p class="text-[11px] font-bold text-muted mb-4 shrink-0 px-2 tracking-wide">
      {{ schedule.length }} {{ t('doctors.schedule.schedulesToday') }}
    </p>

    <!-- 可滚动的日程列表 -->
    <div class="flex-1 overflow-y-auto no-scrollbar flex flex-col px-1 pb-4">
      <div v-for="(item, index) in schedule" :key="index" class="flex gap-4 group cursor-pointer pt-3 pb-4 border-b border-border last:border-transparent">
        <!-- 自定义侧边栏颜色指示器 -->
        <div class="w-1.5 min-h-[44px] rounded-full shrink-0" :class="getSidebarColor(item.status)"></div>

        <div class="flex flex-col flex-1 justify-center">
          <h4 class="text-sm font-bold text-title leading-tight mb-1.5 transition-colors group-hover:text-primary-600">
            {{ item.patientName }}
          </h4>
          <div class="flex items-center gap-2">
            <span class="text-[11.5px] font-bold text-muted">{{ item.treatment }}</span>
            <span class="w-1 h-1 rounded-full bg-border"></span>
            <span class="text-[11.5px] font-medium text-muted">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AppointmentSchedule } from '@/types/api/doctor';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'DetailSchedule' });

const { t } = useI18n();

const props = defineProps<{
  schedule: AppointmentSchedule[];
}>();

// 模拟的当前周日历数据（仅用于UI展示）
const calendarDays = ref([
  { weekDay: 'Mon', date: '17', isActive: false, hasAppt: false },
  { weekDay: 'Tue', date: '18', isActive: false, hasAppt: false },
  { weekDay: 'Wed', date: '19', isActive: false, hasAppt: true },
  { weekDay: 'Thu', date: '20', isActive: true, hasAppt: true }, // 默认假设今日
  { weekDay: 'Fri', date: '21', isActive: false, hasAppt: false },
  { weekDay: 'Sat', date: '22', isActive: false, hasAppt: false },
]);

// 滚动容器逻辑
const dateScrollContainer = ref<HTMLElement | null>(null);

const scrollDates = (direction: 'left' | 'right') => {
  if (dateScrollContainer.value) {
    const scrollAmount = 100; // 每次点击波动的滚动距离
    if (direction === 'left') {
      dateScrollContainer.value.scrollLeft -= scrollAmount;
    } else {
      dateScrollContainer.value.scrollLeft += scrollAmount;
    }
  }
};

// 选择日期逻辑
const selectDate = (selectedDay: any) => {
  calendarDays.value.forEach(d => {
    d.isActive = (d === selectedDay);
  });
  // 如果日后需要的话，可以在这里emit给父组件触发请求
};

// 获取与原图风格匹配的侧边指示条颜色
const getSidebarColor = (status: number) => {
  switch (status) {
    case 1:
      return 'bg-primary-300';
    case 2:
      return 'bg-primary-200';
    case 3:
      return 'bg-red-100'; // 或者其它浅粉红的语义色以匹配图中第四个条目
    default:
      return 'bg-slate-100';
  }
};
</script>
