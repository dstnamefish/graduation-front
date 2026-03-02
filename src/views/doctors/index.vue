<!-- 医生列表页面 -->
<template>
  <div class="bg-surface-sunken h-full rounded-2xl flex flex-col overflow-hidden">
    <!-- 表头 -->
    <WnTableHeader class="shrink-0 p-6">
      <template #left>
        <WnSearchBarInline
          v-model="searchModel"
          :items="searchItems"
          @keyup.enter="handleSearch"
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
        @pagination:size-change="handlePaginationChange('size', $event)"
        @pagination:current-change="handlePaginationChange('current', $event)"
      >
        <template #name="{ row }">
          <div class="flex items-center gap-3.5 py-2">
            <div
              class="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 flex-cc shrink-0 border border-slate-100 shadow-sm"
            >
              <img
                v-if="row.avatar"
                :src="row.avatar"
                class="w-full h-full object-cover"
              />
              <WnSvgIcon
                v-else
                icon="solar:user-bold"
                :size="20"
                class="text-slate-300"
              />
            </div>
            <span class="">{{ row.name }}</span>
          </div>
        </template>

        <template #availabilityStatus="{ value }">
          <div
            :class="[
              ' inline-flex items-center px-3 py-1 rounded-lg border',
              statusClassMap[value as keyof typeof statusClassMap],
            ]"
          >
            {{ value }}
          </div>
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="action-btn edit-btn"
              title="Edit"
              @click="handleEdit(row)"
            >
              <WnSvgIcon
                icon="local-common/edit"
                :size="18"
              />
            </button>
            <button
              class="action-btn delete-btn"
              title="Delete"
              @click="handleDelete(row)"
            >
              <WnSvgIcon
                icon="local-common/trash"
                :size="18"
            />
            </button>
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h, watch } from 'vue';
import { getMockDoctors } from '@/mock/doctors';
import WnSearchBarInline, {
  type SearchFormItem,
} from '@/components/core/forms/Wn-search-bar/index.vue';
import type { DoctorItem } from '@/types/api/doctor.types';
import type { ColumnOption } from '@/types';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';

defineOptions({ name: 'Doctors' });

// State
const tableRef = ref();
const loading = ref(false);

const searchModel = reactive({
  query: '',
  department: '',
  specialty: '',
  status: '',
});

const statusClassMap = {
  'Available': 'bg-secondary border-primary text-tertiary text-sm',
  'On Leave': 'bg-error border-error text-error',
};

const handlePaginationChange = (type: 'size' | 'current', val: number) => {
  pagination[type] = val;
  if (type === 'size') pagination.current = 1;
  applyFilters();
};

watch(
  () => [searchModel.department, searchModel.specialty, searchModel.status, searchModel.query],
  () => handleSearch(),
);

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    background: 'var(--color-field)',
    props: {
      placeholder: 'Search name, age, ID, etc',
      style: { width: '320px' },
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-common/search', size: 16 })]),
    },
  },
  {
    key: 'department',
    type: 'select',
    background: 'var(--color-field)',
    props: {
      placeholder: 'Department',
      options: departments.value.map((d) => ({ label: d, value: d })),
      fitInputWidth: true,
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-table/filter', size: 16 })]),
    },
  },
  {
    key: 'specialty',
    type: 'select',
    background: 'var(--color-field)',
    props: {
      placeholder: 'Specialist',
      options: specialists.value.map((s) => ({ label: s, value: s })),
      fitInputWidth: true,
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-table/filter', size: 16 })]),
    },
  },
  {
    key: 'status',
    type: 'select',
    background: 'var(--color-field)',
    props: {
      placeholder: 'Status',
      options: [
        { label: 'Available', value: 'Available' },
        { label: 'On Leave', value: 'On Leave' },
      ],
      fitInputWidth: true,
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-table/filter', size: 16 })]),
    },
  },
]);

const allData = ref<DoctorItem[]>([]);
const tableData = ref<DoctorItem[]>([]);
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

const departments = computed(() => [...new Set(allData.value.map((d) => d.departmentName))]);
const specialists = computed(() => [...new Set(allData.value.map((d) => d.specialty))]);

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

const fetchData = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const data = getMockDoctors();
    allData.value = data;
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    ElMessage.error('Failed to load doctor data');
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  const { query, department, specialty, status } = searchModel;
  const lowerQuery = query.toLowerCase();

  const filtered = allData.value.filter(
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

  pagination.total = filtered.length;
  const start = (pagination.current - 1) * pagination.size;
  tableData.value = filtered.slice(start, start + pagination.size);
};

const handleSearch = () => {
  pagination.current = 1;
  applyFilters();
};

const handleAddDoctor = () => {
  ElMessage.success('Add Doctor functionality coming soon!');
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

onMounted(() => {
  fetchData();
});
</script>