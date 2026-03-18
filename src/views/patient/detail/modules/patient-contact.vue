<template>
  <div class="flex flex-col bg-card rounded-2xl p-6 h-full">
    <div class="flex items-center justify-between mb-7 shrink-0">
      <h3 class="text-xl font-bold text-title">Contact Info</h3>
    </div>

    <div class="flex flex-col gap-5">
      <div v-for="item in contactItems" :key="item.label" class="flex flex-col gap-1" :class="item.class">
        <span class="text-xs text-muted">{{ item.label }}</span>
        
        <template v-if="item.isEmergency">
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-bold text-body">{{ item.value[0] }}</span>
            <span class="text-sm font-bold text-body">{{ item.value[1] }}</span>
          </div>
        </template>
        
        <span v-else class="text-sm font-bold text-body" :class="item.valueClass">
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PatientProfile } from '@/types/api/patient';

defineOptions({ name: 'PatientDetailContact' });

const props = defineProps<{
  data: PatientProfile;
}>();

const contactItems = computed(() => [
  { label: 'Phone Number', value: props.data.phone || '-' },
  { label: 'Email', value: props.data.email || '-' },
  { label: 'Address', value: props.data.address || '-' },
  { 
    label: 'Emergency Contact', 
    isEmergency: true, 
    value: [props.data.emergencyContactName || '-', props.data.emergencyContactPhone || '-'],
    class: 'mt-1'
  }
]);
</script>
