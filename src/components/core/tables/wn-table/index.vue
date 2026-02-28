<template>
  <div
    class="flex flex-col h-full overflow-hidden"
    :class="{ 'is-empty': isEmpty }"
  >
    <div
      class="flex-1 min-h-0 relative"
      ref="tableWrapperRef"
    >
      <ElTable
        ref="elTableRef"
        v-loading="!!loading"
        v-bind="{
          ...$attrs,
          ...tableProps,
          height: tableInternalHeight,
          stripe,
          border,
          size,
          headerCellStyle,
        }"
      >
        <template
          v-for="col in columns"
          :key="col.prop || col.type"
        >
          <!-- 渲染全局序号列 -->
          <ElTableColumn
            v-if="col.type === 'globalIndex'"
            v-bind="{ ...col }"
          >
            <template #default="{ $index }">
              <span>{{ getGlobalIndex($index) }}</span>
            </template>
          </ElTableColumn>

          <!-- 渲染展开行 -->
          <ElTableColumn
            v-else-if="col.type === 'expand'"
            v-bind="cleanColumnProps(col)"
          >
            <template #default="{ row }">
              <component :is="col.formatter ? col.formatter(row) : null" />
            </template>
          </ElTableColumn>

          <!-- 渲染普通列 -->
          <ElTableColumn
            v-else
            v-bind="cleanColumnProps(col)"
          >
            <!-- 渲染表头（支持自定义插槽与排序图标） -->
            <template
              v-if="(col.useHeaderSlot && col.prop) || col.sortable"
              #header="headerScope"
            >
              <div class="inline-flex items-center w-full group wn-table-header-cell max-w-full">
                <!-- 优先渲染自定义头部插槽 -->
                <slot
                  v-if="col.useHeaderSlot && col.prop"
                  :name="col.headerSlotName || `${col.prop}-header`"
                  v-bind="{ ...headerScope, prop: col.prop, label: col.label }"
                >
                  {{ col.label }}
                </slot>
                <!-- 默认只渲染文本 -->
                <span
                  v-else
                  class="truncate"
                >
                  {{ col.label }}
                </span>

                <!-- 渲染自定义排序图标 -->
                <div
                  v-if="col.sortable || headerScope.column.sortable"
                  class="flex flex-col items-center justify-center ml-1.5 shrink-0"
                >
                  <WnSvgIcon
                    icon="local-common/arrow-up"
                    :size="14"
                    class="-mb-1 transition-colors duration-200"
                    :class="
                      headerScope.column.order === 'ascending'
                        ? 'text-(--wn-p-500)'
                        : 'text-(--wn-t-300) group-hover:text-(--wn-t-200)'
                    "
                  />
                  <WnSvgIcon
                    icon="local-common/arrow-down"
                    :size="14"
                    class="-mt-1 transition-colors duration-200"
                    :class="
                      headerScope.column.order === 'descending'
                        ? 'text-(--wn-p-500)'
                        : 'text-(--wn-t-300) group-hover:text-(--wn-t-200)'
                    "
                  />
                </div>
              </div>
            </template>

            <!-- 渲染内容 -->
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
          <div v-if="loading"></div>
          <ElEmpty
            v-else
            :description="emptyText"
            :image-size="120"
          />
        </template>
      </ElTable>
    </div>

    <!-- 分页器容器 -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 py-8 px-4 shrink-0"
      v-if="showPagination"
    >
      <!-- 左侧：显示信息 -->
      <div class="flex items-center gap-2.5 text-slate-400 text-sm font-medium">
        <span>Showing</span>
        <ElSelect
          v-model="pageSize"
          class="w-[85px]!"
        >
          <ElOption
            v-for="size in mergedPaginationOptions.pageSizes"
            :key="size"
            :label="size"
            :value="size"
          />
        </ElSelect>
        <span>
          out of
          <span class="text-slate-600 font-bold">{{ pagination?.total }}</span>
        </span>
      </div>

      <!-- 右侧：分页按钮 -->
      <ElPagination
        v-bind="mergedPaginationOptions"
        layout="prev, pager, next"
        :total="pagination?.total"
        :disabled="loading"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, toRefs, useAttrs } from 'vue';
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
});

const $attrs = useAttrs();
const { width: windowWidth } = useWindowSize();
const elTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const tableWrapperRef = ref<HTMLElement | null>(null);

const { loading, columns, pagination, emptyText } = toRefs(props);

const emit = defineEmits<{
  (e: 'pagination:size-change', val: number): void;
  (e: 'pagination:current-change', val: number): void;
}>();

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
  get: () => pagination.value?.current || 1,
  set: (val) => handleCurrentChange(val),
});

const pageSize = computed({
  get: () => pagination.value?.size || 10,
  set: (val) => handleSizeChange(val),
});

const tableProps = computed(() => {
  const { loading, columns, pagination, paginationOptions, emptyHeight, emptyText, ...rest } =
    props;
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
  if (isEmpty.value && !loading.value) return props.emptyHeight;
  if (props.height) return props.height;
  return wrapperHeight.value > 0 ? `${wrapperHeight.value}px` : '100%';
});

const headerCellStyle = computed(() => ({
  background: 'var(--default-box-color)',
  ...(props.headerCellStyle || {}),
}));

const showPagination = computed(() => !!pagination.value && !isEmpty.value);

const cleanColumnProps = (col: ColumnOption) => {
  const columnProps = { ...col };
  delete (columnProps as any).useHeaderSlot;
  delete (columnProps as any).headerSlotName;
  delete (columnProps as any).useSlot;
  delete (columnProps as any).slotName;
  return columnProps;
};

const getGlobalIndex = (index: number) => {
  if (!pagination.value) return index + 1;
  const { current, size } = pagination.value;
  return (current - 1) * size + index + 1;
};

defineExpose({ scrollToTop, elTableRef });
</script>
