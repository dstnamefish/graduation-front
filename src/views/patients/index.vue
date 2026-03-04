<!-- 患者列表页面 -->
<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { ElAvatar } from 'element-plus';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnSearchBarInline, {
  type SearchFormItem,
} from '@/components/core/forms/Wn-search-bar/index.vue';
import { getMockPatients } from '@/mock/patients';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import { getStatusClass } from '@/utils';
import { useTable } from '@/hooks/core/useTable';

defineOptions({ name: 'PatientsList' });

const tableRef = ref();

/**
 * 模拟后端 API 请求
 */
const mockApiFn = async (params: any) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const allMockData = getMockPatients();
  const { query, treatment, status, dateRange, current, size } = params;
  const lowerQuery = (query || '').toLowerCase();

  const filtered = allMockData.filter((p) => {
    // 处理日期筛选
    let dateMatch = true;
    if (dateRange && dateRange.length === 2) {
      const start = new Date(dateRange[0]).getTime();
      const end = new Date(dateRange[1]).getTime();
      const checkInDate = new Date(p.checkIn).getTime();
      dateMatch = checkInDate >= start && checkInDate <= end;
    }

    return (
      dateMatch &&
      (!treatment || treatment === 'all' || p.treatment === treatment) &&
      (!status || status === 'all' || p.status === status) &&
      (!query ||
        p.name.toLowerCase().includes(lowerQuery) ||
        p.patientId.toLowerCase().includes(lowerQuery) ||
        p.treatment.toLowerCase().includes(lowerQuery))
    );
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
  searchParams: searchForm,
  handleCurrentChange,
  handleSizeChange,
  getData: handleSearch,
} = useTable({
  core: {
    apiFn: mockApiFn,
    apiParams: {
      query: '',
      treatment: 'all',
      status: 'all',
      dateRange: [],
    },
    immediate: true,
  },
});

const leftSearchItems = computed<SearchFormItem[]>(() => [
    {
    key: 'dateRange',
    type: 'daterange',
    props: {
      rangeSeparator: 'to',
      startPlaceholder: 'Start date',
      endPlaceholder: 'End date',
      style: { width: '240px' },
    },
  },
  {
    key: 'treatment',
    type: 'select',
    props: {
      placeholder: 'All Treatment',
      options: [
        { label: 'All Treatment', value: 'all' },
        { label: 'Routine Check-Up', value: 'Routine Check-Up' },
        { label: 'Cardiac Consultation', value: 'Cardiac Consultation' },
        { label: 'Pediatric Check-Up', value: 'Pediatric Check-Up' },
      ],
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: 'All Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'Active' },
        { label: 'New Patient', value: 'New Patient' },
        { label: 'Inactive', value: 'Inactive' },
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
      placeholder: 'Search name, age, ID, etc',
      style: { width: '320px' },
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-common/search', size: 16 })]),
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
  console.log('Add Patient Clicked');
};
</script>

<template>
  <div class="h-full flex flex-col">
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnSearchBarInline
          v-model="searchForm"
          :items="leftSearchItems"
          search-bar-background="white"
        />
      </template>
      <template #right>
        <div class="flex items-center gap-4">
          <WnSearchBarInline
            v-model="searchForm"
            :items="rightSearchItems"
            search-bar-background="soft"
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
        v-loading="loading"
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
          <div class="flex items-center gap-3">
            <ElAvatar
              :src="row.avatar"
              :size="36"
              class="border border-slate-100 shadow-sm"
            />
            <span class="font-semibold text-slate-800 tracking-tight">{{ row.name }}</span>
          </div>
        </template>

        <!-- 状态列插槽 -->
        <template #status="{ value }">
          <div
            class="inline-flex items-center px-1.5 py-0.5 rounded-lg border transition-all duration-300"
            :class="getStatusClass(value, 'patient')"
          >
            {{ value }}
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>
