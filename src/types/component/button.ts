/**
 * 按钮组件类型定义
 * @module types/component/button
 * @description 提供按钮组件的类型定义，包括按钮尺寸、类型、动作等
 */

/** 按钮尺寸类型 */
export type ButtonSize = 'small' | 'medium' | 'large';

/** 按钮主题类型 */
export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'warning'
  | 'info'
  | 'success';

/** 按钮动作类型 */
export type ButtonAction =
  | 'submit'
  | 'continue'
  | 'cancel'
  | 'reset'
  | 'save'
  | 'delete'
  | 'edit'
  | 'add'
  | 'confirm'
  | 'back'
  | 'custom';

/** 按钮组件属性接口 */
export interface ButtonProps {
  /** 按钮动作类型 */
  action?: ButtonAction;
  /** 按钮主题类型 */
  type?: ButtonType;
  /** 按钮尺寸 */
  size?: ButtonSize;
  /** 是否为块级元素 */
  block?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 按钮文本 */
  text?: string;
  /** 加载状态文本 */
  loadingText?: string;
  /** 按钮图标 */
  icon?: string;
  /** 是否只显示图标 */
  iconOnly?: boolean;
  /** HTML原生按钮类型 */
  htmlType?: 'button' | 'submit' | 'reset';
}

/** 按钮事件接口 */
export interface ButtonEmit {
  (e: 'click', event: Event): void;
}

/** 按钮动作配置接口 */
export interface ButtonActionConfig {
  /** 按钮默认显示文本 */
  text: string;
  /** 按钮默认主题类型 */
  type: ButtonType;
  /** 按钮默认图标 */
  icon?: string;
  /** HTML按钮类型 */
  htmlType?: 'button' | 'submit' | 'reset';
}

/** 按钮动作配置映射 */
export const BUTTON_ACTION_CONFIGS: Record<ButtonAction, ButtonActionConfig> = {
  add: { icon: 'ep:plus', text: '添加', type: 'primary' },
  back: { icon: 'ep:arrow-left', text: '返回', type: 'secondary' },
  cancel: { icon: 'ep:close', text: '取消', type: 'secondary' },
  confirm: { icon: 'ep:check', text: '确认', type: 'primary' },
  continue: { icon: 'ep:arrow-right', text: '继续', type: 'primary' },
  custom: { text: '按钮', type: 'primary' },
  delete: { icon: 'ep:delete', text: '删除', type: 'danger' },
  edit: { icon: 'ep:edit', text: '编辑', type: 'info' },
  reset: { htmlType: 'reset', icon: 'ep:refresh', text: '重置', type: 'warning' },
  save: { icon: 'ep:document', text: '保存', type: 'success' },
  submit: { htmlType: 'submit', icon: 'ep:check', text: '提交', type: 'primary' },
};

/** 表单操作按钮组属性接口 */
export interface FormActionsProps {
  /** 是否显示提交按钮 */
  showSubmit?: boolean;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 提交按钮动作类型 */
  submitAction?: ButtonAction;
  /** 重置按钮动作类型 */
  resetAction?: ButtonAction;
  /** 取消按钮动作类型 */
  cancelAction?: ButtonAction;
  /** 提交按钮主题类型 */
  submitType?: ButtonType;
  /** 重置按钮主题类型 */
  resetType?: ButtonType;
  /** 取消按钮主题类型 */
  cancelType?: ButtonType;
  /** 按钮组尺寸 */
  size?: ButtonSize;
  /** 按钮是否为块级布局 */
  block?: boolean;
  /** 按钮组加载状态 */
  loading?: boolean;
  /** 按钮组禁用状态 */
  disabled?: boolean;
  /** 表单是否有错误 */
  hasErrors?: boolean;
  /** 提交按钮自定义文本 */
  submitText?: string;
  /** 重置按钮自定义文本 */
  resetText?: string;
  /** 取消按钮自定义文本 */
  cancelText?: string;
  /** 加载状态文本 */
  loadingText?: string;
}

/** 表单操作按钮组事件接口 */
export interface FormActionsEmit {
  (e: 'submit', event: Event): void;
  (e: 'reset', event: Event): void;
  (e: 'cancel', event: Event): void;
}
