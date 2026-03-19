<template>
  <div
    class="h-full flex gap-6 overflow-hidden"
    v-loading="loading"
  >
    <template v-if="doctorInfo">
      <div class=" shrink-0 h-full">
        <DetailProfile :data="{ ...doctorInfo.profile, experience: doctorInfo.workExperiences }" />
      </div>

      <div class="flex-1 min-w-0 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar">
        <div class="flex gap-6 shrink-0 h-auto">
          <DetailStats
            :stats="{
              totalPatients: doctorInfo.totalPatients,
              totalAppointments: doctorInfo.totalAppointments,
            }"
            :data="[]" 
            class="flex-1 min-w-0 h-full"
          />
          <div class=" shrink-0 h-full">
            <DetailSchedule :schedule="doctorInfo.todaySchedules" />
          </div>
        </div>
        <DetailFeedback
          :feedback="doctorInfo.feedbacks"
          class="w-full shrink-0"
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
        <p class="text-lg font-medium mb-4">{{ t('doctors.detail.notFound') }}</p>
        <WnButton
          type="primary"
          @click="goBack"
        >
          {{ t('doctors.detail.returnToList') }}
        </WnButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { getDoctorDashboard } from '@/api/doctor';
import type { DoctorDashboard } from '@/types/doctor';

import DetailProfile from './modules/DetailProfile.vue';
import DetailStats from './modules/DetailStats.vue';
import DetailFeedback from './modules/DetailFeedback.vue';
import DetailSchedule from './modules/DetailSchedule.vue';

defineOptions({ name: 'DoctorDetails' });

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const loading = ref(true);
const doctorInfo = ref<DoctorDashboard | null>(null);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id);
    if (!id) {
      doctorInfo.value = null;
      return;
    }

    const res = await getDoctorDashboard(id);
    doctorInfo.value = res;
  } catch (err) {
    console.error('Failed to load doctor details:', err);
    ElMessage.error(t('doctors.detail.loadFailed'));
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
