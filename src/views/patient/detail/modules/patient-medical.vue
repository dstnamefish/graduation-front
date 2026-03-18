<script setup lang="ts">
import { computed } from 'vue';
import type { PatientHealth } from '@/types/patient';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'PatientDetailMedical' });

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

const metricItems = computed(() => [
  { label: 'Body Height', value: props.data.height ? `${props.data.height} cm` : '-', icon: 'ri:ruler-line' },
  { label: 'Body Weight', value: props.data.weight ? `${props.data.weight} kg` : '-', icon: 'solar:body-shape-bold-duotone' },
  { label: 'Body Mass Index', value: bmi.value, icon: 'solar:dashboard-circle-bold-duotone' },
  { label: 'Heart Rate', value: props.data.heartRate ? `${props.data.heartRate} bpm` : '-', icon: 'solar:heart-pulse-bold-duotone' },
  { label: 'Blood Pressure', value: props.data.bloodPressure || '-', icon: 'ri:pulse-line' },
  { label: 'Blood Sugar', value: props.data.bloodGlucose ? `${props.data.bloodGlucose} mmol/L` : '-', icon: 'ri:syringe-line' },
  { label: 'Cholesterol', value: props.data.cholesterol ? `${props.data.cholesterol} mmol/L` : '-', icon: 'solar:drop-bold-duotone' },
  { label: 'Respiratory', value: props.data.respiratoryRate ? `${props.data.respiratoryRate} /min` : '-', icon: 'solar:wind-bold-duotone' },
  { label: 'Hemoglobin', value: props.data.hemoglobin ? `${props.data.hemoglobin} g/L` : '-', icon: 'solar:blood-bold-duotone' }
]);


</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-title">Medical Info</h3>
      <div class="flex items-center gap-4">
        <span class="text-[13px] font-medium text-muted">
          Last Updated on <span class="font-bold text-body ml-1.5">{{ data.lastUpdated || '-' }}</span>
        </span>
        <WnIconButton
          icon="ri:more-line"
          :size="20"
          class="text-muted hover:text-body border border-border shadow-sm rounded-lg transition-colors bg-white"
        />
      </div>
    </div>

    <div class=" rounded-2xl px-6 py-8 border border-border">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
        <div v-for="item in metricItems" :key="item.label" class="flex items-center gap-4">
          <div class="w-[52px] h-[52px] rounded-xl bg-[#A9EEE6] text-[#2F5A57] flex items-center justify-center shrink-0">
            <WnSvgIcon
              :icon="item.icon"
              :size="26"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-muted">{{ item.label }}</span>
            <span class="text-lg font-bold text-title">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
