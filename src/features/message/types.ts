/**
 * 消息模块类型定义
 */

/**
 * 消息类型
 * @description 消息的类型枚举
 * @enum {number}
 */
export enum MessageType {
  TEXT = 0,  // 文本
  IMAGE = 1, // 图片
  FILE = 2,  // 文件
}

/**
 * 消息状态
 * @description 消息的状态枚举
 * @enum {number}
 */
export enum MessageStatus {
  UNREAD = 0,  // 未读
  READ = 1,    // 已读
  RECALLED = 3, // 撤回
  DELETED = 4,  // 删除
}

/**
 * 会话
 * @description 私聊会话信息
 * @property {number} id - 会话ID
 * @property {number} lastMessageId - 最后一条消息ID
 * @property {string} lastMessageContent - 最后一条消息内容（预览）
 * @property {string} lastMessageTime - 最后一条消息时间
 * @property {number} unreadCount - 未读消息数量
 * @property {number} targetUserId - 私聊对方用户ID
 * @property {string} targetUserName - 私聊对方用户姓名
 * @property {string} targetUserAvatar - 私聊对方用户头像
 * @property {string} targetUserRole - 私聊对方用户角色
 */
export interface Conversation {
  id: number;
  lastMessageId: number;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
  targetUserId: number;
  targetUserName: string;
  targetUserAvatar: string;
  targetUserRole: string;
}

/**
 * 消息
 * @description 聊天消息信息
 * @property {number} id - 消息ID
 * @property {string} content - 消息内容
 * @property {number} type - 消息类型：0-文本，1-图片，2-文件
 * @property {number} status - 消息状态：0-未读，1-已读，3-撤回，4-删除
 * @property {string} sentAt - 发送时间
 * @property {string} readAt - 已读时间，为空表示未读
 * @property {boolean} isRead - 是否已读
 * @property {number} senderId - 发送者ID
 * @property {string} senderAvatar - 发送者头像
 * @property {number} fileId - 文件ID，当消息类型为图片或文件时
 * @property {string} fileUrl - 文件访问URL，跨模块组装的文件真实访问路径
 */
export interface Message {
  id: number;
  content: string;
  type: number;
  status: number;
  sentAt: string;
  readAt?: string;
  isRead: boolean;
  senderId: number;
  senderAvatar: string;
  fileId?: number;
  fileUrl?: string;
}

/**
 * 发送消息表单
 * @description 用于发送消息时提交的表单数据
 * @property {string} content - 消息内容，文本消息时为文本内容，图片/文件消息时为文件名或描述
 * @property {number} type - 消息类型：0-文本，1-图片，2-文件
 * @property {number} conversationId - 会话ID，标识消息所属的会话
 * @property {number} fileId - 文件ID，当消息类型为图片或文件时，关联的文件记录ID
 */
export interface MessageForm {
  content: string;
  type?: number;
  conversationId: number;
  fileId?: number;
}

/**
 * 会话列表响应
 * @description 获取会话列表的响应数据
 * @property {Array<Conversation>} data - 会话列表
 */
export interface ConversationListResponse {
  data: Conversation[];
}

/**
 * 消息列表响应
 * @description 获取消息列表的响应数据
 * @property {Array<Message>} data - 消息列表
 */
export interface MessageListResponse {
  data: Message[];
}

/**
 * 会话响应
 * @description 获取单个会话的响应数据
 * @property {Conversation} data - 会话信息
 */
export interface ConversationResponse {
  data: Conversation;
}

/**
 * 发送消息响应
 * @description 发送消息的响应数据
 * @property {boolean} data - 发送是否成功
 */
export interface MessageSendResponse {
  data: boolean;
}
