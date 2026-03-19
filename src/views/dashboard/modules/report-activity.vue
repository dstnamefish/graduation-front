<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue'; // 引入 Iconify

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
  const map: Record<ActivityType, string> = {
    discharge: 'hugeicons:tick-02', 
    admission: 'hugeicons:bed',
    maintenance: 'hugeicons:wrench-01',
    restock: 'hugeicons:layers-01',
    emergency: 'hugeicons:alert-circle'
  };
  return map[type];
};
</script>

<template>
  <div class="w-full bg-card rounded-2xl p-6">
    <div class="flex justify-between items-center mb-8 px-1">
      <div class="flex flex-col gap-0.5">
        <h2 class="text-2xl font-bold text-title">Recent Activity</h2>
      </div>
      <button
        class="text-placeholder hover:bg-surface-bg p-2 rounded-xl transition-all active:scale-90"
      >
        <Icon
          icon="hugeicons:more-horizontal"
          width="24"
          height="24"
        />
      </button>
    </div>

    <div class="flex flex-col gap-6 relative">
      <div
        v-for="item in dashRecentActivities"
        :key="item.id"
        class="flex items-start gap-4 relative z-10 group cursor-pointer"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-accent-background text-title shadow-sm"
        >
          <Icon
            :icon="getActIconName(item.iconType)"
            width="24"
            height="24"
          />
        </div>

        <div class="flex-1 min-w-0 pt-0.5">
          <p class="leading-normal text-body group-hover:text-link transition-colors">
            {{ item.content }}
          </p>
          <p class="text-xs text-muted mt-1.5 uppercase tracking-widest flex items-center gap-1.5">
            {{ item.time }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>