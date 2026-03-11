/**
 * 会话管理 API 服务
 * @module api/services/conversation.service
 */

import request from '@/shared/lib/utils/http';
import type {
  CreateConversationParams,
  GetConversationParams,
  ConversationResponse,
  ConversationListResponse,
} from '@/features/message/types.conversation';

const BASE_URL = '/conversation';

class ConversationService {
  /** 获取会话列表 */
  async fetchConversations(): Promise<ConversationResponse[]> {
    return request.get<ConversationResponse[]>({
      url: `${BASE_URL}/list`,
    });
  }

  /** 获取会话分页列表 */
  async fetchConversationsPage(params?: GetConversationParams): Promise<ConversationListResponse> {
    return request.get<ConversationListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 获取会话详情 */
  async getConversationById(id: number): Promise<ConversationResponse> {
    return request.get<ConversationResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 创建会话 */
  async createConversation(data: CreateConversationParams): Promise<number> {
    return request.post<number>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 获取或创建私聊会话 */
  async getOrCreatePrivateConversation(targetUserId: number): Promise<ConversationResponse> {
    return request.post<ConversationResponse>({
      url: `${BASE_URL}/private/${targetUserId}`,
    });
  }

  /** 删除会话 */
  async deleteConversation(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 获取未读会话数量 */
  async getUnreadConversationsCount(): Promise<number> {
    return request.get<number>({
      url: `${BASE_URL}/unread-count`,
    });
  }
}

export const conversationService = new ConversationService();
