<template>
  <div
    class="department-detail-page flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-50"
  >
    <!-- Custom Header corresponding to the design -->
    <header class="p-6 border-b border-slate-100 flex items-center gap-4 shrink-0">
      <button
        @click="goBack"
        class="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-700 active:scale-95"
        aria-label="Go back to department list"
      >
        <WnSvgIcon
          icon="local-common/arrow-left"
          :size="20"
        />
      </button>

      <div class="flex flex-col">
        <span class="text-xs font-medium text-slate-400 mb-0.5">Back to Department List</span>
        <h1 class="text-xl font-extrabold text-slate-800 leading-tight">Department Details</h1>
      </div>
    </header>

    <!-- Main Content Area -->
    <main
      class="flex-1 overflow-y-auto p-6"
      v-loading="loading"
    >
      <div
        v-if="department"
        class="max-w-5xl mx-auto flex flex-col gap-8"
      >
        <!-- Hero Section -->
        <div class="relative w-full aspect-[21/9] rounded-3xl overflow-hidden bg-slate-50">
          <img
            :src="department.image"
            :alt="department.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
            <h2 class="text-4xl font-extrabold text-white">{{ department.name }}</h2>
            <div
              class="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 text-white font-medium border border-white/10"
            >
              Floor {{ department.floor }}
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div
              class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4"
            >
              <WnSvgIcon
                icon="solar:user-bold-duotone"
                :size="24"
              />
            </div>
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
              Department Head
            </h3>
            <p class="text-lg font-bold text-slate-800">{{ department.head }}</p>
          </div>

          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div
              class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4"
            >
              <WnSvgIcon
                icon="solar:users-group-rounded-bold-duotone"
                :size="24"
              />
            </div>
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
              Medical Staff
            </h3>
            <p class="text-lg font-bold text-slate-800">{{ department.teamCount }} Specialists</p>
          </div>

          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div
              class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4"
            >
              <WnSvgIcon
                icon="solar:shield-check-bold-duotone"
                :size="24"
              />
            </div>
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
              Department Code
            </h3>
            <p class="text-lg font-bold text-slate-800">{{ department.code }}</p>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-slate-50 rounded-2xl p-8 border border-slate-100">
          <h3 class="text-xl font-bold text-slate-800 mb-4">About this Department</h3>
          <p class="text-slate-600 leading-relaxed text-lg">{{ department.description }}</p>
        </div>
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
import { getMockDepartments, type DepartmentItem } from '@/mock/departments';

defineOptions({ name: 'DepartmentDetail' });

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const department = ref<DepartmentItem | null>(null);

const goBack = () => {
  router.push({ name: 'Departments' });
};

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const allItems = getMockDepartments();
    const found = allItems.find((item) => item.id === id);
    if (found) {
      department.value = found;
    } else {
      department.value = null;
    }
  } catch (err) {
    console.error('Failed to load department details:', err);
    department.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDetail();
});
</script>
