<template>
  <div
    class="flex flex-col bg-slate-50 rounded-3xl p-6 xl:p-8 shadow-sm border border-slate-100 h-full"
  >
    <div class="flex items-center justify-between mb-8 shrink-0">
      <h3 class="text-sm font-extrabold text-slate-800">Contact Info</h3>
      <WnIconButton
        icon="ri:more-line"
        :size="18"
        class="text-slate-400"
      />
    </div>

    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-1.5">
        <span class="text-[10px] font-bold text-slate-400">Phone Number</span>
        <span class="text-xs font-extrabold text-slate-700">{{ data.phone }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="text-[10px] font-bold text-slate-400">Email</span>
        <span class="text-xs font-extrabold text-[#147d83]">{{ data.email }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="text-[10px] font-bold text-slate-400">Address</span>
        <span class="text-xs font-extrabold text-slate-700 leading-relaxed whitespace-pre-line">
          {{ data.address }}
        </span>
      </div>

      <div class="flex flex-col gap-1.5 mt-4">
        <span class="text-[10px] font-bold text-slate-400">Emergency Contact</span>
        <span class="text-[11px] font-extrabold text-slate-700">{{ data.emergencyName }}</span>
        <span class="text-xs font-extrabold text-slate-700">{{ data.emergencyPhone }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PatientDetailData } from '@/mock/patient-detail';
import WnIconButton from '@/shared/ui/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'PatientDetailContact' });

defineProps<{
  data: PatientDetailData['contact'];
}>();
</script>
