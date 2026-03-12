/**
 * 仪表盘统计模块API调用
 */

import request from '@/shared/lib/utils/http';
import {
  DashboardStats,
  ChartData,
  TodoItem
} from './types';

/**
 * 获取仪表盘统计数据
 * @returns 仪表盘统计数据
 */
export function getDashboardStats() {
  return request.get<DashboardStats>({
    url: '/dashboard/stats'
  });
}

/**
 * 获取预约趋势图表数据
 * @returns 预约趋势图表数据
 */
export function getAppointmentTrend() {
  return request.get<ChartData>({
    url: '/dashboard/appointment-trend'
  });
}

/**
 * 获取收入趋势图表数据
 * @returns 收入趋势图表数据
 */
export function getRevenueTrend() {
  return request.get<ChartData>({
    url: '/dashboard/revenue-trend'
  });
}

/**
 * 获取今日待办列表
 * @returns 今日待办列表
 */
export function getTodayTodos() {
  return request.get<TodoItem[]>({
    url: '/dashboard/today-todos'
  });
}
