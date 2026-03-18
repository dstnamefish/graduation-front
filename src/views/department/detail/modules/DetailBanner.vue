<template>
  <div class="flex flex-col">
    <!-- Image block -->
    <div class="relative w-full aspect-21/9 rounded-3xl overflow-hidden bg-slate-50 mb-8 shadow-sm">
      <img
        :src="data.avatar"
        :alt="data.name"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Title and Team summary block -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex items-center gap-2 text-slate-800">
        <h2 class="text-4xl font-extrabold">{{ data.name }}</h2>
        <div
          class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <WnSvgIcon
            icon="ri:arrow-down-s-line"
            :size="16"
            class="text-slate-400"
          />
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Team:</span>
        <ul
          class="flex -space-x-2"
          :aria-label="`${data.name} team members`"
        >
          <li
            v-for="(member, idx) in data.teamMembers.slice(0, 5)"
            :key="idx"
            class="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm z-0 hover:z-10 transition-all cursor-pointer bg-slate-100"
          >
            <img
              :src="member.avatar"
              :alt="member.name"
              class="w-full h-full object-cover"
            />
          </li>
        </ul>
        <span
          v-if="data.totalDoctors > 5"
          class="text-xs font-bold text-slate-400 ml-1"
        >
          + {{ data.totalDoctors - 5 }} others
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import type { DepartmentDetailResponse } from '@/types/api/department';

defineOptions({ name: 'DetailBanner' });

defineProps<{
  data: DepartmentDetailResponse;
}>();
</script>
