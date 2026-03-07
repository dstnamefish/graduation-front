<!-- 医生列表页面 -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getStatusClass, mapDoctorStatusToUI } from '@/utils';
import { getMockDoctors } from '@/mock/doctors';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import type { DoctorItem } from '@/types/api/core/doctor';
import type { ColumnOption } from '@/types';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import { useTable } from '@/hooks/core/useTable';

defineOptions({ name: 'Doctors' });

const router = useRouter();
const tableRef = ref();

/**
 * 模拟后端 API 请求
 */
const mockApiFn = async (params: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allMockData = getMockDoctors();
  const { query, department, specialty, status, current, size } = params;
  const lowerQuery = (query || '').toLowerCase();

  const filtered = allMockData.filter(
    (d) =>
      (!department || d.departmentName === department) &&
      (!specialty || d.specialty === specialty) &&
      (!status || d.availabilityStatus === status) &&
      (!query ||
        d.name.toLowerCase().includes(lowerQuery) ||
        d.doctorCode.toLowerCase().includes(lowerQuery) ||
        d.departmentName.toLowerCase().includes(lowerQuery) ||
        d.specialty.toLowerCase().includes(lowerQuery)),
  );

  return {
    records: filtered.slice((current - 1) * size, current * size),
    total: filtered.length,
    current,
    size,
  };
};

const {
  loading,
  data: tableData,
  pagination,
  searchParams: searchModel,
  handleCurrentChange,
  handleSizeChange,
  getData: handleSearch,
} = useTable({
  core: {
    apiFn: mockApiFn,
    apiParams: {
      query: '',
      department: '',
      specialty: '',
      status: '',
    },
    immediate: true,
  },
});

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    icon: 'local-common/search', // 简化
    background: 'var(--color-field)',
    props: {
      placeholder: 'Search name, age, ID, etc',
      style: { width: '320px' },
    },
  },
  {
    key: 'department',
    type: 'select',
    props: {
      placeholder: 'Department',
      options: departments.value.map((d) => ({ label: d, value: d })),
      fitInputWidth: true,
    },
  },
  {
    key: 'specialty',
    type: 'select',
    props: {
      placeholder: 'Specialist',
      options: specialists.value.map((s) => ({ label: s, value: s })),
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: 'Status',
      options: [
        { label: 'All', value: '' },
        { label: 'Available', value: 'Available' },
        { label: 'Unavailable', value: 'Unavailable' },
      ],
      fitInputWidth: true,
    },
  },
]);

const departments = computed(() => {
  return [...new Set(getMockDoctors().map((d) => d.departmentName))];
});
const specialists = computed(() => {
  return [...new Set(getMockDoctors().map((d) => d.specialty))];
});

const columns: ColumnOption[] = [
  { label: 'Name', prop: 'name', minWidth: 180, useSlot: true, sortable: true },
  { label: 'ID', prop: 'doctorCode', minWidth: 140, sortable: true },
  { label: 'Department', prop: 'departmentName', minWidth: 160, sortable: true },
  { label: 'Specialist', prop: 'specialty', minWidth: 180, sortable: true },
  { label: 'Total Patients', prop: 'totalPatients', minWidth: 150, sortable: true },
  { label: "Today's Appointment", prop: 'todayAppointments', minWidth: 180, sortable: true },
  {
    label: 'Availability Status',
    prop: 'availabilityStatus',
    width: 200,
    useSlot: true,
    sortable: true,
  },
  { label: 'Action', prop: 'action', width: 180, useSlot: true },
];

const handleAddDoctor = () => {
  ElMessage.success('Add Doctor functionality coming soon!');
};

const handleGoDetail = (row: DoctorItem) => {
  router.push({
    name: 'DoctorDetail',
    params: { id: row.id.toString() },
  });
};

const handleEdit = (row: DoctorItem) => {
  ElMessage.info(`Editing ${row.name}`);
};

const handleDelete = async (row: DoctorItem) => {
  try {
    await ElMessageBox.confirm(`Are you sure you want to remove ${row.name}?`, 'Delete Doctor', {
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
      confirmButtonText: 'Delete',
    });
    ElMessage.success(`${row.name} removed successfully`);
  } catch {}
};
</script>

<template>
  <div class="bg-surface-sunken h-full rounded-2xl flex flex-col overflow-hidden">
    <!-- 表头 -->
    <WnTableHeader class="shrink-0 p-6">
      <template #left>
        <WnSearchBar
          v-model="searchModel"
          :items="searchItems"
          @keyup.enter="handleSearch"
          search-bar-background="white"
        />
      </template>

      <template #right>
        <WnButton
          mode="add"
          @click="handleAddDoctor"
        >
          Add Doctor
        </WnButton>
      </template>
    </WnTableHeader>

    <!-- 表格内容 -->
    <div class="px-6 flex-1 min-h-0">
      <WnTable
        ref="tableRef"
        :loading="loading"
        :pagination="pagination"
        :data="tableData"
        :columns="columns"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #name="{ row }">
          <div
            class="flex items-center gap-3.5 py-2 cursor-pointer group"
            @click="handleGoDetail(row)"
          >
            <div
              class="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 flex-cc shrink-0 border border-slate-100 shadow-sm group-hover:border-primary-300 transition-colors duration-300"
            >
              <img
                v-if="row.avatar"
                :src="row.avatar"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <WnSvgIcon
                v-else
                icon="solar:user-bold"
                :size="20"
                class="text-slate-300 group-hover:text-primary-400 transition-colors duration-300"
              />
            </div>
            <span class="group-hover:text-primary-600 font-semibold transition-colors duration-300">
              {{ row.name }}
            </span>
          </div>
        </template>

        <template #availabilityStatus="{ value }">
          <div
            class="inline-flex items-center px-3 py-1 rounded-lg border font-medium"
            :class="getStatusClass(value as string, 'doctor')"
          >
            {{ value }}
          </div>
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-2 text-title">
            <WnSvgIcon
              icon="local-common/edit"
              :size="18"
              class="c-p hover:text-(--color-primary-500) active:text-(--color-primary-800) transition-colors"
              @click="handleEdit(row)"
            />
            <div class="w-[2px] h-4 bg-disabled-border"></div>
            <WnSvgIcon
              icon="local-common/trash"
              :size="18"
              class="c-p hover:text-(--color-danger-500) active:text-(--color-danger-600) transition-colors"
              @click="handleDelete(row)"
            />
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>
