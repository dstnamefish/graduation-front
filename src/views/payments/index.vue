<!-- 账单与支付页面 -->
<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 统计卡片组件 -->
    <PaymentStats class="shrink-0" />

    <!-- 搜索与筛选栏 -->
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnSearchBarInline
          v-model="searchForm"
          :items="filterItems"
          search-bar-background="gray"
        />
      </template>
      <template #right>
        <WnButton
          type="primary"
          @click="handleCreateInvoice"
          mode="add"
        >
          Add Invoice
        </WnButton>
      </template>
    </WnTableHeader>

    <!-- 表格内容 -->
    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
      <WnTable
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        :columns="columns"
        header-theme="soft"
        :pagination="pagination"
        :showHeaderBorder="false"
        pagination-background="gray"
        @pagination:size-change="handlePaginationChange('size', $event)"
        @pagination:current-change="handlePaginationChange('current', $event)"
      >
        <!-- 患者姓名插槽 -->
        <template #patientName="{ row }">
          <div class="flex items-center gap-3">
            <ElAvatar
              :src="row.patientAvatar"
              :size="32"
              class="border border-slate-100 shadow-sm"
            />
            <span class="font-semibold text-slate-800">{{ row.patientName }}</span>
          </div>
        </template>

        <!-- 状态列插槽 -->
        <template #status="{ value }">
          <div
            class="px-3 py-1 rounded-lg text-xs font-bold inline-block"
            :class="getStatusClass(value)"
          >
            {{ value }}
          </div>
        </template>

        <!-- 金额列插槽 -->
        <template #amount="{ value }">
          <span class="font-bold text-slate-800">{{ formatCurrency(value) }}</span>
        </template>

        <!-- 操作列插槽 -->
        <template #action>
          <div class="flex items-center gap-2"></div>
        </template>
      </WnTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h, watch } from 'vue';
import { ElAvatar } from 'element-plus';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnSearchBarInline, {
  type SearchFormItem,
} from '@/components/core/forms/Wn-search-bar/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import PaymentStats from './modules/PaymentStats.vue';
import { getMockPayments, type PaymentItem } from '@/mock/payments';
import { getStatusClass, formatCurrency } from '@/utils';

defineOptions({ name: 'Payments' });

const loading = ref(false);
const allData = ref<PaymentItem[]>([]);
const tableData = ref<PaymentItem[]>([]);

const searchForm = reactive({
  query: '',
  dateRange: [] as [Date, Date] | [],
  status: 'all',
  method: 'all',
});

// 筛选配置
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
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-common/search', size: 16 })]),
    },
  },
  {
    key: 'dateRange',
    type: 'daterange',
    props: {
      rangeSeparator: 'to',
      startPlaceholder: 'Start date',
      endPlaceholder: 'End date',
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: 'Status',
      options: [
        { label: 'Status', value: 'all' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Overdue', value: 'Overdue' },
      ],
      fitInputWidth: true,
    },
  },
]);

// 搜索配置
const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    props: {
      placeholder: 'Search invoice ID, patient...',
      style: { width: '280px' },
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-common/search', size: 16 })]),
    },
  },
]);

// 表格列配置
const columns = [
  { label: 'Invoice ID', prop: 'invoiceId', width: 120, align: 'center' },
  { label: 'Patient', prop: 'patientName', useSlot: true, minWidth: 200 },
  { label: 'Date', prop: 'date', width: 150 },
  { label: 'Amount', prop: 'amount', width: 150, align: 'right', useSlot: true },
  { label: 'Status', prop: 'status', useSlot: true, width: 120, align: 'center' },
  { label: 'Action', prop: 'action', useSlot: true, width: 120, align: 'center' },
];

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

const handleCreateInvoice = () => {
  console.log('Create Invoice Clicked');
};

const handlePaginationChange = (type: 'size' | 'current', val: number) => {
  pagination[type] = val;
  if (type === 'size') pagination.current = 1;
  applyFilters();
};

const applyFilters = () => {
  const { query, dateRange, status, method } = searchForm;
  const lowerQuery = query.toLowerCase();

  const filtered = allData.value.filter((p) => {
    let matchDate = true;
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const pDate = new Date(p.date).getTime();
      const start = new Date(dateRange[0]).getTime();
      const end = new Date(dateRange[1]).getTime() + 86400000 - 1; // Includes the whole end day
      matchDate = pDate >= start && pDate <= end;
    }

    return (
      matchDate &&
      (!status || status === 'all' || p.status === status) &&
      (!method || method === 'all' || p.method === method) &&
      (!query ||
        p.patientName.toLowerCase().includes(lowerQuery) ||
        p.invoiceId.toLowerCase().includes(lowerQuery))
    );
  });

  pagination.total = filtered.length;
  const start = (pagination.current - 1) * pagination.size;
  tableData.value = filtered.slice(start, start + pagination.size);
};

watch(
  () => [searchForm.query, searchForm.dateRange, searchForm.status, searchForm.method],
  () => {
    pagination.current = 1;
    applyFilters();
  },
);

onMounted(async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    allData.value = getMockPayments();
    applyFilters();
  } finally {
    loading.value = false;
  }
});
</script>
