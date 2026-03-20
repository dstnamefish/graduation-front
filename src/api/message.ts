/**
 * 消息模块API调用
 * @module api/message
 * @description 提供消息通讯相关的所有API接口，包括会话列表、聊天记录、消息发送等功能
 */

import request from '@/utils/http';
import {
  Conversation,
  Message,
  MessageForm
} from '@/types/api/message';

/**
 * 获取当前用户的私聊列表
 * @description 用于消息中心或聊天列表页，返回当前用户参与的所有私聊会话，按最后消息时间倒序排列
 * @returns 返回私聊会话列表，每个会话包含对方用户信息、最后一条消息、未读数量等
 */
export function fetchConversationList() {
  return request.get<Conversation[]>({
    url: 'conversations'
  });
}

/**
 * 发起或打开与某人的私聊
 * @description 用于发起私聊或查看聊天记录，如果已存在会话则返回现有会话，否则创建新的私聊会话
 * @param targetUserId 目标用户ID，指定要发起私聊的用户
 * @returns 返回私聊会话信息，包含会话ID、对方用户信息等
 */
export function fetchOrCreatePrivateConversation(targetUserId: number) {
  return request.post<Conversation>({
    url: `conversations/private/${targetUserId}`
  });
}

/**
 * 获取会话内的聊天记录
 * @description 用于聊天详情页，获取指定会话的历史消息，按时间倒序排列，读取后自动将消息标记为已读
 * @param conversationId 会话ID，指定要查询聊天记录的会话
 * @returns 返回消息列表，每条消息包含发送者、内容、时间、是否已读等信息
 */
export function fetchMessages(conversationId: number) {
  return request.get<Message[]>({
    url: `messages/conversation/${conversationId}`
  });
}

/**
 * 发送新消息
 * @description 用于发送聊天消息，支持文本内容和文件附件上传
 * @param data 消息发送表单数据，包含会话ID、消息内容、附件列表等
 * @returns 返回是否发送成功，true表示成功，false表示失败
 */
export function createMessage(data: MessageForm) {
  return request.post<boolean>({
    data,
    url: 'messages'
  });
}
