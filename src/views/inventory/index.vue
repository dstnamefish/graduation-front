<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox, ElButton } from 'element-plus';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { getMockInventory, type InventoryItem } from '@/mock/inventory';
import { getStatusClass, getStatusDotClass } from '@/utils';
import { useTable } from '@/hooks/core/useTable';
import type { ColumnOption } from '@/types';

defineOptions({ name: 'Inventory' });

const tableRef = ref();
const selectedRows = ref<InventoryItem[]>([]);

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
const selectItems = computed<SearchFormItem[]>(() => [
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
]);

const searchItems = computed<SearchFormItem[]>(() => [
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
  { label: 'Item', prop: 'name', minWidth: 180, sortable: true },
  { label: 'Category', prop: 'category', minWidth: 160, sortable: true },
  { label: 'Availability', prop: 'availability', width: 180, useSlot: true, sortable: true },
  { label: 'Qty In Stock', prop: 'stock', minWidth: 150, sortable: true },
  { label: 'Qty In Reorder', prop: 'reorder', minWidth: 150, sortable: true },
  { label: 'Action', prop: 'action', minWidth: 180, useSlot: true }, // 修正了 MinWidth 为 minWidth
];

const handleAddItem = () => {
  ElMessage.success('Add Item dialog opened');
};

const handleReorder = (row: InventoryItem) => {
  ElMessage.info(`Reordering ${row.name}`);
};

const handleSelectionChange = (selection: InventoryItem[]) => {
  selectedRows.value = selection;
  console.log('选中的库存项:', selection);
};

const handleBatchReorder = () => {
  if (selectedRows.value.length === 0) return;
  ElMessage.success(`Reordering ${selectedRows.value.length} item(s)...`);
  selectedRows.value = [];
  // [!code ++] 清空 UI 层的表格勾选状态
  tableRef.value?.elTableRef?.clearSelection();
};

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return;

  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedRows.value.length} item(s)?`,
      'Confirm Deletion',
      {
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        confirmButtonText: 'Yes, delete them',
        cancelButtonText: 'No, keep them',
      },
    );
    ElMessage.success(`${selectedRows.value.length} item(s) have been deleted.`);
    selectedRows.value = [];
    // [!code ++] 清空 UI 层的表格勾选状态
    tableRef.value?.elTableRef?.clearSelection();
  } catch {}
};
</script>

<template>
  <div class="h-full flex flex-col">
    <WnTableHeader class="shrink-0 pb-6">
      <template #left>
        <WnSearchBar
          v-model="searchModel"
          :items="selectItems"
          search-bar-background="gray"
          @keyup.enter="handleSearch"
        />
      </template>

      <template #right>
        <div class="flex items-center gap-4">
          <WnSearchBar
            v-model="searchModel"
            :items="searchItems"
            search-bar-background="soft"
            @keyup.enter="handleSearch"
          />

          <ElButton
            v-if="selectedRows.length > 0"
            type="primary"
            @click="handleBatchReorder"
          >
            Batch Reorder ({{ selectedRows.length }})
          </ElButton>

          <ElButton
            v-if="selectedRows.length > 0"
            type="danger"
            @click="handleBatchDelete"
          >
            Batch Delete ({{ selectedRows.length }})
          </ElButton>

          <div
            class="w-9 h-9 flex-cc cursor-pointer bg-accent rounded-xl hover:opacity-80 transition-opacity"
            title="Table Settings"
          >
            <WnSvgIcon
              icon="local-table/slider"
              :size="20"
              class="text-muted"
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

    <div class="flex-1 min-h-0">
      <WnTable
        ref="tableRef"
        row-key="id"
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
        @selection-change="handleSelectionChange"
      >
        <template #image="{ row }">
          <div class="flex items-center justify-center p-2">
            <div
              class="w-12 h-12 rounded-xl bg-surface border border-action-border flex-cc overflow-hidden shadow-sm p-2"
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

        <template #availability="{ value }">
          <div
            class="inline-flex items-center gap-2 px-1.5 py-0.5 rounded-lg border"
            :class="getStatusClass(value as string, 'inventory')"
          >
            <span
              class="w-3 h-3 rounded-[2px]"
              :class="getStatusDotClass(value as string, 'inventory')"
            ></span>
            {{ value }}
          </div>
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="w-7 h-7 flex-cc c-p rounded-lg border border-action-border hover:bg-action-hover active:bg-action-active text-action-text hover:text-action-text-hover transition-all active:scale-95"
            >
              <WnSvgIcon
                icon="local-table/view"
                :size="18"
              />
            </button>
            <button
              class="px-2 py-0.5 c-p bg-action-bg hover:bg-action-hover active:bg-action-active border border-action-border text-action-text hover:text-action-text-hover active:text-action-text-active rounded-lg transition-all active:scale-95"
              @click="handleReorder(row)"
            >
              Reorder
            </button>
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>
