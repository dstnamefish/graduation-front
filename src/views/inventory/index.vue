<!-- 库存管理页面 -->
<template>
  <div class="h-full flex flex-col">
    <!-- 表头 -->
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnSearchBarInline
          v-model="searchModel"
          :items="searchItems"
          background-theme="gray"
          @keyup.enter="handleSearch"
        />
      </template>

      <template #right>
        <div class="flex items-center gap-4">
          <div
            class="w-11 h-11 rounded-xl bg-white border border-slate-100 flex-cc cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
          >
            <WnSvgIcon
              icon="solar:settings-linear"
              :size="20"
              class="text-slate-500"
            />
          </div>
          <WnButton
            mode="add"
            label="Add Item"
            @click="handleAddItem"
          />
        </div>
      </template>
    </WnTableHeader>

    <!-- 表格内容 -->
    <div class="flex-1 min-h-0">
      <WnTable
        ref="tableRef"
        :loading="loading"
        :pagination="pagination"
        :data="tableData"
        :columns="columns"
        header-theme="white"
        :border="true"
        background-theme="gray"
        @pagination:size-change="handlePaginationChange('size', $event)"
        @pagination:current-change="handlePaginationChange('current', $event)"
      >
        <!-- 图片插槽 -->
        <template #image="{ row }">
          <div class="flex items-center justify-center p-2">
            <div
              class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex-cc overflow-hidden shadow-sm p-2"
            >
              <img
                v-if="row.image"
                :src="row.image"
                class="w-full h-full object-contain"
              />
              <WnSvgIcon
                v-else
                icon="solar:box-minimalistic-bold"
                :size="24"
                class="text-slate-300"
              />
            </div>
          </div>
        </template>

        <!-- Item 栏插槽 -->
        <template #item="{ row }">
          <div class="flex flex-col py-1">
            <span class="font-semibold text-slate-800">{{ row.name }}</span>
            <span class="text-xs text-slate-400">{{ row.itemCode }}</span>
          </div>
        </template>

        <!-- 状态/库存状态插槽 -->
        <template #availability="{ value }">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium"
            :class="statusClassMap[value as keyof typeof statusClassMap]"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="statusDotMap[value as keyof typeof statusDotMap]"
            ></span>
            {{ value }}
          </div>
        </template>

        <!-- 操作插槽 -->
        <template #action="{ row }">
          <div class="flex items-center gap-3">
            <button
              class="w-9 h-9 flex-cc rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              title="View details"
            >
              <WnSvgIcon
                icon="solar:eye-bold"
                :size="18"
              />
            </button>
            <el-button
              size="small"
              class="rounded-lg! font-semibold"
              @click="handleReorder(row)"
            >
              Reorder
            </el-button>
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h, watch } from 'vue';
import WnSearchBarInline, {
  type SearchFormItem,
} from '@/components/core/forms/Wn-search-bar/index.vue';
import { getMockInventory, type InventoryItem } from '@/mock/inventory';
import type { ColumnOption } from '@/types';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { ElMessage } from 'element-plus';

defineOptions({ name: 'Inventory' });

const tableRef = ref();
const loading = ref(false);

const searchModel = reactive({
  query: '',
  category: '',
  status: '',
});

const statusClassMap = {
  'Available': 'bg-teal-50/50 border-teal-100 text-teal-600',
  'Low': 'bg-orange-50/50 border-orange-100 text-orange-600',
  'Out of Stock': 'bg-slate-100/50 border-slate-200 text-slate-500',
};

const statusDotMap = {
  'Available': 'bg-teal-500',
  'Low': 'bg-orange-500',
  'Out of Stock': 'bg-slate-400',
};

// Search Items configuration
const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'category',
    type: 'select',
    props: {
      placeholder: 'All Category',
      options: categories.value.map((c) => ({ label: c, value: c })),
      style: { width: '160px' },
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-table/filter', size: 16 })]),
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: 'All Status',
      options: [
        { label: 'Available', value: 'Available' },
        { label: 'Low', value: 'Low' },
        { label: 'Out of Stock', value: 'Out of Stock' },
      ],
      style: { width: '160px' },
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-table/filter', size: 16 })]),
    },
  },
  {
    key: 'query',
    type: 'input',
    props: {
      placeholder: 'Search item, etc',
      style: { width: '320px' },
    },
    slots: {
      prefix: () =>
        h('div', { class: 'flex-cc' }, [h(WnSvgIcon, { icon: 'local-common/search', size: 18 })]),
    },
  },
]);

// Table Data State
const allData = ref<InventoryItem[]>([]);
const tableData = ref<InventoryItem[]>([]);
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

const categories = computed(() => [...new Set(allData.value.map((item) => item.category))]);

// Columns Configuration
const columns: ColumnOption[] = [
  { type: 'selection', width: 60, align: 'center' },
  { label: 'Image', prop: 'image', width: 100, useSlot: true, align: 'center' },
  { label: 'Item', prop: 'item', minWidth: 220, useSlot: true, sortable: true },
  { label: 'Category', prop: 'category', minWidth: 160, sortable: true },
  { label: 'Availability', prop: 'availability', width: 180, useSlot: true, sortable: true },
  { label: 'Qty In Stock', prop: 'stock', minWidth: 150, sortable: true, align: 'center' },
  { label: 'Qty In Reorder', prop: 'reorder', minWidth: 150, sortable: true, align: 'center' },
  { label: 'Action', prop: 'action', width: 180, useSlot: true, align: 'center' },
];

const fetchData = async () => {
  loading.value = true;
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  try {
    const data = getMockInventory();
    allData.value = data;
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  const { query, category, status } = searchModel;
  const lowerQuery = query.toLowerCase();

  const filtered = allData.value.filter(
    (item) =>
      (!category || item.category === category) &&
      (!status || item.availability === status) &&
      (!query ||
        item.name.toLowerCase().includes(lowerQuery) ||
        item.itemCode.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)),
  );

  pagination.total = filtered.length;
  const start = (pagination.current - 1) * pagination.size;
  tableData.value = filtered.slice(start, start + pagination.size);
};

const handleSearch = () => {
  pagination.current = 1;
  applyFilters();
};

const handlePaginationChange = (type: 'size' | 'current', val: number) => {
  if (type === 'size') {
    pagination.size = val;
    pagination.current = 1;
  } else {
    pagination.current = val;
  }
  applyFilters();
};

// 监听搜索条件变化
watch(
  () => [searchModel.category, searchModel.status, searchModel.query],
  () => {
    handleSearch();
  },
  { deep: false },
);

const handleAddItem = () => {
  ElMessage.success('Add Item dialog opened');
};

const handleReorder = (row: InventoryItem) => {
  ElMessage.info(`Reordering ${row.name}`);
};

onMounted(() => {
  fetchData();
});
</script>
