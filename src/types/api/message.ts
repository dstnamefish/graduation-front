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
  VOICE = 2,
  FILE = 3,
}

/**
 * Message status
 * @description Message status enum
 */
export enum MessageStatus {
  UNREAD = 0,
  READ = 1,
  SENT = 2,
  RECALLED = 3,
  DELETED = 4,
  FAILED = 5,
}

/**
 * Attachment
 * @description Message attachment info
 */
export interface Attachment {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
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
 * @property {number} type - Message type: 0-Text, 1-Image, 2-Voice, 3-File
 * @property {number} status - Message status: 0-Unread, 1-Read, 2-Sent, 3-Recalled, 4-Deleted, 5-Failed
 * @property {string} sentAt - Sent time
 * @property {boolean} isRead - Is read
 * @property {number} senderId - Sender ID
 * @property {number} conversationId - Conversation ID
 * @property {number} fileId - File ID, when message type is image or file
 * @property {string} senderAvatar - Sender avatar
 * @property {Attachment[]} attachments - Attachment list
 */
export interface Message {
  id: number;
  content: string;
  type: number;
  status: number;
  sentAt: string;
  isRead: boolean;
  senderId: number;
  conversationId: number;
  fileId?: number;
  senderAvatar: string;
  attachments?: Attachment[];
}

/**
 * Send message form
 * @description Form data for sending message
 * @property {string} content - Message content, text content for text message, file name or description for image/file message
 * @property {number} type - Message type: 0-Text, 1-Image, 2-Voice, 3-File
 * @property {number} conversationId - Conversation ID, identifies which conversation the message belongs to
 * @property {number} fileId - File ID, when message type is image or file, associated file record ID
 */
export interface MessageForm {
  content: string;
  type?: number;
  conversationId: number;
  fileId?: number;
}
