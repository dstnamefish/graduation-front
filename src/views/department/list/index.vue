<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Department Grid -->
    <div
      v-loading="loading"
      class="flex-1 overflow-y-auto "
    >
      <div
        v-if="allData && allData.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <DepartmentCard
          v-for="dept in allData"
          :key="dept.id"
          :data="dept"
          @view="handleViewDetail"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading"
        class="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-20"
      >
        <WnSvgIcon
          icon="solar:clipboard-remove-linear"
          :size="48"
          class="opacity-20"
        />
        <p class="text-sm font-medium">No departments found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchList } from '@/api/department';
import type { Department } from '@/types/api/department';
import DepartmentCard from './modules/DepartmentCard.vue';

defineOptions({ name: 'Departments' });

const router = useRouter();
const loading = ref(false);
const allData = ref<Department[]>([]);

/**
 * Fetch Data using API
 */
const fetchData = async () => {
  loading.value = true;
  try {
    const list = await fetchList({});
    allData.value = list;
  } catch (error) {
    ElMessage.error('Failed to load departments');
    allData.value = [];
  } finally {
    loading.value = false;
  }
};

/**
 * Handlers
 */
const handleViewDetail = (dept: any) => {
  router.push({ name: 'DepartmentDetails', params: { id: dept.id } });
};

onMounted(() => {
  fetchData();
});
</script>