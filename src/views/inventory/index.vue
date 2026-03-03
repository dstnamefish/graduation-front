<!-- 库存管理页面 -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import WnSearchBarInline, {
  type SearchFormItem,
} from '@/components/core/forms/Wn-search-bar/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { getMockInventory, type InventoryItem } from '@/mock/inventory';
import { getStatusClass, getStatusDotClass } from '@/utils';
import { useTable } from '@/hooks/core/useTable';
import type { ColumnOption } from '@/types';

defineOptions({ name: 'Inventory' });

const tableRef = ref();

/**
 * 模拟后端 API 请求
 */
const mockApiFn = async (params: any) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const allMockData = getMockInventory();
  const { query, category, status, current, size } = params;
  const lowerQuery = (query || '').toLowerCase();

  const filtered = allMockData.filter(
    (item) =>
      (!category || item.category === category) &&
      (!status || item.availability === status) &&
      (!query ||
        item.name.toLowerCase().includes(lowerQuery) ||
        item.itemCode.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)),
  );

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
  searchParams: searchModel,
  handleCurrentChange,
  handleSizeChange,
  getData: handleSearch,
} = useTable({
  core: {
    apiFn: mockApiFn,
    apiParams: {
      query: '',
      category: '',
      status: '',
    },
    immediate: true,
  },
});

// 搜索项配置 - 现在使用 icon 属性简化
const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'category',
    type: 'select',
    props: {
      placeholder: 'All Category',
      options: categories.value.map((c) => ({ label: c, value: c })),
      style: { width: '160px' },
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
  },
  {
    key: 'query',
    type: 'input',
    icon: 'local-common/search',
    props: {
      placeholder: 'Search item, etc',
      style: { width: '320px' },
    },
  },
]);

const categories = computed(() => {
  return [...new Set(getMockInventory().map((item) => item.category))];
});

// 表格列配置
const columns: ColumnOption[] = [
  { type: 'selection' as const, width: 60, align: 'center' },
  { label: 'Image', prop: 'image', width: 100, useSlot: true, align: 'center' },
  { label: 'Item', prop: 'item', minWidth: 220, useSlot: true, sortable: true },
  { label: 'Category', prop: 'category', minWidth: 160, sortable: true },
  { label: 'Availability', prop: 'availability', width: 180, useSlot: true, sortable: true },
  { label: 'Qty In Stock', prop: 'stock', minWidth: 150, sortable: true },
  { label: 'Qty In Reorder', prop: 'reorder', minWidth: 150, sortable: true },
  { label: 'Action', prop: 'action', width: 180, useSlot: true },
];

const handleAddItem = () => {
  ElMessage.success('Add Item dialog opened');
};

const handleReorder = (row: InventoryItem) => {
  ElMessage.info(`Reordering ${row.name}`);
};
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 表头 -->
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnSearchBarInline
          v-model="searchModel"
          :items="searchItems"
          search-bar-background="gray"
          @keyup.enter="handleSearch"
        />
      </template>

      <template #right>
        <div class="flex items-center gap-4">
          <div
            class="w-9 h-9 flex-cc cursor-pointer bg-accent rounded-xl hover:opacity-80 transition-opacity"
            title="Table Settings"
          >
            <WnSvgIcon
              icon="local-table/slider"
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
        :show-header-border="false"
        pagination-background="gray"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
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

        <!-- 状态/库存状态插槽 - 使用 getStatusDotClass 简化 -->
        <template #availability="{ value }">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium"
            :class="getStatusClass(value as string)"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="getStatusDotClass(value as string)"
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
