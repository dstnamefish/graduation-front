<template>
  <div class="flex flex-col h-full bg-white rounded-3xl overflow-hidden">
    <!-- Main Content Area -->
    <main
      class="flex-1 overflow-y-auto p-6"
      v-loading="loading"
    >
      <div
        v-if="department"
        class="w-full flex flex-col gap-10"
      >
        <DetailBanner :data="department" />
        <DetailAbout :description="department.description" />
        <DetailTeam :members="department.teamMembers" />
        <div class="pb-10"></div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="!loading && !department"
        class="h-full flex flex-col items-center justify-center text-slate-400 gap-4"
      >
        <WnSvgIcon
          icon="solar:ghost-bold-duotone"
          :size="64"
          class="opacity-30"
        />
        <p class="text-lg font-medium">Department not found</p>
        <WnButton
          @click="goBack"
          type="primary"
        >
          Return to List
        </WnButton>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import { fetchDetail } from '@/api/department';
import type { DepartmentDetailResponse } from '@/types/api/department';

import DetailBanner from './modules/DetailBanner.vue';
import DetailAbout from './modules/DetailAbout.vue';
import DetailTeam from './modules/DetailTeam.vue';

defineOptions({ name: 'DepartmentDetails' });

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const department = ref<DepartmentDetailResponse | null>(null);

const goBack = () => {
  router.push({ name: 'Departments' });
};

const fetchDetailData = async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id);
    const data = await fetchDetail(id);
    department.value = data;
  } catch (err) {
    console.error('Failed to load department details:', err);
    department.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDetailData();
});
</script>
