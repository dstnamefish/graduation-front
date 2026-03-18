/**
 * 表单组件类型定义
 * @module types/component/form
 * @description 提供表单组件的类型定义，包括表单字段、验证规则等
 */

/** 自定义验证函数类型 */
export type ValidatorFunction = (
  value: any,
  field: FormField,
  formData: Record<string, any>
) => boolean | string | Promise<boolean | string>;

/** 验证规则对象 */
export interface ValidatorRule {
  /** 验证规则函数，可以是函数名，也可以是函数 */
  validator: string | ValidatorFunction;
  /** 错误信息 */
  message?: string;
  /** 触发验证的时机 */
  trigger?: 'blur' | 'input' | 'change';
}

/** 选择框选项接口 */
export interface SelectOption {
  /** 选项值 */
  value: string | number;
  /** 选项显示文本 */
  label: string;
  /** 是否禁用该选项 */
  disabled?: boolean;
}

/** 表单字段配置接口 */
export interface FormField {
  /** 字段唯一标识名称 */
  name: string;
  /** 字段显示标签文本 */
  label?: string;
  /** 字段类型 */
  type?: 'text' | 'password' | 'email' | 'tel' | 'number' | 'select';
  /** 输入框占位符文本 */
  placeholder?: string;
  /** 是否为必填字段 */
  required?: boolean;
  /** 自定义验证规则 */
  validator?: string | RegExp | ValidatorFunction | ValidatorRule;
  /** 输入内容最小长度限制 */
  minLength?: number;
  /** 输入内容最大长度限制 */
  maxLength?: number;
  /** 输入框前置图标类名 */
  prefixIcon?: string;
  /** 输入框后置图标类名 */
  suffixIcon?: string;
  /** 是否显示该字段 */
  isShow?: boolean;
  /** 是否禁用该字段 */
  isDisabled?: boolean;
  /** 选择框选项列表 */
  options?: SelectOption[];
}

/** 表单数据接口 */
export interface FormData {
  email?: string;
  password?: string;
}

/** 表单组件属性接口 */
export interface FormProps {
  /** 表单字段配置数组 */
  fields: FormField[];
  /** 表单初始数据 */
  initialData?: Record<string, any>;
}

/** 表单事件接口 */
export interface FormEmit {
  (e: 'submit', data: FormData): void;
  (e: 'input', fieldName: string): void;
  (e: 'focus', fieldName: string): void;
  (e: 'blur', fieldName: string): void;
  (e: 'change', fieldName: string, value: any): void;
  (e: 'error', fieldName: string, errors: string[]): void;
}

/** 表格列配置接口 */
export interface ColumnOption<T = any> {
  /** 列类型 */
  type?: 'selection' | 'expand' | 'index';
  /** 列数据属性名 */
  prop?: string;
  /** 列标题文本 */
  label?: string;
  /** 列宽度 */
  width?: string | number;
  /** 列最小宽度 */
  minWidth?: string | number;
  /** 是否固定列位置 */
  fixed?: boolean | 'left' | 'right';
  /** 是否可排序 */
  sortable?: boolean;
  /** 列筛选选项数组 */
  filters?: any[];
  /** 筛选方法 */
  filterMethod?: (value: any, row: any) => boolean;
  /** 过滤器位置 */
  filterPlacement?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否选中显示 */
  checked?: boolean;
  /** 自定义渲染函数 */
  formatter?: (row: T) => any;
  /** 是否使用插槽渲染内容 */
  useSlot?: boolean;
  /** 插槽名称 */
  slotName?: string;
  /** 是否使用表头插槽 */
  useHeaderSlot?: boolean;
  /** 表头插槽名称 */
  headerSlotName?: string;
  /** 其他属性 */
  [key: string]: any;
}
