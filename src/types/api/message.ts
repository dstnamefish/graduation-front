/**
 * Message module type definitions
 * @module features/message/types
 */

/**
 * Message type
 * @description Message type enum
 */
export enum MessageType {
  TEXT = 0,
  IMAGE = 1,
  FILE = 2,
}

/**
 * Message status
 * @description Message status enum
 */
export enum MessageStatus {
  UNREAD = 0,
  READ = 1,
  RECALLED = 3,
  DELETED = 4,
}

/**
 * Conversation
 * @description Private chat conversation info
 * @property {number} id - Conversation ID
 * @property {number} lastMessageId - Last message ID
 * @property {string} lastMessageContent - Last message content (preview)
 * @property {string} lastMessageTime - Last message time
 * @property {number} unreadCount - Unread message count
 * @property {number} targetUserId - Private chat target user ID
 * @property {string} targetUserName - Private chat target user name
 * @property {string} targetUserAvatar - Private chat target user avatar
 * @property {string} targetUserRole - Private chat target user role
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
 * Message
 * @description Chat message info
 * @property {number} id - Message ID
 * @property {string} content - Message content
 * @property {number} type - Message type: 0-Text, 1-Image, 2-File
 * @property {number} status - Message status: 0-Unread, 1-Read, 3-Recalled, 4-Deleted
 * @property {string} sentAt - Sent time
 * @property {string} readAt - Read time, empty if unread
 * @property {boolean} isRead - Is read
 * @property {number} senderId - Sender ID
 * @property {string} senderAvatar - Sender avatar
 * @property {number} fileId - File ID, when message type is image or file
 * @property {string} fileUrl - File access URL, real file access path assembled cross-module
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
 * Send message form
 * @description Form data for sending message
 * @property {string} content - Message content, text content for text message, file name or description for image/file message
 * @property {number} type - Message type: 0-Text, 1-Image, 2-File
 * @property {number} conversationId - Conversation ID, identifies which conversation the message belongs to
 * @property {number} fileId - File ID, when message type is image or file, associated file record ID
 */
export interface MessageForm {
  content: string;
  type?: number;
  conversationId: number;
  fileId?: number;
}
