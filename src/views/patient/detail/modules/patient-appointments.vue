<template>
  <div class="bg-card flex flex-col rounded-2xl p-6 border">
    <div class="flex items-center justify-between mb-5 shrink-0">
      <h3 class="text-base font-bold text-title">Appointment</h3>
    </div>

    <div class="flex flex-col mb-7 shrink-0">
      <h4 class="text-sm font-bold text-muted mb-3">Upcoming</h4>
      <div
        v-if="appointments.upcoming"
        class="bg-surface border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-primary-700">
            {{ appointments.upcoming.type }}
          </span>
          <span class="bg-appointment-confirmed-bg text-appointment-confirmed-text px-2.5 py-1 rounded text-[11px] font-bold">
            {{ appointments.upcoming.status }}
          </span>
        </div>
        <h5 class="text-[15px] font-bold text-title mb-2.5">
          {{ appointments.upcoming.doctor }}
        </h5>
        <div class="flex items-center gap-1.5 text-muted">
          <WnSvgIcon
            icon="ri:calendar-line"
            :size="14"
          />
          <span class="text-xs font-medium">{{ appointments.upcoming.date }}</span>
        </div>
      </div>
      <div v-else class="text-sm text-muted bg-surface rounded-xl p-4 border border-border border-dashed text-center">
        No upcoming appointments
      </div>
    </div>

    <div class="flex-1 flex flex-col min-h-0">
      <h4 class="text-sm font-bold text-muted mb-3 shrink-0">History</h4>
      <div class="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
        <div
          v-for="app in appointments.history"
          :key="app.id"
          class="bg-surface border border-border rounded-xl p-4 hover:shadow-sm transition-shadow flex flex-col shrink-0"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-primary-700">{{ app.type }}</span>
            <span class="bg-slate-700 text-white px-2.5 py-1 rounded text-[11px] font-bold">
              {{ app.status }}
            </span>
          </div>
          <h5 class="text-[15px] font-bold text-title mb-2.5">{{ app.doctor }}</h5>
          <div class="flex items-center gap-1.5 text-muted">
            <WnSvgIcon
              icon="ri:calendar-line"
              :size="14"
            />
            <span class="text-xs font-medium">{{ app.date }}</span>
          </div>
        </div>
        <div v-if="!appointments.history || appointments.history.length === 0" class="text-sm text-muted bg-surface rounded-xl p-4 border border-border border-dashed text-center">
          No history available
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';

defineOptions({ name: 'PatientDetailAppointments' });

defineProps<{
  appointments: {
    upcoming?: any;
    history?: any[];
  }
}>();
</script>
