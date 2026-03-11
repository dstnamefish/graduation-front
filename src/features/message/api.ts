/**
 * 消息管理 API 服务
 * @module api/services/message.service
 */

import request from '@/shared/lib/utils/http';
import type {
  SendMessageRequest,
  GetMessageParams,
  MessageResponse,
  MessageListResponse,
} from '@/types/api';

const BASE_URL = '/message';

class MessageService {
  /** 获取消息分页列表 */
  async fetchMessages(params?: GetMessageParams): Promise<MessageListResponse> {
    return request.get<MessageListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 根据会话获取消息列表 */
  async getMessagesByConversation(conversationId: number): Promise<MessageResponse[]> {
    return request.get<MessageResponse[]>({
      url: `${BASE_URL}/conversation/${conversationId}`,
    });
  }

  /** 获取消息详情 */
  async getMessageById(id: number): Promise<MessageResponse> {
    return request.get<MessageResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 发送消息 */
  async sendMessage(data: SendMessageRequest): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 标记已读 */
  async markAsRead(id: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/read`,
    });
  }

  /** 批量标记已读 */
  async batchMarkAsRead(conversationId: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/conversation/${conversationId}/read-all`,
    });
  }

  /** 撤回消息 */
  async recallMessage(id: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/recall`,
    });
  }

  /** 删除消息 */
  async deleteMessage(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 获取未读消息数量 */
  async getUnreadCount(conversationId: number): Promise<number> {
    return request.get<number>({
      url: `${BASE_URL}/conversation/${conversationId}/unread-count`,
    });
  }
}

export const messageService = new MessageService();
