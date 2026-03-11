<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Top Part (Indicators Grid) -->
    <div
      class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col pt-8 relative"
    >
      <div class="absolute -top-4 left-6 flex items-center justify-between w-full pr-12">
        <h3 class="text-sm font-extrabold text-slate-800 bg-white px-2">Medical Info</h3>
        <span class="text-[9px] font-bold text-slate-400 bg-white px-2 mt-1">
          Last Updated on: 15 Jun 2028, 10:45 AM
        </span>
        <WnIconButton
          icon="ri:more-line"
          :size="20"
          class="text-slate-400 -mr-4"
        />
      </div>

      <div class="grid grid-cols-3 gap-y-8 gap-x-4">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#c5f0f3] text-[#147d83] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="ri:ruler-line"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Body Height</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.height }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#a5f3e4] text-[#0e5b60] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="solar:body-shape-bold-duotone"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Body Weight</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.weight }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#a5f3e4] text-[#0e5b60] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="solar:dashboard-circle-bold-duotone"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Body Mass Index</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.bmi }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#c5f0f3] text-[#147d83] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="solar:heart-pulse-bold-duotone"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Heart Rate</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.heartRate }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#a5f3e4] text-[#0e5b60] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="ri:pulse-line"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Blood Pressure</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.bp }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#c5f0f3] text-[#147d83] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="ri:syringe-line"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Blood Sugar</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.bloodSugar }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#a5f3e4] text-[#0e5b60] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="solar:drop-bold-duotone"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Cholesterol</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.cholesterol }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#c5f0f3] text-[#147d83] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="solar:wind-bold-duotone"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Respiratory</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.respiratory }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-[#a5f3e4] text-[#0e5b60] flex items-center justify-center"
          >
            <WnSvgIcon
              icon="solar:blood-bold-duotone"
              :size="24"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400">Hemoglobin</span>
            <span class="text-xs font-extrabold text-slate-700">{{ data.hemoglobin }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Lists -->
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <h3 class="text-[10px] font-bold text-slate-400 mb-3">Allergies</h3>
        <ul class="list-disc pl-4 text-xs font-extrabold text-slate-700 space-y-2">
          <li
            v-for="item in data.allergies"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <h3 class="text-[10px] font-bold text-slate-400 mb-3">Conditions</h3>
        <ul class="list-disc pl-4 text-xs font-extrabold text-slate-700 space-y-2">
          <li
            v-for="item in data.conditions"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <h3 class="text-[10px] font-bold text-slate-400 mb-3">Medications</h3>
        <ul class="list-disc pl-4 text-xs font-extrabold text-slate-700 space-y-2">
          <li
            v-for="item in data.medications"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PatientDetailData } from '@/mock/patient-detail';
import WnSvgIcon from '@/shared/ui/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/shared/ui/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'PatientDetailMedical' });

defineProps<{
  data: PatientDetailData['medical'];
}>();
</script>
