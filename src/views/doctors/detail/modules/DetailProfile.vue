<template>
  <div
    class="h-full flex flex-col bg-slate-50 rounded-3xl p-6 xl:p-8 overflow-y-auto no-scrollbar shadow-sm border border-slate-100/50"
  >
    <!-- Header: Avatar & Basic Info -->
    <div class="flex flex-col items-center mb-8 shrink-0">
      <div
        class="w-28 h-28 rounded-3xl overflow-hidden bg-[#a5f3e4] mb-4 shadow-sm border-4 border-white"
      >
        <img
          :src="data.avatar"
          :alt="data.name"
          class="w-full h-full object-cover"
        />
      </div>
      <h2 class="text-xl font-extrabold text-slate-800 mb-1">{{ data.name }}</h2>
      <p class="text-xs font-semibold text-slate-400 mb-4 tracking-wide">{{ data.code }}</p>

      <div
        class="px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border"
        :class="
          data.status === 'Available'
            ? 'bg-[#c5f0f3] text-[#147d83] border-[#a1e5e9]'
            : 'bg-slate-200 text-slate-500 border-slate-300'
        "
      >
        <div
          class="w-2 h-2 rounded-full"
          :class="data.status === 'Available' ? 'bg-primary' : 'bg-slate-400'"
        ></div>
        {{ data.status }}
      </div>
    </div>

    <!-- Details Section -->
    <div class="flex flex-col gap-6 shrink-0 mb-8 border-t border-slate-200 pt-6">
      <div>
        <h3 class="text-xs font-bold text-slate-400 mb-2">Specialist</h3>
        <p class="text-[15px] font-bold text-slate-700">{{ data.specialty }}</p>
      </div>

      <div>
        <h3 class="text-xs font-bold text-slate-400 mb-2">About</h3>
        <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ data.about }}</p>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="flex flex-col gap-4 shrink-0 mb-8 border-t border-slate-200 pt-6">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary-500"
        >
          <WnSvgIcon
            icon="ri:phone-line"
            :size="16"
          />
        </div>
        <p class="text-sm font-semibold text-slate-600">{{ data.phone }}</p>
      </div>
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary-500"
        >
          <WnSvgIcon
            icon="ri:mail-line"
            :size="16"
          />
        </div>
        <p class="text-[13px] font-semibold text-slate-600 truncate">{{ data.email }}</p>
      </div>
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary-500"
        >
          <WnSvgIcon
            icon="ri:hospital-line"
            :size="16"
          />
        </div>
        <p class="text-sm font-semibold text-slate-600 leading-tight">{{ data.location }}</p>
      </div>
    </div>

    <!-- Experience -->
    <div class="flex flex-col shrink-0 border-t border-slate-200 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-extrabold text-slate-800">Work Experience</h3>
        <WnIconButton
          icon="ri:more-line"
          :size="18"
          class="text-slate-400"
        />
      </div>
      <div class="flex flex-col gap-5">
        <div
          v-for="exp in data.experience"
          :key="exp.id"
          class="flex gap-4"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm"
            :class="
              exp.id % 2 === 0
                ? 'bg-red-50 border-red-100 text-red-500'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            "
          >
            <WnSvgIcon
              :icon="exp.id % 2 === 0 ? 'ri:hospital-fill' : 'ri:pulse-fill'"
              :size="20"
            />
          </div>
          <div class="flex flex-col">
            <h4 class="text-sm font-bold text-slate-700 leading-tight mb-1">{{ exp.role }}</h4>
            <p class="text-xs font-semibold text-slate-400 mb-1.5">{{ exp.hospital }}</p>
            <p class="text-[10px] font-bold text-slate-300">{{ exp.type }} • {{ exp.period }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type DoctorDetailData } from '@/mock/doctor-detail';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'DetailProfile' });

defineProps<{
  data: DoctorDetailData;
}>();
</script>
