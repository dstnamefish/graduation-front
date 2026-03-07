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
        <template #patientName="{ row }">
          {{ row.patientName || 'Unknown' }}
        </template>

        <template #appointmentDate="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #appointmentTime="{ value }">
          {{ formatTime(value) }}
        </template>

        <template #doctorName="{ row }">
          {{ row.doctorName || 'Unassigned' }}
        </template>

        <template #departmentName="{ value }">
          {{ value || 'General' }}
        </template>

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
import { ref, computed, watch, onMounted } from 'vue'; // 确保引入依赖
import { ElMessage, ElMessageBox, ElButton } from 'element-plus';
import { appointmentService } from '@/api/core';
import { AppointmentStatus, type AppointmentResponse, type GetAppointmentParams } from '@/types/api/core/appointment';
import type { ColumnOption } from '@/types';
import {
  formatDate,
  formatTime,
  getStatusClass,
  mapAppointmentStatusToUI,
  getAppointmentStatusLabel,
} from '@/utils';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import { useTable } from '@/hooks/core/useTable';

defineOptions({ name: 'Appointments' });

const tableRef = ref();
const activeTab = ref('all');
const selectedRows = ref<AppointmentResponse[]>([]);

/**
 * 真实 API 请求函数
 */
const apiFn = async (params: GetAppointmentParams & { current: number; size: number }) => {
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
    records: response.list,
    total: response.total,
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
      status: null,
    },
    immediate: true,
  },
});

const statusCounts = ref({
  all: 0,
  confirmed: 0,
  pending: 0,
  cancelled: 0,
});

const fetchStatusCounts = async () => {
  try {
    const counts = await appointmentService.countByStatus();
    statusCounts.value.all = counts.reduce((acc, curr) => acc + curr.count, 0);
    statusCounts.value.confirmed =
      counts.find((c) => c.status === AppointmentStatus.COMPLETED)?.count || 0;
    statusCounts.value.pending =
      counts.find((c) => c.status === AppointmentStatus.PENDING)?.count || 0;
    statusCounts.value.cancelled =
      counts.find((c) => c.status === AppointmentStatus.CANCELLED)?.count || 0;
  } catch (error) {
    console.error('Failed to fetch status counts:', error);
  }
};

const statusTabs = computed(() => [
  { label: 'All', value: null, count: statusCounts.value.all },
  { label: 'Confirmed', value: AppointmentStatus.COMPLETED, count: statusCounts.value.confirmed },
  { label: 'Pending', value: AppointmentStatus.PENDING, count: statusCounts.value.pending },
  { label: 'Cancelled', value: AppointmentStatus.CANCELLED, count: statusCounts.value.cancelled },
]);

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
  { label: 'Name', prop: 'patientName', minWidth: 200, useSlot: true, sortable: true },
  { label: 'Date', prop: 'appointmentDate', minWidth: 160, useSlot: true, sortable: true },
  { label: 'Time', prop: 'appointmentTime', minWidth: 130, useSlot: true, sortable: true },
  { label: 'Doctor', prop: 'doctorName', minWidth: 200, useSlot: true, sortable: true },
  { label: 'Treatment', prop: 'departmentName', minWidth: 200, useSlot: true, sortable: true },
  { label: 'Status', prop: 'status', width: 140, useSlot: true, sortable: true },
  { label: 'Action', prop: 'action', minWidth: 220, useSlot: true, fixed: 'right' },
];

const handleTabUpdate = (name: any) => {
  const status = name === 'all' ? null : Number(name);
  searchModel.status = status;
  handleSearch();
};

const handleAddAppointment = () => {
  ElMessage.success('Add Appointment modal coming soon!');
};

const handleReschedule = (row: AppointmentResponse) => {
  ElMessage.info('Rescheduling ' + row.patientName + '...');
};

const handleCancel = async (row: AppointmentResponse) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel appointment for ' + row.patientName + '?',
      'Confirm Cancellation',
      {
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        confirmButtonText: 'Yes, cancel it',
        cancelButtonText: 'No, keep it',
      },
    );
    
    await appointmentService.cancel(row.id, { cancelReason: 'User requested cancellation' });
    ElMessage.success('Appointment for ' + row.patientName + ' has been cancelled.');
    handleSearch();
    fetchStatusCounts();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to cancel appointment: ' + (error.message || 'Unknown error'));
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

    // 批量取消接口（循环调用示例，若后端支持批量可优化）
    await Promise.all(
      selectedRows.value.map((row) =>
        appointmentService.cancel(row.id, { cancelReason: 'Batch cancellation' }),
      ),
    );

    ElMessage.success(`${selectedRows.value.length} appointment(s) have been cancelled.`);
    selectedRows.value = [];
    tableRef.value?.elTableRef?.clearSelection();
    handleSearch();
    fetchStatusCounts();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to batch cancel appointments');
    }
  }
};

onMounted(() => {
  fetchStatusCounts();
});

watch([() => searchModel.query, () => searchModel.date], () => handleSearch());
</script>