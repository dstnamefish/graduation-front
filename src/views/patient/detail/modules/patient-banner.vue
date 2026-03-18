<template>
  <div
    class="flex items-center justify-between w-full bg-card rounded-2xl py-4 px-5 shrink-0 shadow-sm"
  >
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-2xl overflow-hidden bg-accent-background shrink-0">
        <img
          v-if="data && data.avatar"
          :src="data.avatar"
          :alt="fullName"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex flex-col justify-center">
        <div class="flex items-center gap-3 mb-1.5">
          <h2 class="text-2xl font-bold text-title">{{ fullName }}</h2>
          <div
            class="px-3 py-1 rounded flex items-center justify-center text-xs font-bold"
            :class="statusStyle"
          >
            {{ statusText }}
          </div>
        </div>
        <p class="text-[13px] text-muted font-medium">
          Patient ID:
          <span class="font-bold text-body ml-1">{{ data ? data.patientNo : '-' }}</span>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <WnIconButton
        v-for="(btn, index) in actionButtons"
        :key="index"
        :icon="btn.icon"
        :size="20"
        class="bg-surface! text-muted! hover:text-body! border! border-border! shadow-sm! transition-colors"
      />
      <WnButton type="primary">Edit Data</WnButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PatientProfile } from '@/types/api/patient';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';

defineOptions({ name: 'PatientDetailBanner' });

const props = defineProps<{
  data: PatientProfile;
}>();

const actionButtons = [
  { icon: 'ri:message-3-line' },
  { icon: 'ri:phone-line' }
];

const fullName = computed(() => {
  if (!props.data) return 'Unknown Patient';
  return `${props.data.firstName || ''} ${props.data.lastName || ''}`.trim() || 'Unknown Patient';
});

const statusText = computed(() => {
  if (!props.data) return 'Unknown';
  const statusMap: Record<number, string> = {
    0: 'Inactive',
    1: 'Active',
    2: 'New Patient',
  };
  return statusMap[props.data.patientStatus] || 'Unknown';
});

const statusStyle = computed(() => {
  if (!props.data) return 'bg-disabled text-disabled-text';
  const styleMap: Record<number, string> = {
    0: 'bg-patient-inactive-bg text-patient-inactive-text border border-patient-inactive-border',
    1: 'bg-patient-active-bg text-patient-active-text border border-patient-active-border',
    2: 'bg-patient-new-bg text-patient-new-text border border-patient-new-border',
  };
  return styleMap[props.data.patientStatus] || 'bg-disabled text-disabled-text';
});
</script>
