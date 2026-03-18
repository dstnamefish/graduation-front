<script setup lang="ts">
import { ref, computed, h, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ElAvatar, ElMessage } from 'element-plus';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import { getStatusClass } from '@/utils';
import { formatDate } from '@/utils/format/date';
import { useTable } from '@/hooks/core/useTable';
import * as PatientApi from '@/api/patient';
import * as departmentApi from '@/api/department';
import { resolveLocalizedText } from '@/utils/i18n';

defineOptions({ name: 'PatientsList' });

const router = useRouter();
const tableRef = ref();
const { locale } = useI18n();
const treatmentOptions = ref<{ label: string; value: string }[]>([]);
const treatmentSelectOptions = computed(() => [
  { label: 'All Treatments', value: undefined },
  ...treatmentOptions.value,
]);

const loadTreatmentOptions = async () => {
  try {
    const departments = await departmentApi.fetchList({ status: 1 });
    const uniqueList: { label: string; value: string }[] = [];
    const seen = new Set<string>();
    departments.forEach((dept: any) => {
      const label = resolveLocalizedText(dept.name, locale.value);
      if (dept?.name && !seen.has(label)) {
        seen.add(label);
        uniqueList.push({ label, value: dept.name });
      }
    });
    treatmentOptions.value = uniqueList;
  } catch (error) {
    console.error('Failed to load treatment options', error);
    ElMessage.error('Unable to load treatment options');
  }
};

onMounted(() => {
  loadTreatmentOptions();
});

watch(locale, () => {
  loadTreatmentOptions();
});

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
    apiFn: async (params: any) => {
      try {
        const normalizedParams = {
          ...params,
          status: params.status === '' ? undefined : params.status,
          treatment: params.treatment === '' ? undefined : params.treatment,
        };
        const response = await PatientApi.fetchPage(normalizedParams);
        return {
          data: response.records,
          total: response.total,
          current: response.current,
          size: response.size,
        };
      } catch (error) {
        ElMessage.error('Failed to fetch patients list');
        console.error('Error fetching patients:', error);
        return {
          data: [],
          total: 0,
          current: 1,
          size: 10,
        };
      }
    },
    apiParams: {
      query: '',
      status: undefined,
      treatment: undefined,
    },
    paginationKey: {
      current: 'pageNum',
      size: 'pageSize',
    },
    immediate: true,
  },
});

const patientStatusOptions = [
  { label: 'Active', value: 1 },
  { label: 'New Patient', value: 2 },
  { label: 'Inactive', value: 0 },
];

const getPatientStatusLabel = (status: number): string => {
  const statusMap: Record<number, string> = {
    1: 'Active',
    2: 'New Patient',
    0: 'Inactive',
  };
  return statusMap[status] || 'Unknown';
};

const leftSearchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'treatment',
    type: 'select',
    props: {
      placeholder: 'All Treatments',
      options: treatmentSelectOptions.value,
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: 'All Status',
      options: [
        { label: 'All Status', value: undefined },
        ...patientStatusOptions,
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
  },
]);

const columns = [
   { label: 'Name', prop: 'name', useSlot: true, minWidth: 120 },
   { label: 'ID', prop: 'patientNo', minWidth: 90 },
   { label: 'Age', prop: 'age', minWidth: 90 },
   { label: 'Check In', prop: 'checkInTime', useSlot: true, minWidth: 150 },
   { label: 'Treatment', prop: 'treatment', minWidth: 180 },
   { label: 'Doctor Assigned', prop: 'doctorAssigned', minWidth: 180 },
   { label: 'Room', prop: 'room', minWidth: 130 },
   { label: 'Status', prop: 'status', useSlot: true, minWidth: 130 },
 ];

const handleAddPatient = () => {
  ElMessage.info('Add Patient functionality coming soon!');
};

const handleGoDetail = (row: any) => {
  router.push({
    name: 'PatientDetails',
    params: { id: row.id.toString() },
  });
};

const handleStatusLegendClick = (value?: number) => {
  searchForm.status = value;
};

watch(
  () => [searchForm.status, searchForm.treatment],
  () => {
    void handleSearch();
  },
);
</script>

<template>
  <div class="h-full flex flex-col">
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
      <div class="flex flex-col gap-2">
        <WnSearchBar
          v-slot:default
          v-model="searchForm"
          :items="leftSearchItems"
          search-bar-background="white"
        />
      </div>
      </template>
      <template #right>
        <div class="flex items-center gap-4">
          <WnSearchBar
            v-model="searchForm"
            :items="rightSearchItems"
            search-bar-background="soft"
            @keyup.enter="handleSearch"
          />
          <WnButton
            mode="add"
            label="Add Patient"
            @click="handleAddPatient"
          />
        </div>
      </template>
    </WnTableHeader>

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

        <template #checkInTime="{ value }">
          <span v-if="value">{{ formatDate(value) }}</span>
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #status="{ value }">
          <div
            class="inline-flex items-center px-2 py-0.5 rounded-lg border transition-all duration-300"
            :class="getStatusClass(getPatientStatusLabel(value), 'patient')"
          >
            {{ getPatientStatusLabel(value) }}
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>
