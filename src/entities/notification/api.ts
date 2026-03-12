/**
 * 通知实体API调用
 */

import request from '@/shared/lib/utils/http';
import {
  Notification,
  NotificationQuery
} from './types';

/**
 * 获取通知列表
 * @param params 通知查询参数
 * @returns 通知列表
 */
export function getNotificationList(params: NotificationQuery) {
  return request.get<Notification[]>({
    params,
    url: '/notifications'
  });
}

/**
 * 获取未读通知数量
 * @returns 未读通知数量
 */
export function getUnreadCount() {
  return request.get<number>({
    url: '/notifications/unread-count'
  });
}

/**
 * 标记通知为已读
 * @param id 通知ID
 * @returns 操作结果
 */
export function markAsRead(id: number) {
  return request.put<boolean>({
    url: `/notifications/${id}/read`
  });
}

/**
 * 批量标记通知为已读
 * @returns 操作结果
 */
export function batchMarkAsRead() {
  return request.put<boolean>({
    url: '/notifications/read-all'
  });
}
