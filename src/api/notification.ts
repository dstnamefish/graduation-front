/**
 * 通知模块API调用
 * @module api/notification
 * @description 提供系统通知相关的所有API接口，包括通知列表查询、未读数量、标记已读等功能
 */

import request from '@/utils/http';
import {
  Notification,
  NotificationQuery
} from './types';

/**
 * 获取通知列表
 * @description 用于通知中心或消息提醒，获取当前用户的通知列表，支持按类型、状态筛选
 * @param params 通知查询参数，包含页码、每页条数、通知类型、已读状态等筛选条件
 * @returns 返回通知列表，每个通知包含标题、内容、类型、创建时间、是否已读等信息
 */
export function getNotificationList(params: NotificationQuery) {
  return request.get<Notification[]>({
    params,
    url: '/notifications'
  });
}

/**
 * 获取未读通知数量
 * @description 用于顶部导航栏的消息提醒角标，显示当前用户的未读通知数量
 * @returns 返回未读通知数量
 */
export function getUnreadCount() {
  return request.get<number>({
    url: '/notifications/unread-count'
  });
}

/**
 * 标记通知为已读
 * @description 用于点击通知后将其标记为已读状态，更新未读数量
 * @param id 通知ID，指定要标记为已读的通知
 * @returns 返回是否标记成功，true表示成功，false表示失败
 */
export function markAsRead(id: number) {
  return request.put<boolean>({
    url: `/notifications/${id}/read`
  });
}

/**
 * 批量标记通知为已读
 * @description 用于一键清空未读，将当前用户所有通知标记为已读状态
 * @returns 返回是否全部标记成功
 */
export function batchMarkAsRead() {
  return request.put<boolean>({
    url: '/notifications/read-all'
  });
}
