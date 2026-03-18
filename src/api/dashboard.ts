/**
 * 仪表盘统计模块API调用
 * @module api/dashboard
 * @description 提供仪表盘相关的所有API接口，包括统计数据、趋势图表、待办事项等功能
 */

import request from '@/utils/http';
import { DashboardStats, ChartData, TodoItem } from '@/types/api/dashboard';

/**
 * 获取仪表盘统计数据
 * @returns 仪表盘统计数据
 */
export function getDashboardStats() {
  return request.get<DashboardStats>({
    url: '/dashboard/stats',
  });
}

/**
 * 获取预约趋势图表数据
 * @returns 预约趋势图表数据
 */
export function getAppointmentTrend() {
  return request.get<ChartData>({
    url: '/dashboard/appointment-trend',
  });
}

/**
 * 获取收入趋势图表数据
 * @returns 收入趋势图表数据
 */
export function getRevenueTrend() {
  return request.get<ChartData>({
    url: '/dashboard/revenue-trend',
  });
}

/**
 * 获取今日待办列表
 * @description 用于仪表盘的今日待办模块展示，提醒用户今日需要处理的事项
 * @returns 返回今日待办列表，每个待办包含标题、时间、优先级、类型等信息
 */
export function getTodayTodos() {
  return request.get<TodoItem[]>({
    url: '/dashboard/today-todos',
  });
}