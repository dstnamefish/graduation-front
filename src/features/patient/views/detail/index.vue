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
import { ElMessage } from 'element-plus';
import WnButton from '@/shared/ui/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/shared/ui/core/base/Wn-svg-icon/index.vue';
import * as PatientApi from '@/features/patient/api';
import type { Patient } from '@/features/patient/types';

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
const patientInfo = ref<any | null>(null);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = route.params.id as string;

    if (id) {
      // 由于没有直接的详情API，我们先获取患者列表，然后根据ID查找
      const response = await PatientApi.getPatientPage({ page: 1, size: 100 });
      const patient = response.records.find(p => p.id.toString() === id);
      
      if (patient) {
        // 构建详情数据结构
        patientInfo.value = {
          ...patient,
          contact: {
            phone: '138****8888',
            email: 'patient@example.com',
            address: '123 Main St, City'
          },
          general: {
            gender: patient.gender === 1 ? 'Male' : 'Female',
            birthday: '1990-01-01',
            bloodType: 'A',
            height: '170cm',
            weight: '65kg'
          },
          medical: {
            allergies: ['Penicillin'],
            medications: ['Aspirin'],
            conditions: ['Hypertension']
          },
          notes: 'Patient has a history of hypertension',
          reports: [
            {
              id: 1,
              title: 'Blood Test',
              date: '2023-12-01',
              doctor: patient.doctorAssigned
            }
          ],
          appointments: [
            {
              id: 1,
              date: '2023-12-15',
              time: '10:00 AM',
              doctor: patient.doctorAssigned,
              purpose: 'Follow-up'
            }
          ]
        };
      } else {
        patientInfo.value = null;
        ElMessage.error('Patient not found');
      }
    } else {
      patientInfo.value = null;
    }
  } catch (err) {
    console.error('Failed to load patient details:', err);
    ElMessage.error('Failed to load patient details');
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
