<!-- 医生列表页面 -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getStatusClass } from '@/shared/lib/utils';
import WnSearchBar, { type SearchFormItem } from '@/shared/ui/core/forms/Wn-search-bar/index.vue';
import type { DoctorResponse } from '@/features/doctor/types';
import type { ColumnOption } from '@/types';
import WnSvgIcon from '@/shared/ui/core/base/Wn-svg-icon/index.vue';
import WnTableHeader from '@/shared/ui/core/tables/Wn-table-header/index.vue';
import WnButton from '@/shared/ui/core/base/Wn-button/index.vue';
import WnTable from '@/shared/ui/core/tables/Wn-table/index.vue';
import { useTable } from '@/shared/lib/hooks/core/useTable';
import { doctorService } from '@/features/doctor/api';
import { departmentService } from '@/features/department/api';

defineOptions({ name: 'Doctors' });

const router = useRouter();
const tableRef = ref();
const departmentOptions = ref<{label: string, value: any}[]>([]);

// 获取科室列表用于筛选
const loadDepartments = async () => {
  try {
    const list = await departmentService.fetchAllDepartments();
    departmentOptions.value = list.map(d => ({
      label: d.name,
      value: d.id
    }));
  } catch (error) {
    console.error('Failed to load departments', error);
  }
};

onMounted(() => {
  loadDepartments();
});

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
    apiFn: (params: any) => {
      // 映射参数到后端 DTO
      const queryParams = {
        current: params.current,
        size: params.size,
        keyword: params.query,
        departmentId: params.departmentId,
        status: params.status === '' ? undefined : params.status
      };
      return doctorService.fetchDoctors(queryParams);
    },
    apiParams: {
      query: '',
      departmentId: undefined,
      status: '',
    },
    immediate: true,
  },
});

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    icon: 'local-common/search',
    background: 'var(--color-field)',
    props: {
      placeholder: 'Search name, doctor ID...',
      style: { width: '320px' },
    },
  },
  {
    key: 'departmentId',
    type: 'select',
    props: {
      placeholder: 'Department',
      options: [
        { label: 'All Departments', value: undefined },
        ...departmentOptions.value
      ],
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: 'Status',
      options: [
        { label: 'All Status', value: '' },
        { label: 'Available', value: 1 },
        { label: 'Unavailable', value: 0 },
      ],
      fitInputWidth: true,
    },
  },
]);

const columns: ColumnOption[] = [
  { label: 'Name', prop: 'name', minWidth: 180, useSlot: true, sortable: true },
  { label: 'ID', prop: 'doctorNo', minWidth: 140, sortable: true },
  { label: 'Department', prop: 'departmentName', minWidth: 160, sortable: true },
  { label: 'Created Time', prop: 'createdTime', minWidth: 180, sortable: true },
  {
    label: 'Status',
    prop: 'status',
    width: 200,
    useSlot: true,
    sortable: true,
  },
  { label: 'Action', prop: 'action', width: 180, useSlot: true },
];

const handleAddDoctor = () => {
  ElMessage.success('Add Doctor functionality coming soon!');
};

const handleGoDetail = (row: DoctorResponse) => {
  router.push({
    name: 'DoctorDetail',
    params: { id: row.id.toString() },
  });
};

const handleEdit = (row: DoctorResponse) => {
  ElMessage.info(`Editing ${row.name}`);
};

const handleDelete = async (row: DoctorResponse) => {
  try {
    await ElMessageBox.confirm(`Are you sure you want to remove ${row.name}?`, 'Delete Doctor', {
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
      confirmButtonText: 'Delete',
    });
    await doctorService.deleteDoctor(row.id);
    ElMessage.success(`${row.name} removed successfully`);
    handleSearch();
  } catch (error: any) {
    if (error !== 'cancel') {
       console.error(error);
    }
  }
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
              {{ row.name || row.nickName }}
            </span>
          </div>
        </template>

        <template #status="{ row }">
          <div
            class="inline-flex items-center px-3 py-1 rounded-lg border font-medium"
            :class="getStatusClass(row.status === 1 ? 'Available' : 'Unavailable', 'doctor')"
          >
            {{ row.status === 1 ? 'Available' : 'Unavailable' }}
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
