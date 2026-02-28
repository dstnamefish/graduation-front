<!-- 导出 Excel 文件 -->
<template>
  <ElButton
    :type="type"
    :size="size"
    :loading="isExporting"
    :disabled="disabled || !hasData"
    v-ripple
    @click="handleExport"
  >
    <template #loading>
      <ElIcon class="is-loading">
        <Loading />
      </ElIcon>
      {{ loadingText }}
    </template>
    <slot>{{ buttonText }}</slot>
  </ElButton>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { ref, computed, nextTick } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import type { ButtonType } from 'element-plus';
import { useThrottleFn } from '@vueuse/core';

defineOptions({ name: 'WnExcelExport' });

/** 导出数据类型 */
type ExportValue = string | number | boolean | null | undefined | Date;

interface ExportData {
  [key: string]: ExportValue;
}

/** 列配置 */
interface ColumnConfig {
  /** 列标题 */
  title: string;

  /** 列宽度 */
  width?: number;

  /** 数据格式化函数 */
  formatter?: (value: ExportValue, row: ExportData, index: number) => string;
}

/**
 * 导出配置选项
 *
 * @interface ExportOptions
 * @property {ExportData[]} data - 数据源，包含要导出的数据行。
 * @property {string} [filename] - 文件名（不含扩展名），默认值为 `export_${new Date().toISOString().slice(0, 10)}`。
 * @property {string} [sheetName] - 工作表名称，默认值为 `Sheet1`。
 * @property {ButtonType} [type] - 按钮类型，默认值为 `primary`。
 * @property {'large' | 'default' | 'small'} [size] - 按钮尺寸，默认值为 `default`。
 * @property {boolean} [disabled] - 是否禁用按钮，默认值为 `false`。
 * @property {string} [buttonText] - 按钮文本，默认值为 `导出 Excel`。
 * @property {string} [loadingText] - 加载中文本，默认值为 `导出中...`。
 * @property {boolean} [autoIndex] - 是否自动添加序号列，默认值为 `false`。
 * @property {string} [indexColumnTitle] - 序号列标题，默认值为 `序号`。
 * @property {Record<string, ColumnConfig>} [columns] - 列配置映射，键为数据字段名，值为列配置。
 * @property {Record<string, string>} [headers] - 表头映射（简化版本，向后兼容），键为数据字段名，值为列标题。
 * @property {number} [maxRows] - 最大导出行数，默认值为 `100000`。
 * @property {boolean} [showSuccessMessage] - 是否显示成功消息，默认值为 `true`。
 * @property {boolean} [showErrorMessage] - 是否显示错误消息，默认值为 `true`。
 * @property {object} [workbookOptions] - 工作簿配置。
 * @property {Date} [workbookOptions.created] - 创建时间，默认值为当前时间。
 * @property {string} [workbookOptions.creator] - 创建者，默认值为空字符串。
 * @property {string} [workbookOptions.lastModifiedBy] - 最后修改者，默认值为空字符串。
 * @property {Date} [workbookOptions.modified] - 修改时间，默认值为当前时间。
 *
 */
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
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'ExportError';
  }
}

const isExporting = ref(false);

/** 是否有数据可导出 */
const hasData = computed(() => Array.isArray(props.data) && props.data.length > 0);

/** 验证导出数据 */
const validateData = (data: ExportData[]): void => {
  if (!Array.isArray(data)) {
    throw new ExportError('数据必须是数组格式', 'INVALID_DATA_TYPE');
  }

  if (data.length === 0) {
    throw new ExportError('没有可导出的数据', 'NO_DATA');
  }

  if (data.length > props.maxRows) {
    throw new ExportError(`数据行数超过限制（${props.maxRows}行）`, 'EXCEED_MAX_ROWS', {
      currentRows: data.length,
      maxRows: props.maxRows,
    });
  }
};

/** 格式化单元格值 */
const formatCellValue = (
  value: ExportValue,
  key: string,
  row: ExportData,
  index: number,
): string => {
  // 使用列配置的格式化函数
  const column = props.columns[key];
  if (column?.formatter) {
    return column.formatter(value, row, index);
  }

  // 处理特殊值
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('zh-CN');
  }

  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }

  return String(value);
};

/** 处理数据 */
const processData = (data: ExportData[]): Record<string, string>[] => {
  const processedData = data.map((item, index) => {
    const processedItem: Record<string, string> = {};

    // 添加序号列
    if (props.autoIndex) {
      processedItem[props.indexColumnTitle] = String(index + 1);
    }

    // 处理数据列
    Object.entries(item).forEach(([key, value]) => {
      // 获取列标题
      let columnTitle = key;
      if (props.columns[key]?.title) {
        columnTitle = props.columns[key].title;
      } else if (props.headers[key]) {
        columnTitle = props.headers[key];
      }

      // 格式化值
      processedItem[columnTitle] = formatCellValue(value, key, item, index);
    });

    return processedItem;
  });

  return processedData;
};

/** 计算列宽度 */
const calculateColumnWidths = (data: Record<string, string>[]): XLSX.ColInfo[] => {
  if (data.length === 0) {
    return [];
  }

  const sampleSize = Math.min(data.length, 100); // 只取前100行计算列宽
  const columns = Object.keys(data[0]);

  return columns.map((column) => {
    // 使用配置的列宽度
    const configWidth = Object.values(props.columns).find((col) => col.title === column)?.width;

    if (configWidth) {
      return { wch: configWidth };
    }

    // 自动计算列宽度
    const maxLength = Math.max(
      column.length, // 标题长度
      ...data.slice(0, sampleSize).map((row) => String(row[column] || '').length),
    );

    // 限制最小和最大宽度
    const width = Math.min(Math.max(maxLength + 2, 8), 50);
    return { wch: width };
  });
};

/** 导出到 Excel */
const exportToExcel = async (
  data: ExportData[],
  filename: string,
  sheetName: string,
): Promise<void> => {
  try {
    emit('export-progress', 10);

    // 处理数据
    const processedData = processData(data);
    emit('export-progress', 30);

    // 创建工作簿
    const workbook = XLSX.utils.book_new();

    // 设置工作簿属性
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

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(processedData);

    // 设置列宽度
    worksheet['!cols'] = calculateColumnWidths(processedData);

    emit('export-progress', 70);

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    emit('export-progress', 85);

    // 生成 Excel 文件
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      compression: true,
      type: 'array',
    });

    // 创建 Blob 并下载
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    emit('export-progress', 95);

    // 使用时间戳确保文件名唯一
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFilename = `${filename}_${timestamp}.xlsx`;

    FileSaver.saveAs(blob, finalFilename);

    emit('export-progress', 100);

    // 等待下载开始
    await nextTick();

    return Promise.resolve();
  } catch (error) {
    throw new ExportError(`Excel 导出失败: ${(error as Error).message}`, 'EXPORT_FAILED', error);
  }
};

/** 处理导出 */
const handleExport = useThrottleFn(async () => {
  if (isExporting.value) {
    return;
  }

  isExporting.value = true;

  try {
    // 验证数据
    validateData(props.data);

    // 触发导出前事件
    emit('before-export', props.data);

    // 执行导出
    await exportToExcel(props.data, props.filename, props.sheetName);

    // 触发成功事件
    emit('export-success', props.filename, props.data.length);

    // 显示成功消息
    if (props.showSuccessMessage) {
      ElMessage.success({
        duration: 3000,
        message: `成功导出 ${props.data.length} 条数据`,
      });
    }
  } catch (error) {
    const exportError =
      error instanceof ExportError
        ? error
        : new ExportError(`导出失败: ${(error as Error).message}`, 'UNKNOWn_ERROR', error);

    // 触发错误事件
    emit('export-error', exportError);

    // 显示错误消息
    if (props.showErrorMessage) {
      ElMessage.error({
        duration: 5000,
        message: exportError.message,
      });
    }

    console.error('Excel 导出错误:', exportError);
  } finally {
    isExporting.value = false;
    emit('export-progress', 0);
  }
}, 1000);

// 暴露方法供父组件调用
defineExpose({
  exportData: handleExport,
  hasData,
  isExporting: readonly(isExporting),
});
</script>

<style scoped>
.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
