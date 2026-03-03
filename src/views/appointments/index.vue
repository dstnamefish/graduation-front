<template>
  <div class="h-full flex flex-col">
    <!-- 表头 -->
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <!-- Tabs -->
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
        <WnSearchBarInline
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
      </template>
    </WnTableHeader>

    <!-- 表格内容 -->
    <div class="flex-1 min-h-0">
      <WnTable
        ref="tableRef"
        :loading="loading"
        :pagination="pagination"
        :data="tableData"
        :columns="columns"
        header-theme="soft"
        :border="true"
        pagination-background="gray"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
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
            class="inline-flex items-center transition-all duration-300"
            :class="getStatusClass(String(value))"
          >
            {{
              value === AppointmentStatus.COMPLETED
                ? 'Confirmed'
                : value === AppointmentStatus.PENDING
                  ? 'Pending'
                  : 'Cancelled'
            }}
          </div>
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-500 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-200"
              @click="handleReschedule(row)"
            >
              Reschedule
            </button>
            <button
              class="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-500 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-200"
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { getMockAppointments } from '@/mock/appointments';
import { AppointmentStatus, type AppointmentResponse } from '@/types/api/appointment.types';
import type { ColumnOption } from '@/types';
import { formatDate, formatTime, getStatusClass } from '@/utils';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSearchBarInline, {
  type SearchFormItem,
} from '@/components/core/forms/Wn-search-bar/index.vue';
import { useTable } from '@/hooks/core/useTable';

defineOptions({ name: 'Appointments' });

const tableRef = ref();
const activeTab = ref('all');

/**
 * 模拟后端 API 请求
 */
const mockApiFn = async (params: any) => {
  await new Promise((r) => setTimeout(r, 600));

  const allMockData = getMockAppointments();
  const { query, date, status, current, size } = params;

  const filtered = allMockData.filter((item) => {
    const matchStatus = status === null || item.status === status;
    const matchDate = !date || item.appointmentDate === date;
    const matchQuery =
      !query ||
      [item.patientName, item.doctorName, item.departmentName].some((field) =>
        field?.toLowerCase().includes(query.toLowerCase()),
      );
    return matchStatus && matchDate && matchQuery;
  });

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
      date: '',
      status: null,
    },
    immediate: true,
  },
});

// Computed for Tab labels (Keep as local state for UI richness)
const statusCounts = computed(() => {
  const all = getMockAppointments();
  return {
    all: all.length,
    confirmed: all.filter((d) => d.status === AppointmentStatus.COMPLETED).length,
    pending: all.filter((d) => d.status === AppointmentStatus.PENDING).length,
    cancelled: all.filter((d) => d.status === AppointmentStatus.CANCELLED).length,
  };
});

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
    icon: 'local-common/search', // 简化
    props: {
      placeholder: 'Search name, doctor...',
      style: { width: '240px' },
    },
  },
  {
    key: 'date',
    type: 'date',
    icon: 'solar:calendar-bold', // 简化
    props: {
      placeholder: 'Today',
      format: 'DD MMM YYYY',
      valueFormat: 'YYYY-MM-DD',
      class: 'w-24!',
    },
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
      'Are you sure you want to cancel the appointment for ' + row.patientName + '?',
      'Confirm Cancellation',
      {
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        confirmButtonText: 'Yes, cancel it',
        cancelButtonText: 'No, keep it',
      },
    );
    ElMessage.success('Appointment for ' + row.patientName + ' has been cancelled.');
  } catch {}
};

watch([() => searchModel.query, () => searchModel.date], () => handleSearch());
</script>
