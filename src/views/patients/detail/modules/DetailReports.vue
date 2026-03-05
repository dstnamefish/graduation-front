<template>
  <div
    class="bg-slate-50 flex flex-col rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 min-h-0"
  >
    <div class="flex items-center justify-between mb-4 shrink-0">
      <h3 class="text-sm font-extrabold text-slate-800">Health Reports</h3>
      <WnIconButton
        icon="ri:more-line"
        :size="18"
        class="text-slate-400"
      />
    </div>

    <div class="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
      <div
        v-for="report in reports"
        :key="report.id"
        class="bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 hover:shadow-md cursor-pointer transition-shadow"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-xl bg-[#c5f0f3] text-[#147d83] flex items-center justify-center shrink-0"
          >
            <WnSvgIcon
              icon="solar:document-bold-duotone"
              :size="20"
            />
          </div>
          <div class="flex flex-col">
            <h4 class="text-[11px] font-extrabold text-slate-700 truncate w-36">
              {{ report.name }}
            </h4>
            <span class="text-[10px] font-bold text-slate-400 mt-1">{{ report.size }}</span>
          </div>
        </div>
        <WnIconButton
          icon="ri:arrow-right-s-line"
          :size="20"
          class="text-slate-400 bg-transparent!"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PatientDetailData } from '@/mock/patient-detail';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'PatientDetailReports' });

defineProps<{
  reports: PatientDetailData['reports'];
}>();
</script>
