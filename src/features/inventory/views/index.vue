<script setup lang="ts">
import { ElMessage, ElMessageBox, ElButton } from 'element-plus';
import type { ColumnOption } from '@/types';
import { inventoryService } from '@/features/inventory/api';

defineOptions({ name: 'Inventory' });

const tableRef = ref();
const selectedRows = ref<InventoryResponse[]>([]);
const categories = ref<string[]>([]);

// 真实 API 请求函数
const apiFn = async (params: GetInventoryParams & { current: number; size: number }) => {
  const { current, size, ...queryParams } = params;
  const response = await inventoryService.searchInventories(
    { page: current, pageSize: size },
    queryParams
  );
  return {
    records: response.records,
    total: response.total,
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
    apiFn,
    apiParams: {
      query: '',
      category: '',
      status: '',
      current: 1,
      size: 10,
    },
    immediate: true,
  },
});

// 搜索项配置
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

// 表格列配置
const columns: ColumnOption[] = [
  { type: 'selection' as const, width: 60, align: 'center' },
  { label: 'Image', prop: 'image', width: 100, useSlot: true, align: 'center' },
  { label: 'Item', prop: 'name', minWidth: 180, sortable: true },
  { label: 'Category', prop: 'category', minWidth: 160, sortable: true },
  { label: 'Availability', prop: 'availability', width: 180, useSlot: true, sortable: true },
  { label: 'Qty In Stock', prop: 'stock', minWidth: 150, sortable: true },
  { label: 'Qty In Reorder', prop: 'reorder', minWidth: 150, sortable: true },
  { label: 'Action', prop: 'action', minWidth: 180, useSlot: true },
];

// 获取分类列表
const fetchCategories = async () => {
  try {
    categories.value = await inventoryService.fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const handleAddItem = () => {
  ElMessage.success('Add Item dialog opened');
};

const handleReorder = async (row: InventoryResponse) => {
  try {
    await inventoryService.increaseStock(row.id, row.reorder || 0);
    ElMessage.success(`Reordered ${row.name} successfully`);
    handleSearch();
  } catch (error) {
    ElMessage.error(`Failed to reorder ${row.name}`);
  }
};

const handleSelectionChange = (selection: InventoryResponse[]) => {
  selectedRows.value = selection;
};

const handleBatchReorder = async () => {
  if (selectedRows.value.length === 0) return;
  
  try {
    const ids = selectedRows.value.map(row => row.id);
    await inventoryService.batchReorder(ids);
    ElMessage.success(`Reordered ${selectedRows.value.length} item(s) successfully`);
    selectedRows.value = [];
    tableRef.value?.elTableRef?.clearSelection();
    handleSearch();
  } catch (error) {
    ElMessage.error('Failed to batch reorder items');
  }
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
    
    const ids = selectedRows.value.map(row => row.id);
    await inventoryService.batchDelete(ids);
    ElMessage.success(`${selectedRows.value.length} item(s) have been deleted.`);
    selectedRows.value = [];
    tableRef.value?.elTableRef?.clearSelection();
    handleSearch();
  } catch {
    // 用户取消操作
  }
};

onMounted(() => {
  fetchCategories();
});
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
