/**
 * 通知实体类型定义
 */

/**
 * 通知信息
 * @description 系统通知信息
 * @property {number} id - 通知ID
 * @property {string} title - 通知标题
 * @property {string} content - 通知内容
 * @property {string} type - 通知类型：system-系统通知，appointment-预约通知，message-消息通知
 * @property {boolean} isRead - 是否已读
 * @property {string} createTime - 创建时间
 * @property {string} readTime - 阅读时间
 */
export interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createTime: string;
  readTime?: string;
}

/**
 * 通知查询参数
 * @description 用于查询通知的参数
 * @property {string} type - 通知类型
 * @property {boolean} isRead - 是否已读
 * @property {number} page - 页码，默认1
 * @property {number} size - 每页大小，默认10
 */
export interface NotificationQuery {
  type?: string;
  isRead?: boolean;
  page?: number;
  size?: number;
}

/**
 * 通知列表响应
 * @description 获取通知列表的响应数据
 * @property {Array<Notification>} data - 通知列表
 */
export interface NotificationListResponse {
  data: Notification[];
}

/**
 * 未读通知数量响应
 * @description 获取未读通知数量的响应数据
 * @property {number} data - 未读通知数量
 */
export interface UnreadCountResponse {
  data: number;
}
