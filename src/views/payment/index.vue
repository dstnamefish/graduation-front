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
          {{ t('payments.addInvoice') }}
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
              {{ t('payments.view') }}
            </button>
            <div class="w-px h-3 bg-slate-200" />
            <button class="flex items-center gap-1.5 hover:text-slate-800 transition-colors group">
              <WnSvgIcon
                icon="local-actions/edit"
                :size="18"
                class="group-hover:scale-110 transition-transform"
              />
              {{ t('payments.edit') }}
            </button>
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();

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
      placeholder: t('payments.filter.searchPlaceholder'),
      style: { width: '280px' },
    },
  },
  {
    key: 'dateRange',
    type: 'shadcn-daterange',
    placeholder: t('payments.filter.pickDate'),
  },
  {
    key: 'paymentStatus',
    type: 'select',
    props: {
      placeholder: t('payments.filter.status'),
      options: [
        { label: t('payments.filter.status'), value: undefined },
        { label: t('payments.filter.pending'), value: 1 },
        { label: t('payments.filter.paid'), value: 2 },
        { label: t('payments.filter.overdue'), value: 3 },
      ],
      fitInputWidth: true,
    },
  },
]);

const columns = computed(() => [
  { label: t('payments.table.invoiceId'), prop: 'invoiceId', minWidth: 150, sortable: true },
  { label: t('payments.table.patientName'), prop: 'patientName', minWidth: 150, sortable: true },
  { label: t('payments.table.treatment'), prop: 'treatment', useSlot: true, minWidth: 200, sortable: true },
  { label: t('payments.table.date'), prop: 'date', minWidth: 160, sortable: true },
  { label: t('payments.table.amount'), prop: 'amount', minWidth: 120, sortable: true },
  { label: t('payments.table.status'), prop: 'statusText', useSlot: true, minWidth: 140, sortable: true },
  { label: t('payments.table.action'), prop: 'action', useSlot: true, minWidth: 160 },
]);

const handleCreateInvoice = () => {
  ElMessage.success('Create Invoice dialog opened');
};
</script>
