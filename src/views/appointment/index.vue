<template>
  <div class="h-full flex flex-col">
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnTabSwitch
          v-model="activeTab"
          :options="statusTabs"
          type="status"
          @change="handleTabUpdate"
        />
      </template>
      <template #right>
        <WnSearchBar
          v-model="searchModel"
          :items="searchItems"
          @keyup.enter="handleSearch"
        />
        <WnButton
          mode="add"
          @click="handleAddAppointment"
        >
          {{ $t('appointments.addAppointment') }}
        </WnButton>
        <ElButton
          v-if="selectedRows.length > 0"
          type="danger"
          @click="handleBatchCancel"
        >
          {{ $t('appointments.batchCancel') }} ({{ selectedRows.length }})
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
        <template #appointmentDate="{ value }">{{ formatDate(value) }}</template>
        <template #appointmentTime="{ value }">{{ formatTime(value) }}</template>
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
              {{ $t('appointments.reschedule') }}
            </button>
            <button
              class="px-2 py-0.5 c-p text-action-text hover:text-action-text-hover active:text-action-text-active"
              @click="handleCancel(row)"
            >
              {{ $t('appointments.cancel') }}
            </button>
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElButton } from 'element-plus';
import * as AppointmentApi from '@/api/appointment';
import type {
  Appointment,
  AppointmentQuery,
  AppointmentCancelParams,
  AppointmentStatusCount,
} from '@/types/api/appointment';
import { AppointmentStatus } from '@/types/api/appointment';
import { getStatusClass, getAppointmentStatusLabel } from '@/utils/ui/status';
import { formatDate, formatTime } from '@/utils/format/date';
import { ColumnOption } from '@/types/component';
import { SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import { useTable } from '@/hooks/core/useTable';
import WnTabSwitch from '@/components/core/widget/Wn-tab-switch/index.vue';
import { $t } from '@/locales';

defineOptions({ name: 'Appointments' });

const tableRef = ref();
const activeTab = ref('all');
const selectedRows = ref<Appointment[]>([]);

/** 统计数据 */
const statsData = ref({ all: 0, confirmed: 0, pending: 0, cancelled: 0 });
const isStatsLoading = ref(false);

/** 获取统计数据 */
const fetchStats = async () => {
  isStatsLoading.value = true;
  try {
    const response = await AppointmentApi.fetchStatusCount();
    const statusCounts: AppointmentStatusCount[] = response || [];
    let all = 0;
    let confirmed = 0;
    let pending = 0;
    let cancelled = 0;
    statusCounts.forEach((item) => {
      const count = Number(item.count) || 0;
      all += count;
      switch (item.status) {
        case AppointmentStatus.CONFIRMED:
          confirmed = count;
          break;
        case AppointmentStatus.PENDING:
          pending = count;
          break;
        case AppointmentStatus.CANCELLED:
          cancelled = count;
          break;
      }
    });
    statsData.value = { all, confirmed, pending, cancelled };
  } catch (error) {
    console.error('Failed to fetch appointment stats:', error);
    statsData.value = { all: 0, confirmed: 0, pending: 0, cancelled: 0 };
  } finally {
    isStatsLoading.value = false;
  }
};

/** 页面加载时获取统计数据 */
onMounted(() => {
  fetchStats();
});

const apiFn = async (params: any): Promise<any> => {
  try {
    const response = await AppointmentApi.fetchPage(params);
    return {
      data: response.records || [],
      total: response.total || 0,
      current: response.current,
      size: response.size,
    };
  } catch (error) {
    ElMessage.error('Failed to fetch appointments');
    console.error('Error fetching appointments:', error);
    return { data: [], total: 0, current: 1, size: 10 };
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
    apiParams: { query: '', date: '', status: undefined },
    paginationKey: { current: 'pageNum', size: 'pageSize' },
    immediate: true,
  },
});

/** 状态标签页配置 */
const statusTabs = computed(() => {
  const counts = statsData.value || { all: 0, confirmed: 0, pending: 0, cancelled: 0 };
  return [
    { label: $t('appointments.status.all'), value: 'all', count: counts.all },
    { label: $t('appointments.status.confirmed'), value: 2, count: counts.confirmed },
    { label: $t('appointments.status.pending'), value: 1, count: counts.pending },
    { label: $t('appointments.status.cancelled'), value: 3, count: counts.cancelled },
  ];
});

/** 取消预约函数 */
const cancelAppointment = async (id: number) => {
  try {
    const params: AppointmentCancelParams = { id };
    await AppointmentApi.cancel(params);
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

/** 搜索项配置 */
const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    props: { placeholder: $t('appointments.searchPlaceholder') },
  },
  { key: 'date', type: 'shadcn-date' },
]);

/** 表格列配置 */
const columns = computed<ColumnOption[]>(() => [
  { type: 'selection' as const, minWidth: 60, align: 'center' },
  { label: $t('appointments.table.name'), prop: 'patientName', minWidth: 200, sortable: true },
  {
    label: $t('appointments.table.date'),
    prop: 'appointmentDate',
    minWidth: 160,
    useSlot: true,
    sortable: true,
  },
  {
    label: $t('appointments.table.time'),
    prop: 'appointmentTime',
    minWidth: 130,
    useSlot: true,
    sortable: true,
  },
  { label: $t('appointments.table.doctor'), prop: 'doctorName', minWidth: 200, sortable: true },
  {
    label: $t('appointments.table.treatment'),
    prop: 'treatmentName',
    minWidth: 200,
    sortable: true,
  },
  {
    label: $t('appointments.table.status'),
    prop: 'status',
    width: 140,
    useSlot: true,
    sortable: true,
  },
  { label: $t('appointments.table.action'), prop: 'action', width: 220, useSlot: true },
]);

const handleTabUpdate = (value: string | number) => {
  searchModel.status = value === 'all' ? undefined : Number(value);
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
      $t('appointments.confirmCancel', { patient: row.patientName }),
      $t('appointments.cancelTitle'),
      { type: 'warning', confirmButtonClass: 'el-button--danger' },
    );
    const success = await cancelAppointment(row.id);
    if (success) {
      ElMessage.success('Appointment for ' + row.patientName + ' has been cancelled.');
      handleSearch();
      fetchStats();
    }
  } catch (error: any) {
    if (error !== 'cancel') {
    }
  }
};

const handleSelectionChange = (selection: Appointment[]) => {
  selectedRows.value = selection;
};

const handleBatchCancel = async () => {
  if (selectedRows.value.length === 0) return;
  try {
    await ElMessageBox.confirm(
      $t('appointments.confirmBatchCancel', { count: selectedRows.value.length }),
      $t('appointments.batchCancelTitle'),
      {
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        confirmButtonText: $t('appointments.yesCancel'),
        cancelButtonText: $t('appointments.noKeep'),
      },
    );
    const results = await Promise.all(selectedRows.value.map((row) => cancelAppointment(row.id)));
    const successCount = results.filter((r) => r).length;
    ElMessage.success(`${successCount} appointment(s) have been cancelled.`);
    selectedRows.value = [];
    tableRef.value?.elTableRef?.clearSelection();
    handleSearch();
    fetchStats();
  } catch (error: any) {
    if (error !== 'cancel') {
    }
  }
};

watch([() => searchModel.query, () => searchModel.date], () => handleSearch());
</script>
