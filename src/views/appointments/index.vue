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
        header-theme="gray"
        :border="true"
        background-theme="gray"
        @pagination:size-change="handlePaginationChange('size', $event)"
        @pagination:current-change="handlePaginationChange('current', $event)"
      >
        <template #patientName="{ row }">
          <div class="flex items-center gap-4 py-4 cursor-pointer pl-0 group">
            <div
              class="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/80 transition-all duration-300 group-hover:shadow-md group-hover:scale-105"
            >
              <img
                v-if="row.patientAvatar"
                :src="row.patientAvatar"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <WnSvgIcon
                v-else
                icon="solar:user-bold"
                :size="24"
                class="text-slate-200 flex-cc h-full w-full"
              />
            </div>
            <div class="flex flex-col gap-0.5">
              <span
                class="font-bold text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-1"
              >
                {{ row.patientName || 'Unknown' }}
              </span>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                ID: P-{{ row.id + 1000 }}
              </span>
            </div>
          </div>
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
            :class="[
              'inline-flex items-center px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase border transition-all duration-300',
              statusClassMap[value],
            ]"
          >
            {{ getStatusLabel(value) }}
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
import { ref, reactive, computed, onMounted, watch, h } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getMockAppointments } from '@/mock/appointments';
import { AppointmentStatus, type AppointmentResponse } from '@/types/api/appointment.types';
import type { ColumnOption } from '@/types';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSearchBarInline, {
  type SearchFormItem,
} from '@/components/core/forms/Wn-search-bar/index.vue';

defineOptions({ name: 'Appointments' });

// State
const tableRef = ref();
const loading = ref(false);
const searchModel = reactive({
  query: '',
  date: '',
});
const activeStatus = ref<number | null>(null);
const activeTab = ref('all');
const allData = ref<AppointmentResponse[]>([]);
const tableData = ref<AppointmentResponse[]>([]);
const pagination = reactive({ current: 1, size: 10, total: 0 });

const statusClassMap: Record<number, string> = {
  [AppointmentStatus.COMPLETED]: 'bg-[#E6FFFB] border-[#B5F5EC] text-[#13C2C2]',
  [AppointmentStatus.PENDING]: 'bg-[#FFF7E6] border-[#FFE7BA] text-[#FAAD14]',
  [AppointmentStatus.CANCELLED]: 'bg-[#F5F5F5] border-[#D9D9D9] text-[#8C8C8C]',
};

const getStatusLabel = (status: number) => {
  const map: Record<number, string> = {
    [AppointmentStatus.PENDING]: 'Pending',
    [AppointmentStatus.COMPLETED]: 'Confirmed',
    [AppointmentStatus.CANCELLED]: 'Cancelled',
  };
  return map[status]?.toUpperCase() || 'UNKNOWN';
};

// Computed
const statusCounts = computed(() => ({
  all: allData.value.length,
  confirmed: allData.value.filter((d) => d.status === AppointmentStatus.COMPLETED).length,
  pending: allData.value.filter((d) => d.status === AppointmentStatus.PENDING).length,
  cancelled: allData.value.filter((d) => d.status === AppointmentStatus.CANCELLED).length,
}));

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
    props: {
      placeholder: 'Search placeholder',
      style: { width: '240px' },
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-common/search', size: 18 })]),
    },
  },
  {
    key: 'date',
    type: 'date',
    props: {
      placeholder: 'Today',
      format: 'DD MMM YYYY',
      valueFormat: 'YYYY-MM-DD',
      class: 'w-24!',
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'solar:calendar-bold', size: 18 })]),
    },
  },
]);

const columns: ColumnOption[] = [
  { type: 'selection', width: 60, align: 'center' },
  { label: 'Name', prop: 'patientName', minWidth: 240, useSlot: true, sortable: true },
  { label: 'Date', prop: 'appointmentDate', minWidth: 160, useSlot: true, sortable: true },
  { label: 'Time', prop: 'appointmentTime', minWidth: 130, useSlot: true, sortable: true },
  { label: 'Doctor', prop: 'doctorName', minWidth: 220, useSlot: true, sortable: true },
  { label: 'Treatment', prop: 'departmentName', minWidth: 200, useSlot: true, sortable: true },
  { label: 'Status', prop: 'status', width: 140, useSlot: true, align: 'center', sortable: true },
  { label: 'Action', prop: 'action', width: 220, useSlot: true, fixed: 'right' },
];

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  return d.getDate() + ' ' + d.toLocaleString('en-US', { month: 'long' }) + ' ' + d.getFullYear();
};

const formatTime = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return hour12.toString().padStart(2, '0') + ':' + m + ' ' + ampm;
};

const fetchData = async () => {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 600));
  allData.value = getMockAppointments();
  applyFilters();
  loading.value = false;
};

const applyFilters = () => {
  const filtered = allData.value.filter((item) => {
    const matchStatus = activeStatus.value === null || item.status === activeStatus.value;
    const matchDate = !searchModel.date || item.appointmentDate === searchModel.date;
    const matchQuery =
      !searchModel.query ||
      [item.patientName, item.doctorName, item.departmentName].some((field) =>
        field?.toLowerCase().includes(searchModel.query.toLowerCase()),
      );
    return matchStatus && matchDate && matchQuery;
  });

  pagination.total = filtered.length;
  const start = (pagination.current - 1) * pagination.size;
  tableData.value = filtered.slice(start, start + pagination.size);
};

const handleTabUpdate = (name: any) => {
  activeStatus.value = name === 'all' ? null : Number(name);
  pagination.current = 1;
  applyFilters();
};

const handleSearch = () => {
  pagination.current = 1;
  applyFilters();
};

const handleDateChange = () => {
  pagination.current = 1;
  applyFilters();
};

const handlePaginationChange = (type: 'size' | 'current', val: number) => {
  pagination[type] = val;
  if (type === 'size') pagination.current = 1;
  applyFilters();
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
  } catch {
    // User cancelled
  }
};

watch([() => searchModel.query, () => searchModel.date], () => handleSearch());

onMounted(() => fetchData());
</script>
