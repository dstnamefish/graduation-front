<template>
  <div
    class="h-full flex flex-col bg-card rounded-3xl p-6 overflow-y-auto no-scrollbar"
  >
    <div class="flex flex-col items-center my-4 shrink-0">
      <div
        class="w-32 h-32 rounded-3xl overflow-hidden bg-accent mb-4 "
      >
        <img
          :src="data.avatar"
          class="w-full h-full object-cover"
        />
      </div>
      <h2 class="text-xl font-bold text-title">{{ data.name }}</h2>
      <p class="text-sm text-muted mb-4">{{ data.doctorNo }}</p>

      <div
        class="px-5 py-1.5 rounded-lg text-xs flex items-center gap-2"
        :class="
          data.availabilityStatus === 'Available'
            ? 'bg-doctor-available-bg text-doctor-available-text '
            : 'bg-doctor-unavailable-bg text-doctor-unavailable-text'
        "
      >
        <div
          class="w-2 h-2 rounded-full"
          :class="data.availabilityStatus === 'Available' ? 'bg-success' : 'bg-destructive'"
        ></div>
        {{ data.availabilityStatus }}
      </div>
    </div>

    <div class="flex flex-col gap-6 shrink-0 mb-8 border-t border-border pt-6">
      <section>
        <h3 class="text-xs text-muted mb-1">Specialist</h3>
        <p class="text-sm text-body">{{ data.specialist }}</p>
      </section>

      <section>
        <h3 class="text-xs text-muted mb-1">About</h3>
        <p class="text-sm text-body">{{ data.bio }}</p>
      </section>
    </div>

    <div class="flex flex-col gap-4 shrink-0 mb-8 border-t border-border pt-6">
      <div
        v-for="item in contactItems"
        :key="item.icon"
        class="flex items-center gap-3"
      >
        <div
          class="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-primary-500"
        >
          <WnSvgIcon
            :icon="item.icon"
            :size="18"
          />
        </div>
        <p class="text-sm text-body" :class="item.textClass">{{ item.value }}</p>
      </div>
    </div>

    <div class="flex flex-col shrink-0 border-t border-border pt-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-bold text-title">Work Experience</h3>
        <WnIconButton
          icon="ri:more-line"
          :size="20"
          class="text-muted"
        />
      </div>
      <div class="flex flex-col gap-6">
        <div
          v-for="(exp, index) in data.experience"
          :key="index"
          class="flex gap-4"
        >
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-border"
            :class="
              index % 2 === 0
                ? 'bg-destructive-subtle text-destructive'
                : 'bg-field-muted text-body'
            "
          >
            <WnSvgIcon
              :icon="index % 2 === 0 ? 'ri:hospital-fill' : 'ri:pulse-fill'"
              :size="24"
            />
          </div>
          <div class="flex flex-col justify-center">
            <h4 class="text-sm font-bold text-body mb-1">{{ exp.position }}</h4>
            <p class="text-xs  text-muted mb-1">{{ exp.hospitalName }}</p>
            <p class="text-xs  text-placeholder">{{ exp.employmentType }} | {{ exp.dateRange }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DoctorProfile, WorkExperience } from '@/types/doctor';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'DetailProfile' });

const props = defineProps<{
  data: DoctorProfile & { experience: WorkExperience[] };
}>();

interface ContactItem {
  icon: string;
  value: string;
  textClass?: string;
}

const contactItems = computed<ContactItem[]>(() => [
  { icon: 'ri:phone-line', value: props.data.phone },
  { icon: 'ri:mail-line', value: props.data.email },
  { icon: 'ri:hospital-line', value: props.data.address },
]);
</script>
