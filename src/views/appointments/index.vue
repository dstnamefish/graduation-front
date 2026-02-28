<template>
  <div class="appointments-page">
    <!-- Header Section -->
    <WnTableHeader id="Wn-table-header">
      <template #left>
        <div class="flex items-center gap-3">
          <div class="flex rounded-xl overflow-hidden bg-gray-100">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              :class="[
                'px-4 py-2 text-xs font-bold transition-all',
                activeStatus === tab.value
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-200',
              ]"
              @click="handleStatusChange(tab.value)"
            >
              {{ tab.label }}
              <span
                v-if="tab.count !== undefined"
                class="ml-1 opacity-70"
              >
                ({{ tab.count }})
              </span>
            </button>
          </div>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <ElInput
            v-model="searchQuery"
            placeholder="Search placeholder..."
            prefix-icon="Search"
            class="w-48"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
          <ElDatePicker
            v-model="selectedDate"
            type="date"
            placeholder="Today"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-32"
            @change="handleDateChange"
          />
          <ElButton
            type="primary"
            @click="handleAddAppointment"
          >
            <WnSvgIcon
              icon="solar:add-circle-bold"
              :size="16"
              class="mr-1"
            />
            Add Appointment
          </ElButton>
        </div>
      </template>
    </WnTableHeader>

    <!-- Table Section -->
    <WnTable
      ref="tableRef"
      :loading="loading"
      :pagination="pagination"
      :data="tableData"
      :columns="columns"
      @pagination:size-change="handleSizeChange"
      @pagination:current-change="handleCurrentChange"
    >
      <!-- Avatar + Name Column -->
      <template #patientName="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex-cc shrink-0">
            <img
              v-if="row.patientAvatar"
              :src="row.patientAvatar"
              class="w-full h-full object-cover"
            />
            <WnSvgIcon
              v-else
              icon="solar:user-bold"
              :size="16"
              class="text-primary"
            />
          </div>
          <span class="font-medium text-secondary">{{ row.patientName || 'Unknown' }}</span>
        </div>
      </template>

      <!-- Date Column -->
      <template #appointmentDate="{ value }">
        <span class="text-gray-600">{{ formatDate(value) }}</span>
      </template>

      <!-- Time Column -->
      <template #appointmentTime="{ value }">
        <span class="text-gray-600">{{ value }}</span>
      </template>

      <!-- Doctor Column -->
      <template #doctorName="{ row }">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full overflow-hidden bg-secondary/10 flex-cc shrink-0">
            <WnSvgIcon
              icon="solar:stethoscope-bold"
              :size="12"
              class="text-secondary"
            />
          </div>
          <span class="text-secondary">{{ row.doctorName || 'Unassigned' }}</span>
        </div>
      </template>

      <!-- Treatment Column -->
      <template #departmentName="{ value }">
        <span class="text-gray-600">{{ value || 'General' }}</span>
      </template>

      <!-- Status Column -->
      <template #status="{ value }">
        <ElTag
          :type="getStatusType(value)"
          size="small"
          class="rounded-full px-3"
          effect="light"
        >
          {{ getStatusLabel(value) }}
        </ElTag>
      </template>

      <!-- Actions Column -->
      <template #action="{ row }">
        <div class="flex items-center gap-2">
          <ElButton
            v-if="row.status === 1"
            type="primary"
            size="small"
            link
            @click="handleReschedule(row)"
          >
            Reschedule
          </ElButton>
          <ElButton
            v-if="row.status === 1"
            type="danger"
            size="small"
            link
            @click="handleCancel(row)"
          >
            Cancel
          </ElButton>
          <ElButton
            v-if="row.status !== 1"
            type="info"
            size="small"
            link
            @click="handleViewDetails(row)"
          >
            View
          </ElButton>
        </div>
      </template>
    </WnTable>

    <!-- Add/Edit Dialog -->
    <ElDialog
      v-model="dialogVisible"
      :title="editingAppointment ? 'Edit Appointment' : 'New Appointment'"
      width="500px"
      destroy-on-close
    >
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <ElFormItem
          label="Patient"
          prop="patientId"
        >
          <ElSelect
            v-model="formData.patientId"
            placeholder="Select Patient"
            class="w-full"
          >
            <ElOption
              v-for="p in patients"
              :key="p.id"
              :label="p.name"
              :value="p.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          label="Doctor"
          prop="doctorId"
        >
          <ElSelect
            v-model="formData.doctorId"
            placeholder="Select Doctor"
            class="w-full"
          >
            <ElOption
              v-for="d in doctors"
              :key="d.id"
              :label="d.name"
              :value="d.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          label="Date"
          prop="appointmentDate"
        >
          <ElDatePicker
            v-model="formData.appointmentDate"
            type="date"
            placeholder="Select Date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </ElFormItem>
        <ElFormItem
          label="Time"
          prop="appointmentTime"
        >
          <ElTimePicker
            v-model="formData.appointmentTime"
            placeholder="Select Time"
            format="HH:mm"
            value-format="HH:mm"
            class="w-full"
          />
        </ElFormItem>
        <ElFormItem label="Remark">
          <ElInput
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="Optional notes"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">Cancel</ElButton>
        <ElButton
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ editingAppointment ? 'Update' : 'Create' }}
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { appointmentService, doctorService, patientService } from '@/api/services';
import type { AppointmentResponse, AppointmentStatus } from '@/types/api';
import type { ColumnOption } from '@/types/component';

defineOptions({ name: 'Appointments' });

// State
const tableRef = ref();
const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const searchQuery = ref('');
const selectedDate = ref('');
const activeStatus = ref<number | null>(null);
const editingAppointment = ref<AppointmentResponse | null>(null);

// Form
const formRef = ref();
const formData = reactive({
  patientId: null as number | null,
  doctorId: null as number | null,
  departmentId: 1,
  appointmentDate: '',
  appointmentTime: '',
  remark: '',
});

const formRules = {
  patientId: [{ required: true, message: 'Please select a patient', trigger: 'change' }],
  doctorId: [{ required: true, message: 'Please select a doctor', trigger: 'change' }],
  appointmentDate: [{ required: true, message: 'Please select a date', trigger: 'change' }],
  appointmentTime: [{ required: true, message: 'Please select a time', trigger: 'change' }],
};

// Data
const tableData = ref<AppointmentResponse[]>([]);
const patients = ref<{ id: number; name: string }[]>([]);
const doctors = ref<{ id: number; name: string }[]>([]);
const statusCounts = reactive({ all: 0, confirmed: 0, pending: 0, cancelled: 0 });

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// Status tabs
const statusTabs = computed(() => [
  { label: 'All', value: null, count: statusCounts.all },
  { label: 'Confirmed', value: 2, count: statusCounts.confirmed },
  { label: 'Pending', value: 1, count: statusCounts.pending },
  { label: 'Cancelled', value: 3, count: statusCounts.cancelled },
]);

// Columns
const columns: ColumnOption[] = [
  { label: 'Name', prop: 'patientName', minWidth: 180, useSlot: true },
  { label: 'Date', prop: 'appointmentDate', width: 120, useSlot: true },
  { label: 'Time', prop: 'appointmentTime', width: 100, useSlot: true },
  { label: 'Doctor', prop: 'doctorName', minWidth: 180, useSlot: true },
  { label: 'Treatment', prop: 'departmentName', minWidth: 150, useSlot: true },
  { label: 'Status', prop: 'status', width: 120, useSlot: true },
  { label: 'Action', prop: 'action', fixed: 'right', width: 180, useSlot: true },
];

// Methods
const formatDate = (date: string) => {
  if (!date) {
    return '';
  }
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusType = (status: AppointmentStatus) => {
  const map: Record<number, 'success' | 'warning' | 'danger' | 'info'> = {
    1: 'warning',
    2: 'success',
    3: 'danger',
    4: 'info',
    5: 'warning',
    6: 'info',
  };
  return map[status] || 'info';
};

const getStatusLabel = (status: AppointmentStatus) => {
  const map: Record<number, string> = {
    1: 'Pending',
    2: 'Confirmed',
    3: 'Cancelled',
    4: 'No Show',
    5: 'In Progress',
    6: 'Overdue',
  };
  return map[status] || 'Unknown';
};

const fetchAppointments = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.size,
      status: activeStatus.value || undefined,
      appointmentDate: selectedDate.value || undefined,
    };
    const res = await appointmentService.fetchAppointments(params);
    tableData.value = res.list || [];
    pagination.total = res.total || 0;

    // Update counts
    statusCounts.all = res.total || 0;
  } catch {
    // Use mock data on error
    tableData.value = getMockAppointments();
    pagination.total = tableData.value.length;
  } finally {
    loading.value = false;
  }
};

const fetchDoctorsAndPatients = async () => {
  try {
    const [doctorRes, patientRes] = await Promise.all([
      doctorService.fetchDoctors(),
      patientService.fetchPatients(),
    ]);
    doctors.value = (doctorRes.list || []).map((d: any) => ({ id: d.id, name: d.name }));
    patients.value = (patientRes.list || []).map((p: any) => ({ id: p.id, name: p.name }));
  } catch {
    // Mock data
    doctors.value = [
      { id: 1, name: 'Dr. Petra Winsburry' },
      { id: 2, name: 'Dr. Olivia Martinez' },
      { id: 3, name: 'Dr. Damian Sanchez' },
    ];
    patients.value = [
      { id: 1, name: 'Caren G. Simpson' },
      { id: 2, name: 'Edgar Marrow' },
      { id: 3, name: 'Ocean Jane Lapee' },
    ];
  }
};

const handleStatusChange = (status: number | null) => {
  activeStatus.value = status;
  pagination.current = 1;
  fetchAppointments();
};

const handleDateChange = () => {
  pagination.current = 1;
  fetchAppointments();
};

const handleSearch = () => {
  pagination.current = 1;
  fetchAppointments();
};

const handleSizeChange = (size: number) => {
  pagination.size = size;
  pagination.current = 1;
  fetchAppointments();
};

const handleCurrentChange = (page: number) => {
  pagination.current = page;
  fetchAppointments();
};

const handleAddAppointment = () => {
  editingAppointment.value = null;
  Object.assign(formData, {
    patientId: null,
    doctorId: null,
    appointmentDate: '',
    appointmentTime: '',
    remark: '',
  });
  dialogVisible.value = true;
};

const handleReschedule = (row: AppointmentResponse) => {
  editingAppointment.value = row;
  Object.assign(formData, {
    patientId: row.patientId,
    doctorId: row.doctorId,
    appointmentDate: row.appointmentDate,
    appointmentTime: row.appointmentTime,
    remark: row.remark || '',
  });
  dialogVisible.value = true;
};

const handleCancel = async (row: AppointmentResponse) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel this appointment?',
      'Cancel Appointment',
      { type: 'warning' },
    );
    await appointmentService.cancel(row.id);
    ElMessage.success('Appointment cancelled successfully');
    fetchAppointments();
  } catch {
    // User cancelled or API error
  }
};

const handleViewDetails = (row: AppointmentResponse) => {
  ElMessage.info(`Viewing appointment #${row.id}`);
};

const handleSubmit = async () => {
  if (!formRef.value) {
    return;
  }

  try {
    await formRef.value.validate();
    submitting.value = true;

    if (editingAppointment.value) {
      await appointmentService.updateAppointment({
        id: editingAppointment.value.id,
        ...formData,
      } as any);
      ElMessage.success('Appointment updated successfully');
    } else {
      await appointmentService.createAppointment(formData as any);
      ElMessage.success('Appointment created successfully');
    }

    dialogVisible.value = false;
    fetchAppointments();
  } catch {
    // Validation or API error
  } finally {
    submitting.value = false;
  }
};

// Mock data
const getMockAppointments = (): AppointmentResponse[] => [
  {
    id: 1,
    patientName: 'Caren G. Simpson',
    appointmentDate: '2026-07-20',
    appointmentTime: '09:00',
    doctorName: 'Dr. Petra Winsburry',
    departmentName: 'Routine Check-Up',
    status: 2,
  } as any,
  {
    id: 2,
    patientName: 'Edgar Marrow',
    appointmentDate: '2026-07-20',
    appointmentTime: '10:30',
    doctorName: 'Dr. Olivia Martinez',
    departmentName: 'Cardiac Consultation',
    status: 2,
  } as any,
  {
    id: 3,
    patientName: 'Ocean Jane Lapee',
    appointmentDate: '2026-07-20',
    appointmentTime: '11:00',
    doctorName: 'Dr. Damian Sanchez',
    departmentName: 'Pediatric Check-Up',
    status: 1,
  } as any,
  {
    id: 4,
    patientName: 'Shane Riddick',
    appointmentDate: '2026-07-20',
    appointmentTime: '01:00',
    doctorName: 'Dr. Chloe Harrington',
    departmentName: 'Skin Allergy',
    status: 3,
  } as any,
];

// Lifecycle
onMounted(() => {
  fetchAppointments();
  fetchDoctorsAndPatients();
});
</script>

<style scoped>
.appointments-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.flex-cc {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
