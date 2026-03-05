<script setup lang="ts">
import { ref, computed, nextTick, useAttrs, useSlots } from 'vue';
import type { ElTable, TableProps } from 'element-plus';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { ColumnOption } from '@/types';
import { useCommon } from '@/hooks/core/useCommon';
import { useElementSize, useWindowSize } from '@vueuse/core';

defineOptions({ name: 'WnTable' });

/** 分页配置接口 */
interface PaginationConfig {
  current: number;
  size: number;
  total: number;
}

/** 分页器配置选项接口 */
interface PaginationOptions {
  pageSizes?: number[];
  align?: 'left' | 'center' | 'right';
  layout?: string;
  background?: boolean;
  hideOnSinglePage?: boolean;
  size?: 'small' | 'default' | 'large';
  pagerCount?: number;
}

interface WnTableProps extends TableProps<Record<string, any>> {
  loading?: boolean;
  columns?: ColumnOption[];
  pagination?: PaginationConfig;
  paginationOptions?: PaginationOptions;
  emptyHeight?: string;
  emptyText?: string;
  paginationBackground?: 'white' | 'gray';
  headerTheme?: 'soft' | 'gray' | 'white';
  headerHeight?: string | number;
  showHeaderBorder?: boolean;
  tableRadius?: string | number;
  headerRadius?: string | number;
  rowKey?: string | ((row: any) => string); // [!code ++] 新增：接收 rowKey 属性
}

const props = withDefaults(defineProps<WnTableProps>(), {
  columns: () => [],
  fit: true,
  showHeader: true,
  stripe: undefined,
  border: undefined,
  size: undefined,
  emptyHeight: '100%',
  emptyText: '暂无数据',
  paginationBackground: 'white',
  headerTheme: 'white',
  headerHeight: '56px',
  showHeaderBorder: true,
  tableRadius: '12px',
  headerRadius: '0px',
  rowKey: 'id',
});

const $attrs = useAttrs();
const $slots = useSlots();
const { width: windowWidth } = useWindowSize();
const elTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const tableWrapperRef = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (e: 'pagination:size-change', val: number): void;
  (e: 'pagination:current-change', val: number): void;
  (e: 'selection-change', val: any[]): void;
}>();

// --- 勾选逻辑 ---
const selection = ref<any[]>([]);
const onSelectionChange = (val: any[]) => {
  selection.value = val;
  emit('selection-change', val);
};
const handleRowClassName = (rowScope: { row: any; rowIndex: number }) => {
  const isSelected = selection.value.some((item) => item === rowScope.row);
  const classes = [isSelected ? 'row-checked' : ''];
  if (props.rowClassName) {
    const customClass =
      typeof props.rowClassName === 'function' ? props.rowClassName(rowScope) : props.rowClassName;
    if (customClass) classes.push(customClass);
  }
  return classes.filter(Boolean).join(' ');
};

const { scrollToTop: scrollPageToTop } = useCommon();
const scrollToTop = () => {
  nextTick(() => {
    elTableRef.value?.setScrollTop(0);
    scrollPageToTop();
  });
};

const handleSizeChange = (val: number) => emit('pagination:size-change', val);
const handleCurrentChange = (val: number) => {
  emit('pagination:current-change', val);
  scrollToTop();
};

const currentPage = computed({
  get: () => props.pagination?.current || 1,
  set: (val) => handleCurrentChange(val),
});

const pageSize = computed({
  get: () => props.pagination?.size || 10,
  set: (val) => handleSizeChange(val),
});

const tableProps = computed(() => {
  const {
    loading,
    columns,
    pagination,
    paginationOptions,
    emptyHeight,
    emptyText,
    paginationBackground,
    headerTheme,
    headerHeight,
    showHeaderBorder,
    tableRadius,
    headerRadius,
    rowClassName,
    rowKey,
    ...rest
  } = props;
  return rest;
});

const LAYOUT = {
  MOBILE: 'prev, pager, next, sizes, jumper, total',
  IPAD: 'prev, pager, next, jumper, total',
  DESKTOP: 'total, prev, pager, next, sizes, jumper',
};

const layout = computed(() => {
  if (windowWidth.value < 768) return LAYOUT.MOBILE;
  if (windowWidth.value < 1024) return LAYOUT.IPAD;
  return LAYOUT.DESKTOP;
});

const DEFAULT_PAGINATION_OPTIONS: PaginationOptions = {
  pageSizes: [10, 20, 30, 50, 100],
  align: 'center',
  background: true,
  layout: layout.value,
  hideOnSinglePage: false,
  size: 'default',
  pagerCount: windowWidth.value > 1200 ? 7 : 5,
};

const mergedPaginationOptions = computed(() => ({
  ...DEFAULT_PAGINATION_OPTIONS,
  ...props.paginationOptions,
}));

const border = computed(() => props.border);
const stripe = computed(() => props.stripe);
const size = computed(() => props.size);
const isEmpty = computed(() => (props.data as any[])?.length === 0);

const { height: wrapperHeight } = useElementSize(tableWrapperRef);

const tableInternalHeight = computed(() => {
  if (isEmpty.value && !props.loading) return props.emptyHeight;
  if (props.height) return props.height;
  return wrapperHeight.value > 0 ? `${wrapperHeight.value}px` : '100%';
});

const headerCellStyle = computed(() => ({
  background: 'var(--table-header-bg, var(--color-slate-950))',
  ...(props.headerCellStyle || {}),
}));

const showPagination = computed(() => !!props.pagination && !isEmpty.value);

const cleanColumnProps = (col: ColumnOption) => {
  const columnProps = { ...col };
  delete (columnProps as any).useHeaderSlot;
  delete (columnProps as any).headerSlotName;
  delete (columnProps as any).useSlot;
  delete (columnProps as any).slotName;
  return columnProps;
};

const sortIcons = [
  { type: 'ascending', icon: 'local-common/arrow-up', class: '-mb-1' },
  { type: 'descending', icon: 'local-common/arrow-down', class: '-mt-1' },
];

const getSortIconClass = (currentOrder: string, expectedOrder: string) => {
  return currentOrder === expectedOrder
    ? 'text-accent-foreground active:text-accent-foreground'
    : 'text-muted';
};

const tableThemeStyles = computed(() => {
  const headerBgMap: Record<string, string> = {
    gray: 'var(--color-slate-100)',
    white: 'var(--color-slate-50)',
    soft: 'var(--color-slate-75)',
  };

  return {
    '--table-radius':
      typeof props.tableRadius === 'number' ? `${props.tableRadius}px` : props.tableRadius,
    '--table-header-bg': headerBgMap[props.headerTheme] || 'var(--color-slate-50)',
    '--table-header-radius': props.headerRadius
      ? typeof props.headerRadius === 'number'
        ? `${props.headerRadius}px`
        : props.headerRadius
      : '0px',
    '--table-header-height':
      typeof props.headerHeight === 'number' ? `${props.headerHeight}px` : props.headerHeight,
    '--table-header-border': props.showHeaderBorder ? '1px solid var(--color-slate-200)' : 'none',
    '--table-outer-border': border.value ? '1px solid var(--color-slate-200)' : 'none',
    '--table-cell-border-bottom': border.value
      ? '1px solid var(--color-slate-200)'
      : '1px solid var(--color-slate-100)',
  };
});

const paginationThemeStyles = computed(() => {
  const isWhite = props.paginationBackground === 'white';
  return {
    '--background-color': isWhite ? 'var(--color-slate-50)' : 'var(--color-slate-100)',
    '--background-color-hover': isWhite ? 'var(--color-slate-100)' : 'var(--color-slate-200)',
    '--background-color-focus': '#ffffff',
  };
});

defineExpose({ scrollToTop, elTableRef });
</script>

<template>
  <div
    class="flex flex-col h-full overflow-hidden"
    :class="{ 'is-empty': isEmpty }"
    :style="tableThemeStyles"
  >
    <div
      class="flex-1 min-h-0 relative"
      ref="tableWrapperRef"
    >
      <ElTable
        ref="elTableRef"
        v-loading="!!props.loading"
        :row-key="props.rowKey"
        v-bind="{
          ...$attrs,
          ...tableProps,
          height: tableInternalHeight,
          stripe,
          border,
          size,
          headerCellStyle,
        }"
        :row-class-name="handleRowClassName"
        @selection-change="onSelectionChange"
      >
        <template
          v-for="col in props.columns"
          :key="col.prop || col.type"
        >
          <ElTableColumn
            v-if="col.type === 'selection'"
            v-bind="cleanColumnProps(col)"
            :reserve-selection="true"
          />

          <ElTableColumn
            v-else
            v-bind="cleanColumnProps(col)"
          >
            <template
              v-if="(col.useHeaderSlot && col.prop) || col.sortable"
              #header="ms"
            >
              <div class="inline-flex items-center w-full group max-w-full">
                <slot
                  v-if="col.useHeaderSlot && col.prop"
                  :name="col.headerSlotName || `${col.prop}-header`"
                  v-bind="{ ...ms, prop: col.prop, label: col.label }"
                >
                  {{ col.label }}
                </slot>
                <span v-else>
                  {{ col.label }}
                </span>
                <div
                  v-if="col.sortable || ms.column.sortable"
                  class="flex flex-col items-center justify-center ml-1.5 shrink-0"
                >
                  <WnSvgIcon
                    v-for="sort in sortIcons"
                    :key="sort.type"
                    :icon="sort.icon"
                    :size="14"
                    class="transition-colors duration-200"
                    :class="[sort.class, getSortIconClass(ms.column.order, sort.type)]"
                  />
                </div>
              </div>
            </template>
            <template
              v-if="col.useSlot && col.prop"
              #default="slotScope"
            >
              <slot
                :name="col.slotName || col.prop"
                v-bind="{
                  ...slotScope,
                  prop: col.prop,
                  value: col.prop ? slotScope.row[col.prop] : undefined,
                }"
              />
            </template>
          </ElTableColumn>
        </template>

        <template
          v-if="$slots.default"
          #default
        >
          <slot />
        </template>

        <template #empty>
          <div v-if="props.loading"></div>
          <ElEmpty
            v-else
            :description="props.emptyText"
            :image-size="120"
          />
        </template>
      </ElTable>
    </div>

    <div
      v-if="showPagination"
      class="flex flex-wrap items-center justify-between gap-4 py-8 shrink-0"
      :style="paginationThemeStyles"
    >
      <div class="flex items-center gap-2.5 text-muted text-sm">
        <span>Showing</span>
        <ElSelect v-model="pageSize">
          <ElOption
            v-for="s in mergedPaginationOptions.pageSizes || []"
            :key="s"
            :label="s"
            :value="s"
          />
        </ElSelect>
        <span>
          out of
          <span>{{ props.pagination?.total }}</span>
        </span>
      </div>
      <ElPagination
        v-bind="mergedPaginationOptions"
        layout="prev, pager, next"
        :total="props.pagination?.total"
        :disabled="props.loading"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
