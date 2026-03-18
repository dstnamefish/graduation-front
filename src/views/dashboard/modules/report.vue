<template>
  <div class="p-6 rounded-3xl border-2 border-[#e7e7e9] w-full">
    <div class="flex justify-between items-center mb-8">
      <div class="flex flex-col gap-0.5">
        <h2 class="text-2xl font-bold text-slate-900">Report</h2>
      </div>
      <button
        class="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-all active:scale-95"
      >
        <WnSvgIcon
          icon="local-system/more"
          :size="20"
        />
      </button>
    </div>

    <div class="max-h-[480px] overflow-y-auto custom-scrollbar">
      <div class="flex flex-col gap-3">
        <div
          v-for="item in dashboardReports"
          :key="item.id"
          class="group flex items-center p-3 rounded-2xl cursor-pointer bg-[#f5f5f5] border border-transparent"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-[#a2f2ef]"
          >
            <WnSvgIcon
              :icon="getReportIcon(item.iconType)"
              :size="20"
            />
          </div>

          <div class="flex-1 ml-3 mr-2 min-w-0">
            <h4 class="text-sm text-slate-900">
              {{ item.title }}
            </h4>
            <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
              {{ item.time }}
            </p>
          </div>

          <WnSvgIcon
            icon="local-directions/chevron-right"
            :size="16"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';

defineOptions({ name: 'Report' });

type ReportType = 'cleaning' | 'maintenance' | 'restock' | 'issue' | 'transport';

interface ReportItem {
  id: number;
  title: string;
  time: string;
  iconType: ReportType;
}

const dashboardReports = ref<ReportItem[]>([
  { id: 1, title: 'Room Cleaning Needed', time: '1 minutes ago', iconType: 'cleaning' },
  { id: 2, title: 'Equipment Maintenance', time: '3 minutes ago', iconType: 'maintenance' },
  { id: 3, title: 'Medication Restock', time: '5 minutes ago', iconType: 'restock' },
  { id: 4, title: 'HVAC System Issue', time: '1 hour ago', iconType: 'issue' },
  { id: 5, title: 'Patient Transport Required', time: 'Yesterday', iconType: 'transport' },
  { id: 6, title: 'Oxygen Tank Low', time: '2 hours ago', iconType: 'restock' },
  { id: 7, title: 'Ventilator Service', time: '4 hours ago', iconType: 'maintenance' },
  { id: 8, title: 'Ward 3 Cleaning', time: '5 hours ago', iconType: 'cleaning' },
  { id: 9, title: 'Lab Results Ready', time: '6 hours ago', iconType: 'transport' },
  { id: 10, title: 'AC Filter Check', time: '8 hours ago', iconType: 'issue' },
]);

const getReportIcon = (type: ReportType) => {
  const map: Record<ReportType, string> = {
    cleaning: 'local-business/cleaning',
    maintenance: 'local-system/maintenance',
    restock: 'local-actions/restock',
    issue: 'local-status/issue',
    transport: 'local-business/transport'
  };
  return map[type];
};
</script>
