<!-- 患者列表页面 -->
<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import { ElAvatar, ElMessage } from 'element-plus';
import WnTable from '@/shared/ui/core/tables/Wn-table/index.vue';
import WnButton from '@/shared/ui/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/shared/ui/core/base/Wn-svg-icon/index.vue';
import WnSearchBar, { type SearchFormItem } from '@/shared/ui/core/forms/Wn-search-bar/index.vue';
import WnTableHeader from '@/shared/ui/core/tables/Wn-table-header/index.vue';
import { getStatusClass } from '@/shared/lib/utils';
import { useTable } from '@/shared/lib/hooks/core/useTable';
import { patientService } from '@/features/patient/api';
import type { PatientResponse } from '@/features/patient/types';

defineOptions({ name: 'PatientsList' });

const router = useRouter();
const tableRef = ref();

const {
  loading: tableLoading,
  data: tableData,
  pagination,
  searchParams: searchForm,
  handleCurrentChange,
  handleSizeChange,
  getData: handleSearch,
} = useTable({
  core: {
    apiFn: (params: any) => {
      const queryParams = {
        current: params.current,
        size: params.size,
        query: params.query,
        status: params.status === 'all' ? undefined : params.status,
        gender: params.gender === 'all' ? undefined : params.gender,
      };
      return patientService.fetchPatients(queryParams);
    },
    apiParams: {
      query: '',
      status: 'all',
      gender: 'all',
    },
    immediate: true,
  },
});

const leftSearchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: 'All Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 },
      ],
      fitInputWidth: true,
    },
  },
  {
    key: 'gender',
    type: 'select',
    props: {
      placeholder: 'Gender',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Male', value: 1 },
        { label: 'Female', value: 2 },
      ],
      fitInputWidth: true,
    },
  },
]);

const rightSearchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    props: {
      placeholder: 'Search name, phone, patient ID...',
      style: { width: '320px' },
    },
    slots: {
      prefix: () => h('div', { class: 'flex-cc ml-2' }, [
        h(WnSvgIcon, { icon: 'local-common/search', size: 16 })
      ]),
    },
  },
]);

const columns = [
   { label: 'Name', prop: 'name', useSlot: true, minWidth: 120 },
   { label: 'ID', prop: 'patientId', minWidth: 90 },
   { label: 'Age', prop: 'age', width: 90, align: 'center' },
   { label: 'Check In', prop: 'checkIn', width: 150 },
   { label: 'Treatment', prop: 'treatment', minWidth: 180 },
   { label: 'Doctor Assigned', prop: 'doctorAssigned', minWidth: 180 },
   { label: 'Room', prop: 'room', minWidth: 130 },
   { label: 'Status', prop: 'status', useSlot: true, minWidth: 130 },
 ];

const handleAddPatient = () => {
  ElMessage.info('Add Patient functionality coming soon!');
};

const handleGoDetail = (row: PatientResponse) => {
  router.push({
    name: 'PatientDetail',
    params: { id: row.id.toString() },
  });
};
</script>

<template>
  <div class="h-full flex flex-col">
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnSearchBar
          v-slot:default
          v-model="searchForm"
          :items="leftSearchItems"
          search-bar-background="white"
          @change="handleSearch"
        />
      </template>
      <template #right>
        <div class="flex items-center gap-4">
          <WnSearchBar
            v-model="searchForm"
            :items="rightSearchItems"
            search-bar-background="soft"
            @keyup.enter="handleSearch"
          />
          <!-- 添加按钮 -->
          <WnButton
            mode="add"
            label="Add Patient"
            @click="handleAddPatient"
          />
        </div>
      </template>
    </WnTableHeader>

    <!-- 表格内容 -->
    <div class="flex-1 min-h-0">
      <WnTable
        ref="tableRef"
        :loading="tableLoading"
        :data="tableData"
        :columns="columns"
        header-theme="soft"
        :pagination="pagination"
        :stripe="true"
        :showHeaderBorder="false"
        pagination-background="gray"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <!-- 姓名列插槽 -->
        <template #name="{ row }">
          <div
            class="flex items-center gap-3 cursor-pointer group"
            @click="handleGoDetail(row)"
          >
            <ElAvatar
              :src="row.avatar"
              :size="36"
              class="border border-slate-100 group-hover:border-primary-300 transition-colors duration-300"
            />
            <span class="font-medium font-inter">{{ row.name || row.nickName }}</span>
          </div>
        </template>

        <!-- 状态列插槽 -->
        <template #status="{ value }">
          <div
            class="inline-flex items-center px-2 py-0.5 rounded-lg border transition-all duration-300"
            :class="getStatusClass(value === 1 ? 'Active' : (value === 0 ? 'Inactive' : 'New Patient'), 'patient')"
          >
            {{ value === 1 ? 'Active' : (value === 0 ? 'Inactive' : 'New Patient') }}
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>
