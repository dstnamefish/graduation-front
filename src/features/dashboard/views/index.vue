<template>
  <div class="flex min-h-screen items-stretch pb-6">
    <!-- 左侧主内容区域 -->
    <main class="flex-1 pr-6 space-y-6 min-w-0 flex flex-col">
      <!-- 顶部数据卡片 -->
      <CardList class="shrink-0" />

      <!-- 第二行：病历概览(年龄) & 收入分析 -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 shrink-0">
        <PatientOverviewAge class="max-w-none!" />
        <RevenueChart class="max-w-none!" />
      </div>

      <!-- 第三行：病历概览(分类) & 医生排班 & 简报 -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 shrink-0">
        <PatientOverviewDepartment class="max-w-none!" />
        <DoctorSchedule class="max-w-none!" />
        <Report class="max-w-none!" />
      </div>

      <!-- 第四行：预约详情表格 (Flexible height to fill bottom)-->
      <div class="overflow-hidden flex-1 min-h-0">
        <PatientAppointment class="h-full" />
      </div>
    </main>

    <!-- 右侧侧边栏：日历 & 本日议程 & 最近活动 -->
    <aside class="hidden xl:flex w-[460px] flex-col gap-6 pl-0 backdrop-blur-xl">
      <!-- 背景 -->
      <div
        class="bg-[#f5f5f5] rounded-2xl p-6 border border-[#f5f5f5] flex flex-col flex-1 min-h-0"
      >
        <!-- 日历 -->
        <div class="shrink-0">
          <MiniCalendar v-model="selectedDate" />
        </div>

        <div class="mx-2 my-2 shrink-0"></div>

        <!-- 今日议程 -->
        <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 -mr-1">
          <DailyAgenda
            :date="selectedDate"
            :events="currentEvents"
          />
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="shrink-0">
        <RecentActivity />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import CardList from './modules/card-list.vue';
import PatientOverviewAge from './modules/patient-overview-age.vue';
import RevenueChart from './modules/revenue-chart.vue';
import PatientOverviewDepartment from './modules/patient-overview-department.vue';
import DoctorSchedule from './modules/doctor-schedule.vue';
import Report from './modules/report.vue';
import PatientAppointment from './modules/patient-appointment.vue';
import MiniCalendar from './modules/mini-calendar.vue';
import DailyAgenda from './modules/daily-agenda.vue';
import RecentActivity from './modules/report-activity.vue';

defineOptions({ name: 'Dashboard' });

interface CalendarEvent {
  id: number;
  title: string;
  timeRange: string;
  type: 'meeting' | 'consultation' | 'surgery' | 'break' | 'training';
  description?: string;
}

// 1. 状态：当前选中的日期
const selectedDate = ref(new Date(2028, 6, 12)); // 6 表示 7月

// 2. 模拟数据 (Key 为 YYYY-MM-DD)
const mockDatabase: Record<string, CalendarEvent[]> = {
  '2028-07-12': [
    { id: 1, title: 'Morning Staff Meeting', timeRange: '08:00 AM - 09:00 AM', type: 'meeting' },
    {
      id: 2,
      title: 'Patient Consultation - Gen Med',
      timeRange: '10:00 AM - 12:00 PM',
      type: 'consultation',
    },
    { id: 3, title: 'Break / Admin', timeRange: '12:00 PM - 01:00 PM', type: 'break' },
    { id: 4, title: 'Surgery - Orthopedics', timeRange: '01:00 PM - 03:00 PM', type: 'surgery' },
    { id: 5, title: 'Training Session', timeRange: '04:00 PM - 05:00 PM', type: 'meeting' },
  ],
  '2028-07-13': [
    { id: 6, title: 'Emergency Review', timeRange: '09:00 AM - 10:00 AM', type: 'consultation' },
  ],
};

// 3. 计算属性：获取选中日期的事件
const currentEvents = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.value.getDate()).padStart(2, '0');
  const key = `${year}-${month}-${day}`;

  return mockDatabase[key] || [];
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
