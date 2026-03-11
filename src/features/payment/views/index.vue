<!-- 账单与支付页面 -->
<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 统计卡片组件 -->
    <PaymentStats class="shrink-0" />

    <!-- 搜索与筛选栏 -->
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnSearchBar
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
        v-loading="tableLoading"
        :data="tableData"
        :columns="columns"
        header-theme="soft"
        header-radius="12px"
        :pagination="pagination"
        :showHeaderBorder="false"
        pagination-background="gray"
        @pagination:size-change="handlePaginationChange('size', $event)"
        @pagination:current-change="handlePaginationChange('current', $event)"
      >
        <!-- Treatment 插槽 -->
        <template #treatment="{ row }">
          <div class="flex flex-col py-1">
            <span>{{ row.treatment }}</span>
            <div class="flex items-center gap-1 mt-0.5 opacity-60">
              <WnSvgIcon
                icon="local-menu/departments"
                :size="14"
              />
              <span class="text-[11px]">{{ row.department }}</span>
            </div>
          </div>
        </template>

        <!-- 状态列插槽 -->
        <template #status="{ value }">
          <div
            class="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded-lg border transition-all"
            :class="getStatusClass(value, 'payment')"
          >
            <WnSvgIcon
              v-if="value === 'Paid'"
              icon="local-status/verified"
              :size="16"
            />
            <WnSvgIcon
              v-else
              icon="local-status/loading"
              :size="16"
            />
            {{ value }}
          </div>
        </template>

        <!-- 操作列插槽 -->
        <template #action="{ row }">
          <div class="flex items-center gap-3">
            <button class="flex items-center gap-1.5 hover:text-slate-800 transition-colors group">
              <WnSvgIcon
                icon="local-table/view"
                :size="18"
                class="group-hover:scale-110 transition-transform"
              />
              View
            </button>
            <div class="w-px h-3 bg-slate-200"></div>
            <button class="flex items-center gap-1.5 hover:text-slate-800 transition-colors group">
              <WnSvgIcon
                icon="local-common/edit"
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
import PaymentStats from './modules/PaymentStats.vue';
import { getMockPayments, type PaymentItem } from '@/mock/payments';

defineOptions({ name: 'Payments' });

const tableRef = ref();
const tableLoading = ref(false);
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
    type: 'shadcn-daterange',
    placeholder: 'Pick a date',
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
      ],
      fitInputWidth: true,
    },
  },
]);

// 表格列配置
const columns = [
  { label: 'Invoice ID', prop: 'invoiceId', minWidth: 150, sortable: true },
  { label: 'Patient Name', prop: 'patientName', minWidth: 150, sortable: true },
  { label: 'Treatment', prop: 'treatment', useSlot: true, minWidth: 200, sortable: true },
  { label: 'Date', prop: 'date', minWidth: 160, sortable: true },
  { label: 'Amount', prop: 'amount', minWidth: 120, sortable: true },
  { label: 'Status', prop: 'status', useSlot: true, minWidth: 140, sortable: true },
  { label: 'Action', prop: 'action', useSlot: true, minWidth: 160 },
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
      const end = new Date(dateRange[1]).getTime() + 86400000 - 1;
      matchDate = pDate >= start && pDate <= end;
    }

    return (
      matchDate &&
      (!status || status === 'all' || p.status === status) &&
      (!method || method === 'all' || p.method === method) &&
      (!query ||
        p.patientName.toLowerCase().includes(lowerQuery) ||
        p.invoiceId.toLowerCase().includes(lowerQuery) ||
        p.treatment.toLowerCase().includes(lowerQuery))
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
  tableLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    allData.value = getMockPayments();
    applyFilters();
  } finally {
    tableLoading.value = false;
  }
});
</script>
