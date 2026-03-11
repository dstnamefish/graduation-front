<template>
  <div class="h-full flex flex-col">
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <ElTabs
          v-model="activeTab"
          @tab-change="handleTabUpdate"
        >
          <ElTabPane
            v-for="tab in statusTabs"
            :key="tab.value ?? 'all'"
            :name="String(tab.value ?? 'all')"
          >
            <template #label>
              <div class="flex items-center justify-center h-full">
                <span>{{ tab.label }}</span>
                <span
                  v-if="tab.count !== undefined"
                  class="tab-count"
                >
                  ({{ tab.count }})
                </span>
              </div>
            </template>
          </ElTabPane>
        </ElTabs>
      </template>

      <template #right>
        <WnSearchBar
          v-model="searchModel"
          :items="searchItems"
          @keyup.enter="handleSearch"
        />

        <WnButton
          mode="add"
          :show-icon="false"
          @click="handleAddAppointment"
        >
          Add Appointment
        </WnButton>

        <ElButton
          v-if="selectedRows.length > 0"
          type="danger"
          @click="handleBatchCancel"
        >
          Batch Cancel ({{ selectedRows.length }})
        </ElButton>
      </template>
    </WnTableHeader>

    <div class="flex-1 min-h-0">
      <WnTable
        ref="tableRef"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :data="tableData"
        :columns="columns"
        header-theme="soft"
        :border="true"
        pagination-background="gray"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >


        <template #status="{ value }">
          <div
            class="inline-flex items-center px-2 py-0.5 rounded-lg border transition-all duration-300"
            :class="getStatusClass(value, 'appointment')"
          >
            {{ getAppointmentStatusLabel(value) }}
          </div>
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-1">
            <button
              class="px-2 py-0.5 c-p bg-action-bg hover:bg-action-hover active:bg-action-active border border-action-border text-action-text hover:text-action-text-hover active:text-action-text-active rounded-lg transition-all active:scale-95"
              @click="handleReschedule(row)"
            >
              Reschedule
            </button>
            <button
              class="px-2 py-0.5 c-p text-action-text hover:text-action-text-hover active:text-action-text-active"
              @click="handleCancel(row)"
            >
              Cancel
            </button>
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElButton } from 'element-plus';
import { appointmentService } from '../api';
import { AppointmentStatus } from '../types';
import type { AppointmentResponse, GetAppointmentParams, AppointmentListResponse } from '../types';
import {
  getStatusClass,
  getAppointmentStatusLabel,
} from '@/shared/lib/utils/ui/status';
import {
  useAppointmentStats,
  useCancelAppointment,
  useRescheduleAppointment,
} from '../composables/useAppointmentQuery';
import { ColumnOption } from '@/shared/ui/types/form';
import { SearchFormItem } from '@/shared/ui/core/forms/Wn-search-bar/index.vue';

defineOptions({ name: 'Appointments' });

const tableRef = ref();
const activeTab = ref('all');
const selectedRows = ref<AppointmentResponse[]>([]);

const apiFn = async (params: GetAppointmentParams & { current: number; size: number }): Promise<AppointmentListResponse> => {
  const { current, size, ...queryParams } = params;

  // 处理参数映射
  const { query, date, ...rest } = queryParams as any;

  const response = await appointmentService.fetchAppointments({
    page: current,
    pageSize: size,
    keyword: query,
    appointmentDate: date,
    ...rest,
  });

  return {
    list: response.list || [],
    total: response.total || 0,
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
    apiFn,
    apiParams: {
      query: '',
      date: '',
      status: undefined,
    },
    immediate: true,
  },
});

const { data: statsData, isPending: isStatsLoading } = useAppointmentStats();

const statusTabs = computed(() => {
  const counts = statsData.value || { all: 0, confirmed: 0, pending: 0, cancelled: 0 };
  return [
    { label: 'All', value: null, count: counts.all },
    { label: 'Confirmed', value: AppointmentStatus.CONFIRMED, count: counts.confirmed },
    { label: 'Pending', value: AppointmentStatus.PENDING, count: counts.pending },
    { label: 'Cancelled', value: AppointmentStatus.CANCELLED, count: counts.cancelled },
  ];
});

const { mutateAsync: cancelMutate } = useCancelAppointment();
const handleRescheduleFn = useRescheduleAppointment();

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    icon: 'local-common/search',
    props: {
      placeholder: 'Search name, doctor...',
      style: { width: '240px' },
    },
  },
  {
    key: 'date',
    type: 'shadcn-date',
    placeholder: 'Today',
  },
]);

const columns: ColumnOption[] = [
  { type: 'selection' as const, width: 60, align: 'center' },
  { label: 'Name', prop: 'patientName', minWidth: 200, sortable: true },
  { label: 'Date', prop: 'appointmentDate', minWidth: 160, sortable: true },
  { label: 'Time', prop: 'appointmentTime', minWidth: 130, sortable: true },
  { label: 'Doctor', prop: 'doctorName', minWidth: 200, sortable: true },
  { label: 'Treatment', prop: 'departmentName', minWidth: 200, sortable: true },
  { label: 'Status', prop: 'status', width: 140, useSlot: true, sortable: true },
  { label: 'Action', prop: 'action', minWidth: 220, useSlot: true, fixed: 'right' },
];

const handleTabUpdate = (name: any) => {
  const status = name === 'all' ? null : Number(name);
  searchModel.status = status === null ? undefined : (status as AppointmentStatus);
  handleSearch();
};

const handleAddAppointment = () => {
  ElMessage.success('Add Appointment modal coming soon!');
};

const handleReschedule = (row: AppointmentResponse) => {
  handleRescheduleFn();
};

const handleCancel = async (row: AppointmentResponse) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel appointment for ' + row.patientName + '?',
      'Confirm Cancellation',
      { type: 'warning', confirmButtonClass: 'el-button--danger' },
    );

    await cancelMutate({ id: row.id, isBatch: false });
    ElMessage.success('Appointment for ' + row.patientName + ' has been cancelled.');
    handleSearch();
  } catch (error: any) {
    if (error !== 'cancel') {
    }
  }
};

const handleSelectionChange = (selection: AppointmentResponse[]) => {
  selectedRows.value = selection;
  console.log('选中的预约:', selection);
};

const handleBatchCancel = async () => {
  if (selectedRows.value.length === 0) return;

  try {
    await ElMessageBox.confirm(
      `Are you sure you want to cancel ${selectedRows.value.length} appointment(s)?`,
      'Confirm Batch Cancellation',
      {
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        confirmButtonText: 'Yes, cancel them',
        cancelButtonText: 'No, keep them',
      },
    );

    await Promise.all(selectedRows.value.map((row) => cancelMutate({ id: row.id, isBatch: true })));

    ElMessage.success(`${selectedRows.value.length} appointment(s) have been cancelled.`);
    selectedRows.value = [];
    tableRef.value?.elTableRef?.clearSelection();
    handleSearch();
  } catch (error: any) {
    if (error !== 'cancel') {
    }
  }
};

watch([() => searchModel.query, () => searchModel.date], () => handleSearch());
</script>