<template>
  <div class="departments-page">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-secondary">Departments</h1>
      <div class="flex items-center gap-3">
        <ElInput
          v-model="searchQuery"
          placeholder="Search departments..."
          prefix-icon="Search"
          class="w-64"
          clearable
        />
        <ElButton
          type="primary"
          @click="handleAddDepartment"
        >
          <WnSvgIcon
            icon="solar:add-circle-bold"
            :size="16"
            class="mr-1"
          />
          Add Department
        </ElButton>
      </div>
    </div>

    <!-- Department Grid -->
    <ElScrollbar class="flex-1">
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
        >
          <div class="h-40 bg-gray-200" />
          <div class="p-5">
            <div class="h-5 bg-gray-200 rounded w-1/2 mb-3" />
            <div class="h-3 bg-gray-200 rounded w-full mb-2" />
            <div class="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6"
      >
        <div
          v-for="dept in filteredDepartments"
          :key="dept.id"
          class="bg-white rounded-2xl overflow-hidden shadow-sm border border-default-border hover:shadow-lg transition-all duration-300 group"
        >
          <!-- Image -->
          <div class="h-40 overflow-hidden relative">
            <img
              :src="dept.image"
              :alt="dept.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>

          <!-- Content -->
          <div class="p-5">
            <h3 class="text-lg font-bold text-secondary mb-2">{{ dept.name }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
              {{ dept.description }}
            </p>

            <!-- Team Avatars & See Detail -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <!-- Avatar Stack -->
                <div class="flex -space-x-2">
                  <div
                    v-for="(avatar, idx) in dept.teamAvatars.slice(0, 4)"
                    :key="idx"
                    class="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm"
                  >
                    <img
                      :src="avatar"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span
                  v-if="dept.teamCount > 4"
                  class="text-xs text-gray-400 ml-2"
                >
                  +{{ dept.teamCount - 4 }} others
                </span>
              </div>

              <ElButton
                type="primary"
                size="small"
                class="rounded-lg"
                @click="handleViewDetail(dept)"
              >
                See Detail
              </ElButton>
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { departmentService } from '@/api/services';
import {
  getDepartmentImageUrl,
  getDefaultDepartmentDescription,
  generateTeamAvatars,
} from '@/utils/business/department';

defineOptions({ name: 'Departments' });

// State
const loading = ref(false);
const searchQuery = ref('');

interface Department {
  id: number;
  name: string;
  description: string;
  image: string;
  teamAvatars: string[];
  teamCount: number;
}

const departments = ref<Department[]>([]);

// Computed
const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value;
  const query = searchQuery.value.toLowerCase();
  return departments.value.filter(
    (d) => d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query),
  );
});

// Methods
const fetchDepartments = async () => {
  loading.value = true;
  try {
    const res = await departmentService.fetchDepartments();
    const list = res.records || res.list || res || [];
    departments.value = list.map((d: any, index: number) => ({
      id: d.id || index + 1,
      name: d.name,
      description: d.description || getDefaultDepartmentDescription(d.name),
      image: d.image || getDepartmentImageUrl(d.name),
      teamAvatars: generateTeamAvatars(d.name, d.doctorCount || 5),
      teamCount: d.doctorCount || Math.floor(Math.random() * 15) + 5,
    }));
  } catch {
    // Handle Error
  } finally {
    loading.value = false;
  }
};

const handleAddDepartment = () => {
  ElMessage.info('Add Department dialog would open here');
};

const handleViewDetail = (dept: Department) => {
  ElMessage.info(`Viewing ${dept.name} department details`);
};

onMounted(() => {
  fetchDepartments();
});
</script>

<style scoped>
.departments-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
