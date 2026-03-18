<template>
  <div class="flex flex-col flex-1 shrink-0 overflow-hidden mt-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-extrabold text-slate-800">Feedback</h3>
      <WnIconButton
        icon="ri:more-line"
        :size="18"
        class="text-slate-400"
      />
    </div>

    <!-- Feedback List (Horizontal Scroll) -->
    <div class="flex-1 overflow-x-auto no-scrollbar flex gap-4 pb-4 px-1 w-full">
      <div
        v-for="item in feedback"
        :key="item.id"
        class="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col min-w-[240px] max-w-[260px] h-full transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-[#c5f0f3] border-2 border-white shadow-sm flex-cc">
            <WnSvgIcon icon="solar:user-bold" :size="20" class="text-primary-600" />
          </div>
          <div class="flex flex-col">
            <h4 class="text-xs font-bold text-slate-700 leading-tight">{{ item.patientName }}</h4>
            <span class="text-[10px] font-semibold text-slate-400">{{ item.reviewDate }}</span>
          </div>
        </div>
        <p class="text-xs text-slate-500 font-medium leading-[1.6]">
          {{ item.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Feedback } from '@/types/doctor';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';

defineOptions({ name: 'DetailFeedback' });

defineProps<{
  feedback: Feedback[];
}>();
</script>
