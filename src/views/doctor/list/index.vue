<!-- 医生列表页面 -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getStatusClass } from '@/utils/ui/status';
import { resolveLocalizedText } from '@/utils/i18n';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import type { Doctor } from '@/types/api/doctor';
import type { ColumnOption } from '@/types/component';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import { useTable } from '@/hooks/core/useTable';
import * as doctorApi from '@/api/doctor';
import * as departmentApi from '@/api/department';

defineOptions({ name: 'Doctors' });

const router = useRouter();
const { t, locale } = useI18n();
const departmentOptions = ref<{label: string, value: any}[]>([]);
const specialtyOptions = ref<{label: string, value: any}[]>([]);

const loadMeta = async () => {
  try {
    const [depts, specialties] = await Promise.all([
      departmentApi.fetchList({}),
      doctorApi.getSpecialtyList()
    ]);

    departmentOptions.value = depts.map((d: any) => ({
      label: resolveLocalizedText(d.name, locale.value),
      value: d.id
    }));

    specialtyOptions.value = specialties.map(s => ({
      label: resolveLocalizedText(s.name, locale.value),
      value: s.id
    }));
  } catch (error) {
    console.error('Failed to load meta data', error);
  }
};

onMounted(() => {
  loadMeta();
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
      const requestParams = {
        ...params,
        status: params.status !== undefined && params.status !== '' ? Number(params.status) : undefined,
      };
      return doctorApi.getDoctorPage(requestParams);
    },
    apiParams: {
      query: '',
      departmentId: undefined,
      specialtyId: undefined,
      status: undefined,
    },
    paginationKey: {
      current: 'pageNum',
      size: 'pageSize',
    },
    immediate: true,
  },
});

watch(
  [
    () => searchModel.departmentId,
    () => searchModel.specialtyId,
    () => searchModel.status,
  ],
  () => {
    handleSearch();
  },
);

watch(locale, async () => {
  await loadMeta();
  handleSearch();
});

const doctorStatusOptions = computed(() => [
  { label: t('doctors.filter.available'), value: 1 },
  { label: t('doctors.filter.unavailable'), value: 0 },
]);

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    background: 'var(--color-field)',
    props: {
      placeholder: t('doctors.filter.placeholder'),
      style: { width: '320px' },
    },
  },
  {
    key: 'departmentId',
    type: 'select',
    props: {
      placeholder: t('doctors.filter.department'),
      options: [
        { label: t('doctors.filter.allDepartments'), value: undefined },
        ...departmentOptions.value
      ],
      fitInputWidth: true,
    },
  },
  {
    key: 'specialtyId',
    type: 'select',
    props: {
      placeholder: t('doctors.filter.specialist'),
      options: [
        { label: t('doctors.filter.allSpecialists'), value: undefined },
        ...specialtyOptions.value
      ],
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: t('doctors.filter.status'),
      options: [
        { label: t('doctors.filter.allStatus'), value: undefined },
        ...doctorStatusOptions.value,
      ],
      fitInputWidth: true,
    },
  },
]);

const columns = computed<ColumnOption[]>(() => [
  { label: t('doctors.table.name'), prop: 'name', minWidth: 180, useSlot: true, sortable: true },
  { label: t('doctors.table.id'), prop: 'doctorNo', minWidth: 140, sortable: true },
  { label: t('doctors.table.department'), prop: 'departmentName', minWidth: 160, sortable: true },
  { label: t('doctors.table.specialist'), prop: 'specialist', minWidth: 160, sortable: true },
  { label: t('doctors.table.totalPatients'), prop: 'totalPatients', minWidth: 140, sortable: true },
  { label: t('doctors.table.todaysAppointment'), prop: 'todayAppointments', minWidth: 160, sortable: true },
  {
    label: t('doctors.table.availabilityStatus'),
    prop: 'availabilityStatus',
    minWidth: 180,
    useSlot: true,
    sortable: true,
  },
  { label: t('doctors.table.action'), prop: 'action', minWidth: 120, useSlot: true },
]);

const handleAddDoctor = () => {
  ElMessage.success(t('doctors.addDoctor') + ' functionality coming soon!');
};

const handleGoDetail = (row: Doctor) => {
  router.push({
    name: 'DoctorDetails',
    params: { id: row.id.toString() },
  });
};

const handleEdit = (row: Doctor) => {
  ElMessage.info(`${t('doctors.editDoctor')}: ${row.name}`);
};

const handleDelete = async (row: Doctor) => {
  try {
    await ElMessageBox.confirm(t('doctors.confirmDelete', { name: row.name }), t('doctors.deleteDoctor'), {
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
      confirmButtonText: t('doctors.delete'),
    });
    await doctorApi.deleteDoctor(row.id);
    ElMessage.success(t('doctors.deleteSuccess', { name: row.name }));
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
          {{ t('doctors.addDoctor') }}
        </WnButton>
      </template>
    </WnTableHeader>

    <!-- 表格内容 -->
    <div
      class="px-6 flex-1 min-h-0 transition-opacity duration-500"
      :class="{ 'animate-fade-in': !loading }"
      :key="locale"
    >
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
            <span class="group-hover:text-primary-600 transition-colors duration-300">
              {{ row.name }}
            </span>
          </div>
        </template>

        <template #availabilityStatus="{ row }">
          <div
            class="inline-flex items-center px-3 py-1 rounded-lg border font-medium transition-all duration-300"
            :class="getStatusClass(row.status, 'doctor')"
          >
            {{ row.availabilityStatus }}
          </div>
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-2 text-title">
            <WnSvgIcon
              icon="lucide:edit"
              class="c-p hover:text-(--color-primary-500) active:text-(--color-primary-800) transition-colors"
              @click="handleEdit(row)"
            />
            <div class="w-[2px] h-4 bg-disabled-border"></div>
            <WnSvgIcon
              icon="mi:delete"
              class="c-p hover:text-(--color-danger-500) active:text-(--color-danger-600) transition-colors"
              @click="handleDelete(row)"
            />
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>
