<template>
  <div class="flex flex-col flex-1 h-full gap-6">
    <!-- General Info Box -->
    <div
      class="bg-slate-50 flex flex-col rounded-3xl p-6 xl:p-8 shadow-sm border border-slate-100 shrink-0"
    >
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-sm font-extrabold text-slate-800">General Info</h3>
        <WnIconButton
          icon="ri:more-line"
          :size="18"
          class="text-slate-400"
        />
      </div>

      <div class="grid grid-cols-2 gap-x-8 gap-y-6">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400">Gender</span>
          <span class="text-[13px] font-extrabold text-slate-700">{{ data.gender }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400">Occupation</span>
          <span class="text-[13px] font-extrabold text-slate-700">{{ data.occupation }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400">Age</span>
          <span class="text-[13px] font-extrabold text-slate-700">{{ data.age }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400">Insurance</span>
          <span class="text-[13px] font-extrabold text-slate-700">{{ data.insurance }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400">Date of Birth</span>
          <span class="text-[13px] font-extrabold text-slate-700">{{ data.dob }}</span>
        </div>
      </div>
    </div>

    <!-- Patient Notes Box -->
    <div class="flex-1 flex flex-col bg-white rounded-3xl min-h-0">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-extrabold text-slate-800">Patient Notes</h3>
        <span class="text-[10px] font-bold text-slate-400 cursor-pointer hover:text-slate-600">
          View All
        </span>
      </div>

      <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2 flex-1">
        <div
          v-for="(note, index) in notes"
          :key="index"
          class="bg-slate-50 border border-slate-100/50 shadow-sm rounded-2xl p-5 min-w-[200px] flex-1 flex flex-col"
        >
          <span class="text-[9px] font-bold text-slate-400 mb-2">{{ note.date }}</span>
          <h4 class="text-[13px] font-extrabold text-slate-700 mb-2 truncate">
            {{ note.condition }}
          </h4>
          <p class="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-4">
            {{ note.text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PatientDetailData } from '@/mock/patient-detail';
import WnIconButton from '@/shared/ui/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'PatientDetailGeneral' });

defineProps<{
  data: PatientDetailData['general'];
  notes: PatientDetailData['notes'];
}>();
</script>
