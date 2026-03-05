<template>
  <div class="flex flex-col gap-6">
    <!-- Totals Cards -->
    <div class="grid grid-cols-2 gap-6">
      <div
        class="bg-white rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border border-slate-100 flex-1 relative overflow-hidden"
      >
        <WnIconButton
          icon="ri:more-2-fill"
          :size="16"
          class="absolute top-4 right-4 text-slate-300"
        />
        <div
          class="w-12 h-12 rounded-2xl bg-[#c5f0f3] text-[#147d83] flex items-center justify-center mb-4"
        >
          <WnSvgIcon
            icon="solar:user-bold-duotone"
            :size="24"
          />
        </div>
        <p class="text-xs font-bold text-slate-400 mb-1">Total Patients</p>
        <h2 class="text-4xl font-extrabold text-slate-800">{{ stats.totalPatients }}</h2>
      </div>
      <div
        class="bg-white rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border border-slate-100 flex-1 relative overflow-hidden"
      >
        <WnIconButton
          icon="ri:more-2-fill"
          :size="16"
          class="absolute top-4 right-4 text-slate-300"
        />
        <div
          class="w-12 h-12 rounded-2xl bg-[#a5f3e4] text-[#0e5b60] flex items-center justify-center mb-4"
        >
          <WnSvgIcon
            icon="solar:calendar-bold-duotone"
            :size="24"
          />
        </div>
        <p class="text-xs font-bold text-slate-400 mb-1">Total Appointments</p>
        <h2 class="text-4xl font-extrabold text-slate-800">{{ stats.totalAppointments }}</h2>
      </div>
    </div>

    <!-- Appointment Stats Graph -->
    <div
      class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[360px]"
    >
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-lg font-extrabold text-slate-800">Appointment Stats</h3>
        <select
          class="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl outline-none appearance-none cursor-pointer pr-10 relative shadow-md"
        >
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      <!-- Custom CSS Bar Chart -->
      <div class="flex-1 flex flex-col relative w-full h-full pt-4">
        <!-- Y-Axis Lines -->
        <div class="absolute inset-0 flex flex-col justify-between pt-4 pb-8 pointer-events-none">
          <div class="border-b border-dashed border-slate-200 w-full flex items-center">
            <span class="absolute -left-6 text-[10px] font-bold text-slate-300">12</span>
          </div>
          <div class="border-b border-dashed border-slate-200 w-full flex items-center">
            <span class="absolute -left-6 text-[10px] font-bold text-slate-300">9</span>
          </div>
          <div class="border-b border-dashed border-slate-200 w-full flex items-center">
            <span class="absolute -left-6 text-[10px] font-bold text-slate-300">6</span>
          </div>
          <div class="border-b border-dashed border-slate-200 w-full flex items-center">
            <span class="absolute -left-6 text-[10px] font-bold text-slate-300">3</span>
          </div>
          <div class="border-b border-slate-200 w-full flex items-center">
            <span class="absolute -left-6 text-[10px] font-bold text-slate-300">0</span>
          </div>
        </div>

        <!-- Bars Container -->
        <div class="relative w-full h-full flex items-end justify-between px-6 pb-8 pt-4">
          <div
            v-for="(day, index) in data"
            :key="index"
            class="w-12 h-full flex flex-col justify-end items-center relative group"
          >
            <!-- Stacked Bar (Based on max value 12) -->
            <!-- Follow up part -->
            <div
              class="w-full bg-[#a5f3e4] rounded-t-xl transition-all duration-300 hover:opacity-80 cursor-pointer mb-1"
              :style="{ height: `${(day.followUpPatient / 12) * 100}%` }"
            ></div>
            <!-- New part -->
            <div
              class="w-full bg-[#1b253b] rounded-b-xl transition-all duration-300 hover:opacity-80 cursor-pointer"
              :style="{ height: `${(day.newPatient / 12) * 100}%` }"
            ></div>

            <!-- X-Axis Label -->
            <span class="absolute -bottom-6 text-[10px] font-bold text-slate-400">
              {{ day.day }}
            </span>

            <!-- Tooltip (Simulated hover) -->
            <div
              class="opacity-0 group-hover:opacity-100 absolute -top-16 left-1/2 -translate-x-1/2 bg-white border border-slate-100 shadow-xl rounded-2xl p-3 z-10 w-44 pointer-events-none transition-opacity duration-300 flex flex-col gap-2"
            >
              <span class="text-[10px] font-bold text-slate-400 mb-1 border-b pb-2 text-center">
                Wed, 19 Jul 28
              </span>
              <div class="flex justify-between items-center text-[11px] font-bold">
                <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#1b253b]"></div>
                  <span class="text-slate-500">New Patient</span>
                </div>
                <span class="text-slate-800">{{ day.newPatient }}</span>
              </div>
              <div class="flex justify-between items-center text-[11px] font-bold">
                <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#a5f3e4]"></div>
                  <span class="text-slate-500">Follow-Up</span>
                </div>
                <span class="text-slate-800">{{ day.followUpPatient }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Status Summary -->
      <div class="grid grid-cols-3 gap-6 bg-slate-50 rounded-2xl p-4 mt-6">
        <div class="flex flex-col border-l-4 border-[#a5f3e4] pl-3">
          <span class="text-lg font-extrabold text-slate-800">50</span>
          <span class="text-[10px] font-bold text-slate-400">Total Appointments</span>
        </div>
        <div class="flex flex-col border-l-4 border-[#1b253b] pl-3">
          <span class="text-lg font-extrabold text-slate-800">22</span>
          <span class="text-[10px] font-bold text-slate-400">New Patients</span>
        </div>
        <div class="flex flex-col border-l-4 border-[#c5f0f3] pl-3">
          <span class="text-lg font-extrabold text-slate-800">28</span>
          <span class="text-[10px] font-bold text-slate-400">Follow-Up Patients</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type DayStat } from '@/mock/doctor-detail';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'DetailStats' });

defineProps<{
  stats: { totalPatients: number; totalAppointments: number };
  data: DayStat[];
}>();
</script>
