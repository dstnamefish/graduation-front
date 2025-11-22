<template>
  <ZenTable
    ref="tableRef"
    :loading="loading"
    :pagination="pagination"
    :data="data"
    :columns="columns"
    :height="computedTableHeight"
    emptyHeight="360px"
  />
</template>

<script setup lang="ts">
import { fetchDoctorList } from '@/api/business/doctors';
import { useTable } from '@/hooks/core/useTable';
import { $t } from '@/locales';
import type { ColumnOption } from '@/types/component';

defineOptions({ name:'Doctor' });

const tableRef = ref();

const tableConfig = ref({
  fixedHeight: false, // 是否固定高度的开关
  height: '100%',
});

const computedTableHeight = computed(() => {
  return tableConfig.value.fixedHeight ? '450px' : '';
});


const columns: ColumnOption[] = [
  {
    label: $t('doctor.table.name'),
    prop: 'id',
  },
  {
    label: $t('doctor.table.id'),
    prop: 'name',
  },
  {
    label: $t('doctor.table.department'),
    prop: 'department',
  },
  {
    label: $t('doctor.table.specialist'),
    prop: 'title',
  },
  {
    label: $t('doctor.table.totalPatients'),
    prop: 'totalPatients',
  },
  {
    label: $t('doctor.table.todaysAppointment'),
    prop: 'todayAppointments',
  },
  {
    label: $t('doctor.table.availabilityStatus'),
    prop: 'status',
  },
  {
    fixed: 'right',
    label: $t('doctor.table.action'),
    slotName: 'action',
    useSlot: true,
    width: 150,
  },
];

const { data, loading, pagination } = useTable({
  core: {
    apiFn: async (params) => {
      return fetchDoctorList(params);
    },
    immediate: true,
  },
  performance: {
    debounceTime: 300,
    enableCache: false,
  },
});

</script>