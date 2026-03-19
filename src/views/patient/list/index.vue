<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ElAvatar, ElMessage } from 'element-plus';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import type { ColumnConfig } from '@/components/core/forms/Wn-column-setting/index.vue';
import { getStatusClass } from '@/utils';
import { formatDate } from '@/utils/format/date';
import { useTable } from '@/hooks/core/useTable';
import * as PatientApi from '@/api/patient';
import * as departmentApi from '@/api/department';
import { resolveLocalizedText } from '@/utils/i18n';

defineOptions({ name: 'PatientsList' });

const router = useRouter();
const { t, locale } = useI18n();
const treatmentOptions = ref<{ label: string; value: string }[]>([]);
const treatmentSelectOptions = computed(() => [
  { label: t('patients.status.all'), value: '' },
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

const patientStatusOptions = computed(() => [
  { label: t('patients.status.inpatient'), value: 1 },
  { label: t('patients.status.outpatient'), value: 2 },
  { label: t('patients.status.discharged'), value: 0 },
]);

const getPatientStatusLabel = (status: number): string => {
  const statusMap: Record<number, string> = {
    1: t('patients.status.inpatient'),
    2: t('patients.status.outpatient'),
    0: t('patients.status.discharged'),
  };
  return statusMap[status] || 'Unknown';
};

const leftSearchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'dateRange',
    type: 'shadcn-daterange',
    placeholder: t('patients.dateRange.start'),
  },
  {
    key: 'treatment',
    type: 'select',
    props: {
      placeholder: t('patients.status.all'),
      options: treatmentSelectOptions.value,
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: t('patients.status.all'),
      options: [{ label: t('patients.status.all'), value: '' }, ...patientStatusOptions.value],
      fitInputWidth: true,
    },
  },
]);

const rightSearchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    props: {
      placeholder: t('patients.searchPlaceholder'),
      style: { width: '320px' },
    },
  },
]);

const baseColumns = computed(() => [
  { label: t('patients.table.patientName'), prop: 'name', useSlot: true, minWidth: 120 },
  { label: t('patients.table.patientId'), prop: 'patientNo', minWidth: 90 },
  { label: t('patients.table.age'), prop: 'age', minWidth: 90 },
  { label: t('patients.table.checkInTime'), prop: 'checkInTime', useSlot: true, minWidth: 150 },
  { label: t('patients.table.latestTreatment'), prop: 'treatment', minWidth: 180 },
  { label: t('patients.table.doctorName'), prop: 'doctorAssigned', minWidth: 180 },
  { label: t('patients.table.treatmentDate'), prop: 'room', minWidth: 130 },
  { label: t('patients.table.status'), prop: 'status', useSlot: true, minWidth: 130 },
]);

const columnSettings = ref<ColumnConfig[]>([]);

const initColumnSettings = () => {
  columnSettings.value = [
    { prop: 'name', label: t('patients.table.patientName'), visible: true },
    { prop: 'patientNo', label: t('patients.table.patientId'), visible: true },
    { prop: 'age', label: t('patients.table.age'), visible: true },
    { prop: 'checkInTime', label: t('patients.table.checkInTime'), visible: true },
    { prop: 'treatment', label: t('patients.table.latestTreatment'), visible: true },
    { prop: 'doctorAssigned', label: t('patients.table.doctorName'), visible: true },
    { prop: 'room', label: t('patients.table.treatmentDate'), visible: true },
    { prop: 'status', label: t('patients.table.status'), visible: true },
  ];
};

initColumnSettings();

const columns = computed(() => {
  const visibleProps = new Set(
    columnSettings.value.filter((col) => col.visible).map((col) => col.prop),
  );
  const orderedProps = columnSettings.value.map((col) => col.prop);

  return orderedProps
    .filter((prop) => visibleProps.has(prop))
    .map((prop) => baseColumns.value.find((col) => col.prop === prop))
    .filter(Boolean);
});

const handleColumnSettingsChange = (newSettings: ColumnConfig[]) => {
  columnSettings.value = newSettings;
};

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
            v-model="searchForm"
            :items="leftSearchItems"
            search-bar-background="white"
          />
        </div>
      </template>
      <template #right>
        <WnSearchBar
          v-model="searchForm"
          :items="rightSearchItems"
          :column-config="columnSettings"
          search-bar-background="soft"
          @keyup.enter="handleSearch"
          @column-change="handleColumnSettingsChange"
        >
          <template #action>
            <WnButton
              mode="add"
              :label="t('patients.addPatient')"
              @click="handleAddPatient"
            />
          </template>
        </WnSearchBar>
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
          <span
            v-else
            class="text-gray-400"
          >
            -
          </span>
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
