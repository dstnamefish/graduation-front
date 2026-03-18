<script setup lang="ts">
import { computed } from 'vue';
import type { PatientHealth } from '@/types/patient';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'PatientDetailGeneral' });

const props = defineProps<{
  data: PatientHealth;
}>();

const bmi = computed(() => {
  if (props.data.height && props.data.weight) {
    const heightInMeters = props.data.height / 100;
    const bmiValue = props.data.weight / (heightInMeters * heightInMeters);
    return bmiValue.toFixed(1);
  }
  return '-';
});

const leftItems = computed(() => {
  const d = props.data as any;
  return [
    { label: 'Gender', value: d.gender === 1 ? 'Male' : (d.gender === 2 ? 'Female' : (d.gender || '-')) },
    { label: 'Age', value: d.age ? `${d.age} years old` : '-' },
    { label: 'Date of Birth', value: d.birthday || '-' }
  ];
});

const rightItems = computed(() => {
  const d = props.data as any;
  return [
    { label: 'Blood Type', value: d.bloodType || '-' },
    { label: 'Height', value: d.height ? `${d.height} cm` : '-' },
    { label: 'Weight', value: d.weight ? `${d.weight} kg` : '-' },
  ];
});
</script>

<template>
  <div class="flex flex-col bg-card rounded-2xl p-6 w-full">
    <div class="flex items-center justify-between mb-7">
      <h3 class="text-xl font-bold text-title">General Info</h3>
    </div>

    <div class="flex gap-8 mb-2">
      <div class="flex flex-col gap-4 flex-1">
        <div v-for="item in leftItems" :key="item.label" class="flex items-center">
          <span class="text-muted w-28 shrink-0">{{ item.label }}</span>
          <span class="font-bold text-body flex-1">{{ item.value }}</span>
        </div>
      </div>
      
      <div class="w-[2px] bg-border shrink-0"></div>

      <div class="flex flex-col gap-4 flex-1">
        <div v-for="item in rightItems" :key="item.label" class="flex items-center">
          <span class="text-sm text-muted w-28 shrink-0">{{ item.label }}</span>
          <span class="font-bold text-body flex-1">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
