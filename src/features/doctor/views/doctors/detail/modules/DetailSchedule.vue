<template>
  <div
    class="h-full flex flex-col bg-white rounded-3xl p-6 xl:p-8 shadow-sm border border-slate-100 overflow-hidden"
  >
    <div class="flex items-center justify-between mb-6 shrink-0">
      <h3 class="text-sm font-extrabold text-slate-800">Schedule</h3>
      <WnIconButton
        icon="ri:more-line"
        :size="18"
        class="text-slate-400"
      />
    </div>

    <!-- Mini Calendar Selector -->
    <div
      class="bg-slate-50 rounded-2xl p-2 flex items-center justify-between mb-6 shrink-0 relative shadow-inner-sm"
    >
      <WnIconButton
        icon="ri:arrow-left-s-line"
        :size="20"
        class="text-slate-400 bg-transparent! hover:bg-white!"
      />
      <div class="flex gap-1.5 flex-1 justify-center px-2">
        <!-- Mon -->
        <div
          class="flex flex-col items-center justify-center w-8 h-12 rounded-xl text-slate-400 font-bold cursor-pointer hover:bg-slate-200/50"
        >
          <span class="text-[9px] uppercase mb-1">Mon</span>
          <span class="text-xs">17</span>
        </div>
        <!-- Tue -->
        <div
          class="flex flex-col items-center justify-center w-8 h-12 rounded-xl text-slate-400 font-bold cursor-pointer hover:bg-slate-200/50"
        >
          <span class="text-[9px] uppercase mb-1">Tue</span>
          <span class="text-xs">18</span>
        </div>
        <!-- Wed -->
        <div
          class="flex flex-col items-center justify-center w-8 h-12 rounded-xl text-slate-400 font-bold cursor-pointer hover:bg-slate-200/50 relative"
        >
          <span class="text-[9px] uppercase mb-1">Wed</span>
          <span class="text-xs text-slate-800">19</span>
          <div class="w-1 h-1 rounded-full bg-[#147d83] absolute bottom-1"></div>
        </div>
        <!-- Thu (Active) -->
        <div
          class="flex flex-col items-center justify-center w-10 h-14 -mx-1 rounded-2xl bg-[#1b253b] text-white font-bold cursor-default shadow-md z-1"
        >
          <span class="text-[9px] uppercase mb-1 opacity-80">Thu</span>
          <span class="text-sm">20</span>
        </div>
        <!-- Fri -->
        <div
          class="flex flex-col items-center justify-center w-8 h-12 rounded-xl text-slate-300 font-bold cursor-pointer hover:bg-slate-200/50"
        >
          <span class="text-[9px] uppercase mb-1">Fri</span>
          <span class="text-xs">21</span>
        </div>
        <!-- Sat -->
        <div
          class="flex flex-col items-center justify-center w-8 h-12 rounded-xl text-slate-300 font-bold cursor-pointer hover:bg-slate-200/50"
        >
          <span class="text-[9px] uppercase mb-1">Sat</span>
          <span class="text-xs">22</span>
        </div>
      </div>
      <WnIconButton
        icon="ri:arrow-right-s-line"
        :size="20"
        class="text-slate-400 bg-transparent! hover:bg-white!"
      />
    </div>

    <!-- Active Day Summary -->
    <p class="text-[11px] font-bold text-slate-400 mb-4 shrink-0 px-2 tracking-wide">
      {{ schedule.length }} schedules today
    </p>

    <!-- Scrollable Schedule List -->
    <div class="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5 px-1 pb-4">
      <div
        v-for="item in schedule"
        :key="item.id"
        class="flex gap-4 group cursor-pointer"
      >
        <!-- Custom Sidebar Color Line -->
        <div
          class="w-1.5 h-full min-h-[44px] rounded-full shrink-0"
          :class="{
            'bg-[#a5f3e4]': item.color === 'mint',
            'bg-[#c5f0f3]': item.color === 'cyan',
            'bg-red-200': item.color === 'warning',
            'bg-slate-200': item.color === 'info',
          }"
        ></div>
        <div
          class="flex flex-col flex-1 pb-4 border-b border-slate-100 group-last:border-transparent"
        >
          <h4
            class="text-sm font-extrabold text-slate-700 leading-tight mb-1 group-hover:text-primary-600 transition-colors"
          >
            {{ item.patientName }}
          </h4>
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-slate-400">{{ item.type }}</span>
            <span class="w-1 h-1 rounded-full bg-slate-200"></span>
            <span class="text-[11px] font-medium text-slate-400">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ScheduleItem } from '@/mock/doctor-detail';
import WnIconButton from '@/shared/ui/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'DetailSchedule' });

defineProps<{
  schedule: ScheduleItem[];
}>();
</script>
