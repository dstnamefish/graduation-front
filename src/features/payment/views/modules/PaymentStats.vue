<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div
      v-for="item in stats"
      :key="item.title"
      class="flex items-center p-6 rounded-[24px] bg-slate-50 border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200 group"
    >
      <!-- Icon Box -->
      <div
        class="flex-cc w-12 h-12 rounded-2xl bg-slate-800 shrink-0 transition-transform duration-300 group-hover:scale-110"
      >
        <WnSvgIcon
          :icon="item.icon"
          :size="24"
          color="white"
        />
      </div>

      <!-- Text Content -->
      <div class="flex flex-col ml-4">
        <span class="text-[13px] text-slate-400 font-medium leading-tight mb-1">
          {{ item.title }}
        </span>
        <span class="text-2xl font-bold text-slate-900 tracking-tight">
          {{ item.value.toLocaleString() }}
        </span>
      </div>

      <!-- Trend Badge -->
      <div
        class="ml-auto px-2.5 py-1 rounded-lg flex items-center gap-1"
        :class="item.isUp ? 'bg-[#D2F9F7] text-[#00B8AC]' : 'bg-[#FFE2E4] text-[#F34D5F]'"
      >
        <WnSvgIcon
          :icon="item.isUp ? 'local-dashboard/trend-up' : 'local-dashboard/trend-down'"
          :size="12"
          :color="item.isUp ? '#00B8AC' : '#F34D5F'"
        />
        <span class="text-[11px] font-bold">{{ item.isUp ? '+' : '' }}{{ item.trend }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WnSvgIcon from '@/shared/ui/core/base/Wn-svg-icon/index.vue';

defineOptions({ name: 'PaymentStats' });

const stats = [
  {
    title: 'Total Invoice',
    value: 865,
    trend: '2.14',
    isUp: true,
    icon: 'local-dashboard/invoice',
  },
  {
    title: 'Paid Invoice',
    value: 289,
    trend: '1.40',
    isUp: true,
    icon: 'solar:shield-check-bold',
  },
  {
    title: 'Pending Invoice',
    value: 98,
    trend: '1.56',
    isUp: false,
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Overdue',
    value: 168,
    trend: '0.37',
    isUp: true,
    icon: 'solar:danger-bold',
  },
];
</script>
