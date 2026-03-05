<template>
  <div
    class="h-full flex flex-col bg-slate-50 rounded-3xl p-6 xl:p-8 shadow-sm border border-slate-100 flex-[1.5] min-h-0"
  >
    <div class="flex items-center justify-between mb-6 shrink-0">
      <h3 class="text-sm font-extrabold text-slate-800">Appointment</h3>
      <WnIconButton
        icon="ri:more-line"
        :size="18"
        class="text-slate-400"
      />
    </div>

    <!-- Upcoming -->
    <div class="flex flex-col mb-8 shrink-0">
      <h4 class="text-[11px] font-bold text-slate-400 mb-4">Upcoming</h4>
      <div
        v-if="appointments.upcoming"
        class="bg-white border-l-4 border-[#a5f3e4] rounded-2xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-extrabold text-slate-700">
            {{ appointments.upcoming.type }}
          </span>
          <span class="bg-[#c5f0f3] text-[#147d83] px-2 py-0.5 rounded-md text-[9px] font-bold">
            {{ appointments.upcoming.status }}
          </span>
        </div>
        <h5 class="text-[13px] font-extrabold text-slate-800 mb-3">
          {{ appointments.upcoming.doctor }}
        </h5>
        <div class="flex items-center gap-2 text-slate-400">
          <WnSvgIcon
            icon="ri:calendar-line"
            :size="12"
          />
          <span class="text-[10px] font-bold">{{ appointments.upcoming.date }}</span>
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="flex-1 flex flex-col min-h-0">
      <h4 class="text-[11px] font-bold text-slate-400 mb-4 shrink-0">History</h4>
      <div class="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
        <div
          v-for="app in appointments.history"
          :key="app.id"
          class="bg-white border-l-4 border-[#1b253b] rounded-2xl p-5 shadow-sm flex flex-col"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-extrabold text-slate-700">{{ app.type }}</span>
            <span class="bg-[#1b253b] text-white px-2 py-0.5 rounded-md text-[9px] font-bold">
              {{ app.status }}
            </span>
          </div>
          <h5 class="text-[13px] font-extrabold text-slate-800 mb-3">{{ app.doctor }}</h5>
          <div class="flex items-center gap-2 text-slate-400">
            <WnSvgIcon
              icon="ri:calendar-line"
              :size="12"
            />
            <span class="text-[10px] font-bold">{{ app.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PatientDetailData } from '@/mock/patient-detail';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'PatientDetailAppointments' });

defineProps<{
  appointments: PatientDetailData['appointments'];
}>();
</script>
