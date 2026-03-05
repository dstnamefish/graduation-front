<template>
  <div class="flex flex-col gap-6">
    <h3 class="text-2xl font-extrabold text-slate-400">Our Treatments</h3>

    <div class="flex flex-col gap-4">
      <div
        v-for="(item, index) in props.treatments"
        :key="index"
        class="flex gap-4 items-start"
      >
        <div class="mt-1.5 shrink-0 flex items-center justify-center">
          <div
            class="w-3.5 h-3.5 rounded-full bg-primary-500 border-2 border-white shadow-sm ring-1 ring-primary-200"
          ></div>
        </div>
        <div class="flex flex-col gap-1">
          <h4 class="text-[15px] font-extrabold text-slate-700">{{ item.title }}</h4>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreatmentItem } from '@/mock/departments';

defineOptions({ name: 'DetailTreatments' });

const props = defineProps<{
  treatments: TreatmentItem[];
}>();
</script>
