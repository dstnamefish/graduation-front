<template>
  <div
    class="flex items-center justify-between w-full bg-slate-50 rounded-2xl p-4 shadow-sm border border-slate-100"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-16 h-16 rounded-2xl overflow-hidden bg-[#a5f3e4] border-2 border-white shadow-sm shrink-0"
      >
        <img
          :src="data.avatar"
          :alt="data.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-extrabold text-slate-800">{{ data.name }}</h2>
          <div
            class="px-2 py-0.5 rounded-lg bg-[#1b253b] text-white text-[10px] font-bold tracking-wider"
          >
            {{ data.status }}
          </div>
        </div>
        <p class="text-xs font-bold text-slate-400">
          Patient ID:
          <span class="text-slate-600">{{ data.id }}</span>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <WnIconButton
        icon="ri:printer-line"
        :size="18"
        class="text-slate-500 bg-white border border-slate-200 hover:border-slate-300 shadow-sm"
      />
      <WnIconButton
        icon="ri:phone-line"
        :size="18"
        class="text-slate-500 bg-white border border-slate-200 hover:border-slate-300 shadow-sm"
      />
      <WnButton
        type="primary"
        class="bg-[#1b253b]! hover:bg-[#2a3655]! border-none! rounded-xl! px-6! shadow-md"
      >
        Edit Data
      </WnButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PatientDetailData } from '@/mock/patient-detail';
import WnIconButton from '@/shared/ui/core/widget/Wn-icon-button/index.vue';
import WnButton from '@/shared/ui/core/base/Wn-button/index.vue';

defineOptions({ name: 'PatientDetailBanner' });

defineProps<{
  data: PatientDetailData;
}>();
</script>
