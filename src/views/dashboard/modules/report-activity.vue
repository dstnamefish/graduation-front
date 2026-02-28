<script setup lang="ts">
import { ref } from 'vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';

// --- 类型定义 ---
type ActivityType = 'discharge' | 'admission' | 'maintenance' | 'restock' | 'emergency';

interface ActivityItem {
  id: number;
  content: string;
  time: string;
  iconType: ActivityType;
}

// --- 模拟数据 ---
const dashRecentActivities = ref<ActivityItem[]>([
  {
    id: 1,
    content: 'Felix Müller was discharged from Room 205 after successful treatment',
    time: '08:30 AM',
    iconType: 'discharge',
  },
  {
    id: 2,
    content: 'Léa Rousseau admitted to Room 312 for surgery scheduled later today',
    time: '09:00 AM',
    iconType: 'admission',
  },
  {
    id: 3,
    content: 'MRI machine in Radiology Department received routine maintenance check',
    time: '10:00 AM',
    iconType: 'maintenance',
  },
  {
    id: 4,
    content: 'ICU received restock of essential medications',
    time: '11:00 AM',
    iconType: 'restock',
  },
  {
    id: 5,
    content: 'Code Blue emergency response initiated for a patient in Room 108',
    time: '01:15 PM',
    iconType: 'emergency',
  },
]);

const getActIconName = (type: ActivityType) => {
  return `local-dashboard/${type}`;
};
</script>

<template>
  <div class="w-full bg-[#f5f5f5] rounded-2xl p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8 px-1">
      <div class="flex flex-col gap-0.5">
        <h2 class="text-2xl font-bold text-slate-900">Recent Activity</h2>
      </div>
      <button
        class="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-all active:scale-90"
      >
        <WnSvgIcon
          icon="local-common/more"
          :size="24"
        />
      </button>
    </div>

    <!-- Activity List -->
    <div class="flex flex-col gap-6 relative">
      <!-- Vertical line indicator -->
      <div class="absolute left-5 top-2 bottom-2 w-px bg-slate-100"></div>

      <div
        v-for="item in dashRecentActivities"
        :key="item.id"
        class="flex items-start gap-4 relative z-10 group"
      >
        <!-- Icon Container -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#a2f2ef] text-[#1A2E44]"
        >
          <WnSvgIcon
            :icon="getActIconName(item.iconType)"
            :size="24"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pt-0.5">
          <p class="leading-normal group-hover:text-blue-600 transition-colors">
            {{ item.content }}
          </p>
          <p class="text-xs text-[#666] mt-1.5 uppercase tracking-widest flex items-center gap-1.5">
            {{ item.time }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
