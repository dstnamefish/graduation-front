/**
 * 消息模块API调用
 */

import request from '@/shared/lib/utils/http';
import {
  Conversation,
  Message,
  MessageForm
} from './types';

/**
 * 获取当前用户的私聊列表
 * @returns 私聊会话列表
 */
export function getConversationList() {
  return request.get<Conversation[]>({
    url: '/conversations'
  });
}

/**
 * 发起或打开与某人的私聊
 * @param targetUserId 目标用户ID
 * @returns 私聊会话信息
 */
export function getOrCreatePrivateConversation(targetUserId: number) {
  return request.post<Conversation>({
    url: `/conversations/private/${targetUserId}`
  });
}

/**
 * 获取会话内的聊天记录
 * @param conversationId 会话ID
 * @returns 消息列表
 */
export function getMessagesByConversation(conversationId: number) {
  return request.get<Message[]>({
    url: `/messages/conversation/${conversationId}`
  });
}

/**
 * 发送新消息
 * @param data 消息发送表单数据
 * @returns 发送是否成功
 */
export function sendMessage(data: MessageForm) {
  return request.post<boolean>({
    data,
    url: '/messages'
  });
}
