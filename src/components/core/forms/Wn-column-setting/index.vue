<template>
  <ElPopover
    v-model:visible="popoverVisible"
    placement="bottom-end"
    trigger="click"
    :width="'auto'"
    popper-class="!p-0 !rounded-lg !border-slate-200 !shadow-md !bg-white"
    :show-arrow="false"
    :offset="4"
  >
    <template #reference>
      <WnIconButton
        :icon="icon"
        :size="iconSize"
        :circle="circle"
        class="w-9! h-9!"
      />
    </template>

    <div class="flex flex-col bg-white rounded-lg min-w-48 max-w-64">
      <VueDraggable
        v-model="localColumns"
        :animation="200"
        handle=".drag-handle"
        ghost-class="opacity-50"
        class="flex flex-col gap-0.5 p-1"
        @end="handleDragEnd"
      >
        <div
          v-for="col in localColumns"
          :key="col.prop"
          class="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-move hover:bg-slate-100 transition-colors group select-none"
        >
          <WnSvgIcon
            icon="solar:hamburger-menu-linear"
            :size="16"
            class="text-slate-400 shrink-0 drag-handle opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          />

          <ElCheckbox
            v-model="col.visible"
            :disabled="col.required"
            class="!mr-0 flex items-center justify-center [&_.el-checkbox\_\_label]:hidden h-4 shrink-0"
            @change="handleVisibilityChange"
          />

          <span
            class="text-sm text-slate-700 font-medium flex-1 min-w-0 truncate"
            :title="col.label"
          >
            {{ col.label }}
          </span>

          <WnSvgIcon
            v-if="col.fixed === 'left'"
            icon="solar:pin-bold"
            :size="14"
            class="text-slate-400 shrink-0"
          />
          <WnSvgIcon
            v-else-if="col.fixed === 'right'"
            icon="solar:pin-bold"
            :size="14"
            class="text-slate-400 shrink-0 rotate-180"
          />
        </div>
      </VueDraggable>

      <div class="flex items-center justify-between p-2 mt-0.5 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
        <button
          type="button"
          class="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
          @click="handleSelectAll"
        >
          Select All
        </button>
        <button
          type="button"
          class="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
          @click="handleDeselectAll"
        >
          Deselect All
        </button>
      </div>
    </div>
  </ElPopover>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ElPopover, ElCheckbox } from 'element-plus';
import { VueDraggable } from 'vue-draggable-plus';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'WnColumnSetting' });

export interface ColumnConfig {
  prop: string;
  label: string;
  visible: boolean;
  required?: boolean;
  fixed?: 'left' | 'right' | false;
  sortable?: boolean;
}

interface Props {
  columns: ColumnConfig[];
  icon?: string;
  iconSize?: number | string;
  circle?: boolean;
  storageKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'solar:settings-linear',
  iconSize: 20,
  circle: false,
});

const emit = defineEmits<{
  (e: 'change', columns: ColumnConfig[]): void;
  (e: 'reset'): void;
}>();

const popoverVisible = ref(false);
const localColumns = ref<ColumnConfig[]>([]);

const defaultColumns = computed(() => props.columns);

const initColumns = () => {
  if (props.storageKey) {
    const stored = localStorage.getItem(props.storageKey);
    if (stored) {
      try {
        const storedColumns = JSON.parse(stored);
        const mergedColumns = props.columns.map((col) => {
          const storedCol = storedColumns.find((sc: ColumnConfig) => sc.prop === col.prop);
          return storedCol ? { ...col, visible: storedCol.visible } : col;
        });
        const storedOrder = storedColumns.map((sc: ColumnConfig) => sc.prop);
        mergedColumns.sort((a, b) => {
          const aIndex = storedOrder.indexOf(a.prop);
          const bIndex = storedOrder.indexOf(b.prop);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
        localColumns.value = mergedColumns;
        return;
      } catch {
        console.error('Failed to parse stored column settings');
      }
    }
  }
  localColumns.value = JSON.parse(JSON.stringify(props.columns));
};

watch(
  () => props.columns,
  () => {
    initColumns();
  },
  { immediate: true, deep: true },
);

const saveToStorage = () => {
  if (props.storageKey) {
    localStorage.setItem(props.storageKey, JSON.stringify(localColumns.value));
  }
};

const emitChange = () => {
  emit('change', [...localColumns.value]);
  saveToStorage();
};

const handleDragEnd = () => {
  emitChange();
};

const handleVisibilityChange = () => {
  emitChange();
};

const handleReset = () => {
  localColumns.value = JSON.parse(JSON.stringify(defaultColumns.value));
  if (props.storageKey) {
    localStorage.removeItem(props.storageKey);
  }
  emit('reset');
  emitChange();
};

const handleSelectAll = () => {
  localColumns.value.forEach((col) => {
    if (!col.required) {
      col.visible = true;
    }
  });
  emitChange();
};

const handleDeselectAll = () => {
  localColumns.value.forEach((col) => {
    if (!col.required) {
      col.visible = false;
    }
  });
  emitChange();
};

defineExpose({
  getColumns: () => localColumns.value,
  reset: handleReset,
});
</script>