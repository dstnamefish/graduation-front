<template>
  <div class="h-full flex flex-col overflow-hidden">
    <PaymentStats class="shrink-0" />

    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnSearchBar
          v-model="searchModel"
          :items="filterItems"
          search-bar-background="gray"
        />
      </template>
      <template #right>
        <WnButton
          type="primary"
          mode="add"
          @click="handleCreateInvoice"
        >
          Add Invoice
        </WnButton>
      </template>
    </WnTableHeader>

    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
      <WnTable
        ref="tableRef"
        row-key="id"
        :loading="loading"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        header-theme="soft"
        header-radius="12px"
        :showHeaderBorder="false"
        pagination-background="gray"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #treatment="{ row }">
          <div class="flex flex-col py-1">
            <span>{{ row.treatment }}</span>
            <div class="flex items-center gap-1 mt-0.5 opacity-60">
              <WnSvgIcon
                icon="local-business/departments"
                :size="14"
              />
              <span class="text-[11px]">{{ row.department }}</span>
            </div>
          </div>
        </template>

        <template #statusText="{ row }">
          <div
            class="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded-lg border transition-all"
            :class="getStatusClass(row.statusText, 'payment')"
          >
            <WnSvgIcon
              v-if="row.statusText === 'Paid'"
              icon="local-status/verified"
              :size="16"
            />
            <WnSvgIcon
              v-else
              icon="local-status/loading"
              :size="16"
            />
            {{ row.statusText }}
          </div>
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-3">
            <button class="flex items-center gap-1.5 hover:text-slate-800 transition-colors group">
              <WnSvgIcon
                icon="local-actions/view"
                :size="18"
                class="group-hover:scale-110 transition-transform"
              />
              View
            </button>
            <div class="w-px h-3 bg-slate-200" />
            <button class="flex items-center gap-1.5 hover:text-slate-800 transition-colors group">
              <WnSvgIcon
                icon="local-actions/edit"
                :size="18"
                class="group-hover:scale-110 transition-transform"
              />
              Edit
            </button>
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { ElMessage } from 'element-plus';
import PaymentStats from './modules/PaymentStats.vue';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import { getStatusClass } from '@/utils';
import { useTable } from '@/hooks/core/useTable';
import { fetchPage } from '@/api/payment';
import type { Invoice, InvoiceQuery } from '@/types/payment';

defineOptions({ name: 'Payments' });

const tableRef = ref();

const apiFn = async (params: InvoiceQuery) => {
  const response = await fetchPage(params);
  return {
    records: response.records,
    total: response.total,
    current: response.current,
    size: response.size,
  };
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
    apiParams: {
      query: '',
      dateRange: '',
      paymentStatus: undefined,
    },
    paginationKey: {
      current: 'pageNum',
      size: 'pageSize',
    },
    excludeParams: ['current', 'size'],
    immediate: true,
  },
});

const filterItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    props: {
      placeholder: 'Search name,treatment,etc',
      style: { width: '280px' },
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-actions/search', size: 16 })]),
    },
  },
  {
    key: 'dateRange',
    type: 'shadcn-daterange',
    placeholder: 'Pick a date',
  },
  {
    key: 'paymentStatus',
    type: 'select',
    props: {
      placeholder: 'Status',
      options: [
        { label: 'Status', value: undefined },
        { label: 'Pending', value: 1 },
        { label: 'Paid', value: 2 },
        { label: 'Overdue', value: 3 },
      ],
      fitInputWidth: true,
    },
  },
]);

const columns = [
  { label: 'Invoice ID', prop: 'invoiceId', minWidth: 150, sortable: true },
  { label: 'Patient Name', prop: 'patientName', minWidth: 150, sortable: true },
  { label: 'Treatment', prop: 'treatment', useSlot: true, minWidth: 200, sortable: true },
  { label: 'Date', prop: 'date', minWidth: 160, sortable: true },
  { label: 'Amount', prop: 'amount', minWidth: 120, sortable: true },
  { label: 'Status', prop: 'statusText', useSlot: true, minWidth: 140, sortable: true },
  { label: 'Action', prop: 'action', useSlot: true, minWidth: 160 },
];

const handleCreateInvoice = () => {
  ElMessage.success('Create Invoice dialog opened');
};
</script>
