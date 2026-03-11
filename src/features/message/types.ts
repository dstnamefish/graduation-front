/**
 * 消息模块类型定义
 * @module types/api/core/message
 */


/** 消息类型 */
export enum MessageType {
  TEXT = 0,  // 文本
  IMAGE = 1, // 图片
  FILE = 2,  // 文件
}

/** 消息来源类型 */
export enum MessageSourceType {
  USER = 0,   // 用户
  SYSTEM = 1, // 系统
}

/** 消息 - 请求参数 */
export interface SendMessageParams {
  content: string;
  type?: MessageType;
  conversationId: number;
  fileId?: number;
}

/** 消息 - 查询参数 */
export interface GetMessageParams extends Partial<PaginationParams> {
  conversationId?: number;
}

/** 消息 - 响应数据 */
export interface MessageResponse {
  id: number;
  content: string;
  type: MessageType;
  sourceType: MessageSourceType;
  status: number;
  sentAt: string;
  readAt?: string;
  senderId: number;
  senderName?: string;
  senderAvatar?: string;
  conversationId: number;
  fileId?: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
}

/** 消息 - 分页列表 */
export type MessageListResponse = PaginatedResponse<MessageResponse>;

/** 未读消息数量 */
export interface UnreadCountResponse {
  count: number;
}
