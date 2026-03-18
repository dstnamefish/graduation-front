<!-- Excel导出组件：一键导出数据为Excel文件，支持列配置、自动序号、进度回调 -->
<template>
  <ElButton :type="type" :size="size" :loading="isExporting" :disabled="disabled || !hasData" v-ripple @click="handleExport">
    <template #loading>
      <ElIcon class="is-loading"><Loading /></ElIcon>
      {{ loadingText }}
    </template>
    <slot>{{ buttonText }}</slot>
  </ElButton>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { Loading } from '@element-plus/icons-vue';
import type { ButtonType } from 'element-plus';

defineOptions({ name: 'WnExcelExport' });

/** 导出数据类型 */
type ExportValue = string | number | boolean | null | undefined | Date;

interface ExportData {
  [key: string]: ExportValue;
}

/** 列配置 */
interface ColumnConfig {
  title: string;
  width?: number;
  formatter?: (value: ExportValue, row: ExportData, index: number) => string;
}

/** 导出配置选项 */
interface ExportOptions {
  data: ExportData[];
  filename?: string;
  sheetName?: string;
  type?: ButtonType;
  size?: 'large' | 'default' | 'small';
  disabled?: boolean;
  buttonText?: string;
  loadingText?: string;
  autoIndex?: boolean;
  indexColumnTitle?: string;
  columns?: Record<string, ColumnConfig>;
  headers?: Record<string, string>;
  maxRows?: number;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  workbookOptions?: {
    created?: Date;
    creator?: string;
    lastModifiedBy?: string;
    modified?: Date;
  };
}

const props = withDefaults(defineProps<ExportOptions>(), {
  autoIndex: false,
  buttonText: '导出 Excel',
  columns: () => ({}),
  disabled: false,
  filename: () => `export_${new Date().toISOString().slice(0, 10)}`,
  headers: () => ({}),
  indexColumnTitle: '序号',
  loadingText: '导出中...',
  maxRows: 100000,
  sheetName: 'Sheet1',
  showErrorMessage: true,
  showSuccessMessage: true,
  size: 'default',
  type: 'primary',
  workbookOptions: () => ({}),
});

const emit = defineEmits<{
  'before-export': [data: ExportData[]];
  'export-error': [error: ExportError];
  'export-progress': [progress: number];
  'export-success': [filename: string, rowCount: number];
}>();

/** 导出错误类型 */
class ExportError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'ExportError';
  }
}

const isExporting = ref(false);

/** 是否有数据可导出 */
const hasData = computed(() => Array.isArray(props.data) && props.data.length > 0);

/** 验证导出数据 */
const validateData = (data: ExportData[]): void => {
  if (!Array.isArray(data)) throw new ExportError('数据必须是数组格式', 'INVALID_DATA_TYPE');
  if (data.length === 0) throw new ExportError('没有可导出的数据', 'NO_DATA');
  if (data.length > props.maxRows) throw new ExportError(`数据行数超过限制（${props.maxRows}行）`, 'EXCEED_MAX_ROWS', { currentRows: data.length, maxRows: props.maxRows });
};

/** 格式化单元格值 */
const formatCellValue = (value: ExportValue, key: string, row: ExportData, index: number): string => {
  const column = props.columns[key];
  if (column?.formatter) return column.formatter(value, row, index);
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleDateString('zh-CN');
  if (typeof value === 'boolean') return value ? '是' : '否';
  return String(value);
};

/** 处理数据 */
const processData = (data: ExportData[]): Record<string, string>[] => {
  return data.map((item, index) => {
    const processedItem: Record<string, string> = {};
    if (props.autoIndex) processedItem[props.indexColumnTitle] = String(index + 1);
    Object.entries(item).forEach(([key, value]) => {
      let columnTitle = key;
      if (props.columns[key]?.title) columnTitle = props.columns[key].title;
      else if (props.headers[key]) columnTitle = props.headers[key];
      processedItem[columnTitle] = formatCellValue(value, key, item, index);
    });
    return processedItem;
  });
};

/** 计算列宽度 */
const calculateColumnWidths = (data: Record<string, string>[]): XLSX.ColInfo[] => {
  if (data.length === 0) return [];
  const sampleSize = Math.min(data.length, 100);
  const columns = Object.keys(data[0]);
  return columns.map((column) => {
    const configWidth = Object.values(props.columns).find((col) => col.title === column)?.width;
    if (configWidth) return { wch: configWidth };
    const maxLength = Math.max(column.length, ...data.slice(0, sampleSize).map((row) => String(row[column] || '').length));
    const width = Math.min(Math.max(maxLength + 2, 8), 50);
    return { wch: width };
  });
};

/** 导出到 Excel */
const exportToExcel = async (data: ExportData[], filename: string, sheetName: string): Promise<void> => {
  try {
    emit('export-progress', 10);
    const processedData = processData(data);
    emit('export-progress', 30);
    const workbook = XLSX.utils.book_new();
    if (props.workbookOptions) {
      workbook.Props = {
        Author: props.workbookOptions.creator || 'Art Design Pro',
        Category: '数据',
        Comments: '由系统自动生成',
        Company: '系统导出',
        CreatedDate: props.workbookOptions.created || new Date(),
        Keywords: 'excel,export,data',
        Manager: props.workbookOptions.lastModifiedBy || '',
        ModifiedDate: props.workbookOptions.modified || new Date(),
        Subject: '数据导出',
        Title: filename,
      };
    }
    emit('export-progress', 50);
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    worksheet['!cols'] = calculateColumnWidths(processedData);
    emit('export-progress', 70);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    emit('export-progress', 85);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', compression: true, type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    emit('export-progress', 95);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFilename = `${filename}_${timestamp}.xlsx`;
    FileSaver.saveAs(blob, finalFilename);
    emit('export-progress', 100);
    await nextTick();
    return Promise.resolve();
  } catch (error) {
    throw new ExportError(`Excel 导出失败: ${(error as Error).message}`, 'EXPORT_FAILED', error);
  }
};

/** 处理导出 */
const handleExport = useThrottleFn(async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  try {
    validateData(props.data);
    emit('before-export', props.data);
    await exportToExcel(props.data, props.filename, props.sheetName);
    emit('export-success', props.filename, props.data.length);
    if (props.showSuccessMessage) ElMessage.success({ duration: 3000, message: `成功导出 ${props.data.length} 条数据` });
  } catch (error) {
    const exportError = error instanceof ExportError ? error : new ExportError(`导出失败: ${(error as Error).message}`, 'UNKNOWN_ERROR', error);
    emit('export-error', exportError);
    if (props.showErrorMessage) ElMessage.error({ duration: 5000, message: exportError.message });
    console.error('Excel 导出错误:', exportError);
  } finally {
    isExporting.value = false;
    emit('export-progress', 0);
  }
}, 1000);

defineExpose({ exportData: handleExport, hasData, isExporting: readonly(isExporting) });
</script>