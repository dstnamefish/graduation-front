<template>
  <div
    class="h-full flex gap-6 overflow-hidden"
    v-loading="loading"
  >
    <template v-if="patientInfo">
      <!-- Left Main Area -->
      <div
        class="flex-1 flex flex-col gap-6 min-w-0 h-full overflow-y-auto no-scrollbar scroll-smooth"
      >
        <!-- Top Banner -->
        <DetailBanner
          :data="patientInfo"
          class="shrink-0"
        />

        <!-- Center Flex Row -->
        <div class="flex gap-6 shrink-0">
          <DetailContact
            :data="patientInfo.contact"
            class="w-[30%] min-w-[240px] shrink-0"
          />
          <DetailGeneral
            :data="patientInfo.general"
            :notes="patientInfo.notes"
            class="flex-1 min-w-0"
          />
        </div>

        <!-- Medical Full Width -->
        <DetailMedical
          :data="patientInfo.medical"
          class="shrink-0 pb-6"
        />
      </div>

      <!-- Right Sidebar Area -->
      <div
        class="w-1/4 min-w-[320px] max-w-[380px] shrink-0 h-full flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6"
      >
        <DetailMemberCard
          :name="patientInfo.name"
          :id="patientInfo.id"
          class="shrink-0"
        />
        <DetailReports
          :reports="patientInfo.reports"
          class="shrink-0 max-h-[260px]"
        />
        <DetailAppointments
          :appointments="patientInfo.appointments"
          class="flex-1"
        />
      </div>
    </template>

    <div
      v-else-if="!loading"
      class="w-full h-full flex items-center justify-center text-slate-400"
    >
      <div class="text-center">
        <WnSvgIcon
          icon="solar:ghost-bold-duotone"
          :size="64"
          class="opacity-30 mb-4 mx-auto"
        />
        <p class="text-lg font-medium mb-4">Patient record not found</p>
        <WnButton
          type="primary"
          @click="goBack"
        >
          Return to List
        </WnButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { getMockPatientDetail, type PatientDetailData } from '@/mock/patient-detail';

import DetailBanner from './modules/DetailBanner.vue';
import DetailContact from './modules/DetailContact.vue';
import DetailGeneral from './modules/DetailGeneral.vue';
import DetailMedical from './modules/DetailMedical.vue';
import DetailMemberCard from './modules/DetailMemberCard.vue';
import DetailReports from './modules/DetailReports.vue';
import DetailAppointments from './modules/DetailAppointments.vue';

defineOptions({ name: 'PatientDetail' });

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const patientInfo = ref<PatientDetailData | null>(null);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = route.params.id as string;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (id) {
      patientInfo.value = getMockPatientDetail(id);
    } else {
      patientInfo.value = null;
    }
  } catch (err) {
    console.error('Failed to load patient details:', err);
    patientInfo.value = null;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'Patients' });
};

onMounted(() => {
  fetchDetail();
});
</script>
