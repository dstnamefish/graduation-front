<script setup lang="ts">
import type { HealthReport } from '@/types/patient';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'PatientDetailReports' });

defineProps<{
  reports: HealthReport[];
}>();

const formatSize = (kb: number) => {
  if (!kb) return '0 KB';
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};
</script>

<template>
  <div class="bg-card flex flex-col rounded-2xl p-6 border border-border flex-1">
    <div class="flex items-center justify-between mb-5 shrink-0">
      <h3 class="text-base font-bold text-title">Health Reports</h3>
    </div>

    <div class="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
      <div
        v-for="report in reports"
        :key="report.id"
        class="bg-surface rounded-xl p-4 flex items-center justify-between border border-border hover:shadow-sm cursor-pointer transition-shadow"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-accent-background text-primary-700 flex items-center justify-center shrink-0"
          >
            <WnSvgIcon
              icon="solar:document-bold-duotone"
              :size="26"
            />
          </div>
          <div class="flex flex-col gap-0.5">
            <h4 class="text-sm font-bold text-title truncate w-36">
              {{ report.reportName }}
            </h4>
            <span class="text-xs font-medium text-muted">{{ formatSize(report.fileSize) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
