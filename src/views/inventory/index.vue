<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElButton } from 'element-plus';
import type { ColumnOption } from '@/types/component/form';
import { getStatusClass, getStatusDotClass } from '@/utils';
import { fetchPage, fetchCategories } from '@/api/inventory';
import type { Inventory, InventoryQuery } from '@/types/api/inventory';
import type { ColumnConfig } from '@/components/core/forms/Wn-column-setting/index.vue';

defineOptions({ name: 'Inventory' });

const tableRef = ref();
const selectedRows = ref<Inventory[]>([]);
const { t, locale } = useI18n();
const categoryOptions = ref<{ label: string; value: number }[]>([]);
const categorySelectOptions = computed(() => [
  { label: t('inventory.filter.allCategories'), value: undefined },
  ...categoryOptions.value,
]);

const loadCategoryOptions = async () => {
  try {
    const categories = await fetchCategories();
    categoryOptions.value = categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  } catch (error) {
    console.error('Failed to load inventory categories', error);
    ElMessage.error('Unable to load inventory categories');
  }
};

onMounted(() => {
  void loadCategoryOptions();
});

watch(locale, () => {
  void loadCategoryOptions();
});

const apiFn = async (params: InventoryQuery) => {
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
      categoryId: undefined,
      availabilityStatus: '',
    },
    paginationKey: {
      current: 'pageNum',
      size: 'pageSize',
    },
    excludeParams: ['current', 'size'],
    immediate: true,
  },
});

const selectItems = computed(() => [
  {
    key: 'categoryId',
    type: 'select',
    props: {
      placeholder: t('inventory.filter.category'),
      options: categorySelectOptions.value,
      fitInputWidth: true,
    },
  },
  {
    key: 'availabilityStatus',
    type: 'select',
    props: {
      placeholder: t('inventory.filter.status'),
      options: [
        { label: t('inventory.filter.available'), value: 'Available' },
        { label: t('inventory.filter.low'), value: 'Low' },
        { label: t('inventory.filter.outOfStock'), value: 'Out of Stock' },
      ],
      fitInputWidth: true,
    },
  },
]);

const searchItems = computed(() => [
  {
    key: 'query',
    type: 'input',
    props: {
      placeholder: t('inventory.filter.searchPlaceholder'),
      style: { width: '320px' },
    },
  },
]);

watch(
  () => [searchModel.categoryId, searchModel.availabilityStatus],
  () => {
    void handleSearch();
  },
);

const baseColumns = computed<ColumnOption<Inventory>[]>(() => [
  { type: 'selection' as const, width: 60, align: 'center' },
  { label: t('inventory.table.image'), prop: 'image', width: 100, useSlot: true, align: 'center' },
  { label: t('inventory.table.item'), prop: 'name', minWidth: 180, sortable: true },
  { label: t('inventory.table.category'), prop: 'categoryName', minWidth: 160, sortable: true },
  { label: t('inventory.table.availability'), prop: 'availability', width: 180, useSlot: true, sortable: true },
  { label: t('inventory.table.qtyInStock'), prop: 'qtyInStock', minWidth: 150, sortable: true },
  { label: t('inventory.table.qtyInReorder'), prop: 'qtyInReorder', minWidth: 150, sortable: true },
  { label: t('inventory.table.action'), prop: 'action', minWidth: 180, useSlot: true },
]);

const columnSettings = ref<ColumnConfig[]>([]);

const initColumnSettings = () => {
  columnSettings.value = [
    { prop: 'image', label: t('inventory.table.image'), visible: true },
    { prop: 'name', label: t('inventory.table.item'), visible: true },
    { prop: 'categoryName', label: t('inventory.table.category'), visible: true },
    { prop: 'availability', label: t('inventory.table.availability'), visible: true },
    { prop: 'qtyInStock', label: t('inventory.table.qtyInStock'), visible: true },
    { prop: 'qtyInReorder', label: t('inventory.table.qtyInReorder'), visible: true },
    { prop: 'action', label: t('inventory.table.action'), visible: true },
  ];
};

initColumnSettings();

const columns = computed(() => {
  const visibleProps = new Set(
    columnSettings.value.filter((col) => col.visible).map((col) => col.prop),
  );
  const orderedProps = columnSettings.value.map((col) => col.prop);

  const selectionCol = baseColumns.value.find((col) => col.type === 'selection');
  const dataCols = orderedProps
    .filter((prop) => visibleProps.has(prop))
    .map((prop) => baseColumns.value.find((col) => col.prop === prop))
    .filter(Boolean) as ColumnOption<Inventory>[];

  return [selectionCol, ...dataCols] as ColumnOption<Inventory>[];
});

const handleColumnSettingsChange = (newSettings: ColumnConfig[]) => {
  columnSettings.value = newSettings;
};

const handleAddItem = () => {
  ElMessage.success('Add Item dialog opened');
};

const handleReorder = async (row: Inventory) => {
  ElMessage.success(`Reordered ${row.name} successfully`);
  handleSearch();
};

const handleSelectionChange = (selection: Inventory[]) => {
  selectedRows.value = selection;
};

const handleBatchReorder = async () => {
  if (selectedRows.value.length === 0) return;
  ElMessage.success(`Reordered ${selectedRows.value.length} item(s) successfully`);
  selectedRows.value = [];
  tableRef.value?.elTableRef?.clearSelection();
  handleSearch();
};

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return;
  ElMessage.success(`${selectedRows.value.length} item(s) have been deleted.`);
  selectedRows.value = [];
  tableRef.value?.elTableRef?.clearSelection();
  handleSearch();
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
            :column-config="columnSettings"
            search-bar-background="soft"
            @keyup.enter="handleSearch"
            @column-change="handleColumnSettingsChange"
          >
            <template #action>
              <WnButton
                mode="add"
                :label="t('inventory.addItem')"
                @click="handleAddItem"
              />
            </template>
          </WnSearchBar>

          <ElButton
            v-if="selectedRows.length > 0"
            type="primary"
            @click="handleBatchReorder"
          >
            {{ t('inventory.batchReorder') }} ({{ selectedRows.length }})
          </ElButton>

          <ElButton
            v-if="selectedRows.length > 0"
            type="danger"
            @click="handleBatchDelete"
          >
            {{ t('inventory.batchDelete') }} ({{ selectedRows.length }})
          </ElButton>
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

        <template #availability="{ row, value }">
          <div
            class="inline-flex items-center gap-2 px-1.5 py-0.5 rounded-lg border"
            :class="getStatusClass(row.availabilityCode as string, 'inventory')"
          >
            <span
              class="w-3 h-3 rounded-[2px]"
              :class="getStatusDotClass(row.availabilityCode as string, 'inventory')"
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
                icon="local-actions/view"
                :size="18"
              />
            </button>
            <button
              class="px-2 py-0.5 c-p bg-action-bg hover:bg-action-hover active:bg-action-active border border-action-border text-action-text hover:text-action-text-hover active:text-action-text-active rounded-lg transition-all active:scale-95"
              @click="handleReorder(row)"
            >
              {{ t('inventory.reorder') }}
            </button>
          </div>
        </template>
      </WnTable>
    </div>
  </div>
</template>
