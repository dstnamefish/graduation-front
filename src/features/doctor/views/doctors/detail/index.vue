<template>
  <div
    class="h-full flex gap-6 overflow-hidden"
    v-loading="loading"
  >
    <template v-if="doctorInfo">
      <!-- Left Column (Profile & Experience) -->
      <div class="w-1/4 min-w-[300px] max-w-[340px] shrink-0 h-full">
        <DetailProfile :data="doctorInfo" />
      </div>

      <!-- Middle Column (Stats & Feedback) -->
      <div class="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <DetailStats
          :stats="{
            totalPatients: doctorInfo.totalPatients,
            totalAppointments: doctorInfo.totalAppointments,
          }"
          :data="doctorInfo.appointmentStats"
          class="flex-1 shrink-0"
        />
        <DetailFeedback
          :feedback="doctorInfo.feedback"
          class="h-[220px]"
        />
      </div>

      <!-- Right Column (Schedule) -->
      <div class="w-1/4 min-w-[300px] max-w-[340px] shrink-0 h-full">
        <DetailSchedule :schedule="doctorInfo.todaySchedule" />
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
        <p class="text-lg font-medium mb-4">Doctor record not found</p>
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
import { getMockDoctorDetail, type DoctorDetailData } from '@/mock/doctor-detail';

import DetailProfile from './modules/DetailProfile.vue';
import DetailStats from './modules/DetailStats.vue';
import DetailFeedback from './modules/DetailFeedback.vue';
import DetailSchedule from './modules/DetailSchedule.vue';

defineOptions({ name: 'DoctorDetail' });

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const doctorInfo = ref<DoctorDetailData | null>(null);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Attempt to load mock data based on ID
    if (id) {
      doctorInfo.value = getMockDoctorDetail(id);
    } else {
      doctorInfo.value = null;
    }
  } catch (err) {
    console.error('Failed to load doctor details:', err);
    doctorInfo.value = null;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'Doctors' });
};

onMounted(() => {
  fetchDetail();
});
</script>
