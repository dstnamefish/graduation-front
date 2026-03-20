<template>
  <ElDialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :show-close="false"
    width="460px"
    align-center
    destroy-on-close
    @closed="handleClosed"
  >
    <template #header>
      <span class="text-xl font-bold text-title tracking-tight block text-left">
        {{ $t('appointments.cancelDialog.title') }}
      </span>
    </template>

    <div class="space-y-6 py-2 text-left">
      <p class="text-sm leading-relaxed text-muted mb-4">
        {{ $t('appointments.cancelDialog.desc') }}
        <span class="text-body font-medium" v-if="appointment">
          {{ $t('appointments.cancelDialog.patientInfo', { 
            patient: appointment.patientName, 
            time: formatTime(appointment.appointmentTime), 
            department: appointment.treatmentName || appointment.doctorName 
          }) }}。
        </span>
      </p>

      <div class="flex flex-col gap-2 relative">
        <label class="text-sm font-semibold text-slate-700">
          {{ $t('appointments.cancelDialog.reasonLabel') }}
        </label>
        <ElInput
          v-model="cancelReason"
          type="textarea"
          :rows="3"
          :placeholder="$t('appointments.cancelDialog.reasonPlaceholder')"
          resize="none"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2 mt-2">
        <WnButton 
          @click="$emit('update:visible', false)"
          :disabled="loading"
          type="default"
        >
          {{ $t('appointments.cancelDialog.keep') }}
        </WnButton>
        <WnButton 
          type="danger" 
          :loading="loading"
          @click="$emit('confirm', cancelReason)"
        >
          {{ $t('appointments.cancelDialog.confirm') }}
        </WnButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatTime } from '@/utils/format/date';
import type { Appointment } from '@/types/api/appointment';

defineProps<{
  visible: boolean;
  appointment: Appointment | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', reason: string): void;
}>();

const cancelReason = ref('');

const handleClosed = () => {
  cancelReason.value = '';
};
</script>
