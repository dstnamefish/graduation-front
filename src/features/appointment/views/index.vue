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
import * as AppointmentApi from '../api';
import type { Appointment, AppointmentQuery, AppointmentPageResponse, AppointmentCancelParams } from '../types';
import {
  getStatusClass,
  getAppointmentStatusLabel,
} from '@/shared/lib/utils/ui/status';
import { ColumnOption } from '@/shared/ui/types/form';
import { SearchFormItem } from '@/shared/ui/core/forms/Wn-search-bar/index.vue';
import { ref, computed, watch } from 'vue';
import { useTable } from '@/shared/lib/hooks/core/useTable';

defineOptions({ name: 'Appointments' });

const tableRef = ref();
const activeTab = ref('all');
const selectedRows = ref<Appointment[]>([]);

const apiFn = async (params: any): Promise<any> => {
  try {
    const { current, size, query, date, status, ...rest } = params;

    // 构建查询参数
    const queryParams: AppointmentQuery = {
      page: current,
      size: size,
      query: query,
      status: status,
      dateFilter: date || undefined,
      ...rest,
    };

    const response = await AppointmentApi.getAppointmentPage(queryParams);

    return {
      data: response.records || [],
      total: response.total || 0,
      current: response.current,
      size: response.size,
    };
  } catch (error) {
    ElMessage.error('Failed to fetch appointments');
    console.error('Error fetching appointments:', error);
    return {
      data: [],
      total: 0,
      current: 1,
      size: 10,
    };
  }
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

// 模拟统计数据
const statsData = ref({ all: 0, confirmed: 0, pending: 0, cancelled: 0 });
const isStatsLoading = ref(false);

const statusTabs = computed(() => {
  const counts = statsData.value || { all: 0, confirmed: 0, pending: 0, cancelled: 0 };
  return [
    { label: 'All', value: null, count: counts.all },
    { label: 'Pending', value: 1, count: counts.pending }, // 1-待就诊
    { label: 'Completed', value: 2, count: counts.confirmed }, // 2-已完成
    { label: 'Cancelled', value: 3, count: counts.cancelled }, // 3-已取消
  ];
});

// 取消预约函数
const cancelAppointment = async (id: number) => {
  try {
    const params: AppointmentCancelParams = { id };
    await AppointmentApi.cancelAppointment(params);
    return true;
  } catch (error) {
    ElMessage.error('Failed to cancel appointment');
    console.error('Error canceling appointment:', error);
    return false;
  }
};

const handleRescheduleFn = () => {
  ElMessage.info('Reschedule functionality coming soon!');
};

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
  { label: 'Treatment', prop: 'treatmentName', minWidth: 200, sortable: true },
  { label: 'Status', prop: 'status', width: 140, useSlot: true, sortable: true },
  { label: 'Action', prop: 'action', minWidth: 220, useSlot: true, fixed: 'right' },
];

const handleTabUpdate = (name: any) => {
  const status = name === 'all' ? null : Number(name);
  searchModel.status = status === null ? undefined : status;
  handleSearch();
};

const handleAddAppointment = () => {
  ElMessage.success('Add Appointment modal coming soon!');
};

const handleReschedule = (row: Appointment) => {
  handleRescheduleFn();
};

const handleCancel = async (row: Appointment) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel appointment for ' + row.patientName + '?',
      'Confirm Cancellation',
      { type: 'warning', confirmButtonClass: 'el-button--danger' },
    );

    const success = await cancelAppointment(row.id);
    if (success) {
      ElMessage.success('Appointment for ' + row.patientName + ' has been cancelled.');
      handleSearch();
    }
  } catch (error: any) {
    if (error !== 'cancel') {
    }
  }
};

const handleSelectionChange = (selection: Appointment[]) => {
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

    const results = await Promise.all(selectedRows.value.map((row) => cancelAppointment(row.id)));
    const successCount = results.filter(r => r).length;

    ElMessage.success(`${successCount} appointment(s) have been cancelled.`);
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