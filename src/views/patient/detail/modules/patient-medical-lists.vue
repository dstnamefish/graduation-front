<script setup lang="ts">
import { computed } from 'vue';
import type { PatientHealth } from '@/types/api/patient';

defineOptions({ name: 'PatientDetailMedicalLists' });

const props = defineProps<{
  data: PatientHealth;
}>();

const parseList = (str?: string) => {
  if (!str) return [];
  return str.split(/[,;\n]+/).map(a => a.trim()).filter(Boolean);
};

const allergiesList = computed(() => parseList(props.data.allergies));
const conditionsList = computed(() => parseList(props.data.medicalHistory));
const medicationsList = computed(() => parseList(props.data.medications));
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 w-full h-full">
    <!-- Allergies -->
    <div class="bg-card rounded-2xl p-6 border border-border flex flex-col flex-1 min-h-[160px] min-w-0">
      <h3 class="text-sm font-bold text-muted mb-4 shrink-0">Allergies</h3>
      <ul v-if="allergiesList.length > 0" class="flex flex-col gap-2.5 overflow-y-auto no-scrollbar flex-1 pb-1">
        <li v-for="(item, idx) in allergiesList" :key="idx" class="flex items-start gap-2.5 text-[15px] font-bold text-body">
          <span class="mt-2 shrink-0 block w-1.5 h-1.5 rounded-full bg-muted"></span>
          {{ item }}
        </li>
      </ul>
      <span v-else class="text-[13px] text-muted">No known allergies</span>
    </div>

    <!-- Conditions / Medical History -->
    <div class="bg-card rounded-2xl p-6 border border-border flex flex-col flex-1 min-h-[160px] min-w-0">
      <h3 class="text-sm font-bold text-muted mb-4 shrink-0">Conditions</h3>
      <ul v-if="conditionsList.length > 0" class="flex flex-col gap-2.5 overflow-y-auto no-scrollbar flex-1 pb-1">
        <li v-for="(item, idx) in conditionsList" :key="idx" class="flex items-start gap-2.5 text-[15px] font-bold text-body">
          <span class="mt-2 shrink-0 block w-1.5 h-1.5 rounded-full bg-muted"></span>
          {{ item }}
        </li>
      </ul>
      <span v-else class="text-[13px] text-muted">No conditions recorded</span>
    </div>

    <!-- Medications -->
    <div class="bg-card rounded-2xl p-6 border border-border flex flex-col flex-1 min-h-[160px] min-w-0">
      <h3 class="text-sm font-bold text-muted mb-4 shrink-0">Medications</h3>
      <ul v-if="medicationsList.length > 0" class="flex flex-col gap-2.5 overflow-y-auto no-scrollbar flex-1 pb-1">
        <li v-for="(item, idx) in medicationsList" :key="idx" class="flex items-start gap-2.5 text-[15px] font-bold text-body">
          <span class="mt-2 shrink-0 block w-1.5 h-1.5 rounded-full bg-muted"></span>
          {{ item }}
        </li>
      </ul>
      <span v-else class="text-[13px] text-muted">No current medications</span>
    </div>
  </div>
</template>
