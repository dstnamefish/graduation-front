<template>
  <div class="inventory-page">
    <!-- Header Section -->
    <WnTableHeader id="Wn-table-header">
      <template #left>
        <div class="flex items-center gap-3">
          <ElSelect
            v-model="filters.category"
            placeholder="All Category"
            clearable
            class="w-36"
            @change="handleFilter"
          >
            <ElOption
              label="All Category"
              value=""
            />
            <ElOption
              label="PPE"
              value="PPE"
            />
            <ElOption
              label="Sanitizer"
              value="Sanitizer"
            />
            <ElOption
              label="Medical Equipment"
              value="Medical Equipment"
            />
            <ElOption
              label="Medical Supplies"
              value="Medical Supplies"
            />
            <ElOption
              label="First Aid"
              value="First Aid"
            />
            <ElOption
              label="Surgical Instruments"
              value="Surgical Instruments"
            />
          </ElSelect>
          <ElSelect
            v-model="filters.status"
            placeholder="All Status"
            clearable
            class="w-32"
            @change="handleFilter"
          >
            <ElOption
              label="All Status"
              value=""
            />
            <ElOption
              label="Available"
              value="Available"
            />
            <ElOption
              label="Low"
              value="Low"
            />
            <ElOption
              label="Out of Stock"
              value="Out of Stock"
            />
          </ElSelect>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <ElInput
            v-model="searchQuery"
            placeholder="Search item, etc."
            prefix-icon="Search"
            class="w-48"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
          <ElButton
            type="primary"
            @click="handleAddItem"
          >
            <WnSvgIcon
              icon="solar:add-circle-bold"
              :size="16"
              class="mr-1"
            />
            Add Item
          </ElButton>
        </div>
      </template>
    </WnTableHeader>

    <!-- Table Section -->
    <WnTable
      ref="tableRef"
      :loading="loading"
      :pagination="pagination"
      :data="tableData"
      :columns="columns"
      @pagination:size-change="handleSizeChange"
      @pagination:current-change="handleCurrentChange"
    >
      <!-- Image Column -->
      <template #image="{ row }">
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-cc">
          <img
            v-if="row.image"
            :src="row.image"
            class="w-full h-full object-contain p-1"
          />
          <WnSvgIcon
            v-else
            icon="solar:box-bold"
            :size="24"
            class="text-gray-400"
          />
        </div>
      </template>

      <!-- Item Name Column -->
      <template #name="{ value }">
        <span class="font-medium text-secondary">{{ value }}</span>
      </template>

      <!-- Category Column -->
      <template #category="{ value }">
        <span class="text-gray-600">{{ value }}</span>
      </template>

      <!-- Availability Column -->
      <template #availability="{ value }">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'w-2 h-2 rounded-full',
              value === 'Available' ? 'bg-success' : value === 'Low' ? 'bg-warning' : 'bg-error',
            ]"
          />
          <span
            :class="[
              'text-sm',
              value === 'Available'
                ? 'text-success'
                : value === 'Low'
                  ? 'text-warning'
                  : 'text-error',
            ]"
          >
            {{ value }}
          </span>
        </div>
      </template>

      <!-- Qty in Stock Column -->
      <template #qtyInStock="{ value }">
        <span class="font-medium text-secondary">{{ value }}</span>
      </template>

      <!-- Qty to Reorder Column -->
      <template #qtyToReorder="{ value }">
        <span class="text-gray-600">{{ value }}</span>
      </template>

      <!-- Actions Column -->
      <template #action="{ row }">
        <div class="flex items-center gap-2">
          <ElButton
            type="primary"
            size="small"
            link
            @click="handleReorder(row)"
          >
            <WnSvgIcon
              icon="solar:refresh-bold"
              :size="14"
              class="mr-1"
            />
            Reorder
          </ElButton>
        </div>
      </template>
    </WnTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { inventoryService } from '@/api/services';
import type { ColumnOption } from '@/types/component';

defineOptions({ name: 'Inventory' });

// State
const tableRef = ref();
const loading = ref(false);
const searchQuery = ref('');

const filters = reactive({
  category: '',
  status: '',
});

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  availability: string;
  qtyInStock: number;
  qtyToReorder: number;
  image?: string;
}

const tableData = ref<InventoryItem[]>([]);

const pagination = reactive({
  current: 1,
  size: 12,
  total: 0,
});

// Columns based on the screenshot
const columns: ColumnOption[] = [
  { label: 'Image', prop: 'image', width: 80, useSlot: true },
  { label: 'Item', prop: 'name', minWidth: 180, useSlot: true },
  { label: 'Category', prop: 'category', minWidth: 160, useSlot: true },
  { label: 'Availability', prop: 'availability', width: 130, useSlot: true },
  { label: 'Qty in Stock', prop: 'qtyInStock', width: 120, useSlot: true, align: 'center' },
  { label: 'Qty to Reorder', prop: 'qtyToReorder', width: 130, useSlot: true, align: 'center' },
  { label: 'Action', prop: 'action', fixed: 'right', width: 120, useSlot: true },
];

// Methods
const fetchInventory = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.size,
      category: filters.category || undefined,
    };
    const res = await inventoryService.fetchInventory(params);
    tableData.value = (res.list || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category || 'Medical Supplies',
      availability: getAvailabilityStatus(item.quantity, item.minStock),
      qtyInStock: item.quantity || 0,
      qtyToReorder: item.minStock || 100,
      image: item.image,
    }));
    pagination.total = res.total || 0;
  } catch {
    // Use mock data on error
    tableData.value = getMockInventory();
    pagination.total = tableData.value.length;
  } finally {
    loading.value = false;
  }
};

const getAvailabilityStatus = (qty: number, minStock: number): string => {
  if (qty <= 0) {
    return 'Out of Stock';
  }
  if (qty <= minStock * 0.3) {
    return 'Low';
  }
  return 'Available';
};

const handleSearch = () => {
  pagination.current = 1;
  fetchInventory();
};

const handleFilter = () => {
  pagination.current = 1;
  fetchInventory();
};

const handleSizeChange = (size: number) => {
  pagination.size = size;
  pagination.current = 1;
  fetchInventory();
};

const handleCurrentChange = (page: number) => {
  pagination.current = page;
  fetchInventory();
};

const handleAddItem = () => {
  ElMessage.info('Add Item dialog would open here');
};

const handleReorder = (row: InventoryItem) => {
  ElMessage.success(`Reorder request sent for ${row.name}`);
};

// Mock data based on screenshot
const getMockInventory = (): InventoryItem[] => [
  {
    id: 1,
    name: 'Surgical Masks',
    category: 'PPE',
    availability: 'Available',
    qtyInStock: 500,
    qtyToReorder: 200,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913461.png',
  },
  {
    id: 2,
    name: 'Gloves',
    category: 'PPE',
    availability: 'Low',
    qtyInStock: 50,
    qtyToReorder: 150,
    image: 'https://cdn-icons-png.flaticon.com/512/3588/3588614.png',
  },
  {
    id: 3,
    name: 'Hand Sanitizer',
    category: 'Sanitizer',
    availability: 'Available',
    qtyInStock: 200,
    qtyToReorder: 100,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913499.png',
  },
  {
    id: 4,
    name: 'Thermometers',
    category: 'Medical Equipment',
    availability: 'Out of Stock',
    qtyInStock: 0,
    qtyToReorder: 300,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913423.png',
  },
  {
    id: 5,
    name: 'Stethoscopes',
    category: 'Medical Equipment',
    availability: 'Available',
    qtyInStock: 30,
    qtyToReorder: 50,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913433.png',
  {
    id: 6,;
  height: 100%
    name: 'Blood Pressure Monitors',
    category: 'Medical Equipment',
    availability: 'Low',
    qtyInStock: 25,
    qtyToReorder: 100,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913440.png',
  },
  {
    id: 7,
    name: 'Bandages',
    category: 'First Aid',
    availability: 'Available',
    qtyInStock: 300,
    qtyToReorder: 200,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913464.png',
  },
  {
    id: 8,
    name: 'IV Fluids',
    category: 'Medical Supplies',
    availability: 'Low',
    qtyInStock: 10,
    qtyToReorder: 150,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913457.png',
  },
  {
    id: 9,
    name: 'Scalpel Blades',
    category: 'Surgical Instruments',
    availability: 'Out of Stock',
    qtyInStock: 0,
    qtyToReorder: 200,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913412.png',
  },
  {
    id: 10,
    name: 'Syringes',
    category: 'Medical Supplies',
    availability: 'Available',
    qtyInStock: 400,
    qtyToReorder: 300,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913473.png',
  },
  {
    id: 11,
    name: 'Medical Gowns',
    category: 'PPE',
    availability: 'Available',
    qtyInStock: 150,
    qtyToReorder: 200,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913488.png',
  },
  {
    id: 12,
    name: 'Disinfectant Wipes',
    category: 'Sanitizer',
    availability: 'Available',
    qtyInStock: 25,
    qtyToReorder: 200,
    image: 'https://cdn-icons-png.flaticon.com/512/2913/2913507.png',
  },
];

// Lifecycle
onMounted(() => {
  fetchInventory();
});
</script>

<style scoped>
.inventory-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.flex-cc {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
