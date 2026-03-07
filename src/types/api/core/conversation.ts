/**
 * 会话模块类型定义
 * @module types/api/core/conversation
 */

import type { PaginationParams, PaginatedResponse } from './common';

/** 会话类型 */
export enum ConversationType {
  PRIVATE = 0, // 私聊
  GROUP = 1,   // 群聊
}

/** 会话状态 */
export enum ConversationStatus {
  ACTIVE = 1,  // 活跃
  DELETED = 0, // 已删除
}

/** 会话 - 创建请求参数 */
export interface CreateConversationParams {
  name?: string;
  type: ConversationType;
  participantIds: number[];
}

/** 会话 - 查询参数 */
export interface GetConversationParams extends Partial<PaginationParams> {
  type?: ConversationType;
}

/** 会话 - 响应数据 */
export interface ConversationResponse {
  id: number;
  name?: string;
  type: ConversationType;
  status: ConversationStatus;
  lastMessageId?: number;
  lastMessageContent?: string;
  lastMessageTime?: string;
  unreadCount: number;
  targetUserId?: number;
  targetUserName?: string;
  targetUserAvatar?: string;
  onlineStatus?: 'online' | 'away' | 'offline';
  createdTime: string;
  updatedTime: string;
}

/** 会话 - 分页列表 */
export type ConversationListResponse = PaginatedResponse<ConversationResponse>;
