<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { fetchDashboard } from '@/api/patient';
import type { PatientDashboardResponse, PatientProfile } from '@/types/api/patient';

import PatientBanner from './modules/patient-banner.vue';
import PatientContact from './modules/patient-contact.vue';
import PatientGeneral from './modules/patient-general.vue';
import PatientNotes from './modules/patient-notes.vue';
import PatientMedical from './modules/patient-medical.vue';
import PatientMedicalLists from './modules/patient-medical-lists.vue';
import PatientMemberCard from './modules/patient-member-card.vue';
import PatientReports from './modules/patient-reports.vue';
import PatientAppointments from './modules/patient-appointments.vue';

defineOptions({ name: 'PatientDetails' });

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const dashboardData = ref<PatientDashboardResponse | null>(null);

const getFullName = (profile: PatientProfile): string => {
  return `${profile.firstName} ${profile.lastName}`;
};

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = route.params.id as string;

    if (id) {
      const response = await fetchDashboard(Number(id));
      dashboardData.value = {
        profile: response.profile ?? null,
        healthData: response.healthData ?? null,
        notes: response.notes ?? [],
        reports: response.reports ?? [],
        upcomingAppointments: response.upcomingAppointments ?? [],
        historyAppointments: response.historyAppointments ?? [],
      };

      if (!dashboardData.value) {
        ElMessage.error('Patient not found');
      }
    } else {
      dashboardData.value = null;
      ElMessage.error('Invalid patient ID');
    }
  } catch (err) {
    console.error('Failed to load patient details:', err);
    ElMessage.error('Failed to load patient details');
    dashboardData.value = null;
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

<template>
  <div
    class="dashboard-container flex flex-col w-full h-screen overflow-hidden"
    v-loading="loading"
  >
    <div class="dashboard-scroll-container flex-1 min-h-0 overflow-y-auto px-6 pb-6">
      <template v-if="dashboardData">
        <div class="dashboard-grid flex flex-col lg:flex-row gap-6 w-full">
          <main class="dashboard-main flex-1 min-w-0 flex flex-col gap-6">
            <PatientBanner
              v-if="dashboardData.profile"
              :data="dashboardData.profile"
              class="dashboard-banner w-full"
            />

            <div class="dashboard-middle-row flex flex-col lg:flex-row gap-6 w-full">
              <PatientContact
                v-if="dashboardData.profile"
                :data="dashboardData.profile"
                class="dashboard-contact w-full lg:w-1/3 xl:w-1/4"
              />

              <div class="dashboard-info-group flex-1 min-w-0 flex flex-col gap-6">
                <PatientGeneral
                  v-if="dashboardData.healthData"
                  :data="dashboardData.healthData"
                  class="dashboard-general w-full"
                />

                <PatientNotes
                  :notes="dashboardData.notes"
                  class="dashboard-notes w-full"
                />
              </div>
            </div>

            <PatientMedical
              v-if="dashboardData.healthData"
              :data="dashboardData.healthData"
              class="dashboard-medical w-full"
            />

            <PatientMedicalLists
              v-if="dashboardData.healthData"
              :data="dashboardData.healthData"
              class="dashboard-medical-lists w-full"
            />
          </main>

          <aside class="dashboard-sidebar w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
            <PatientMemberCard
              v-if="dashboardData.profile"
              :name="getFullName(dashboardData.profile)"
              :id="dashboardData.profile.patientNo"
              class="dashboard-member-card w-full"
            />

            <PatientReports
              :reports="dashboardData.reports"
              class="dashboard-reports w-full"
            />

            <PatientAppointments
              :appointments="{
                upcoming: dashboardData.upcomingAppointments?.[0] || null,
                history: dashboardData.historyAppointments || []
              }"
              class="dashboard-appointments w-full"
            />
          </aside>
        </div>
      </template>

      <div
        v-else-if="!loading"
        class="dashboard-empty-state w-full min-h-[calc(100vh-120px)] flex items-center justify-center text-muted"
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
            class="dashboard-back-button"
          >
            Return to List
          </WnButton>
        </div>
      </div>
    </div>
  </div>
</template>
