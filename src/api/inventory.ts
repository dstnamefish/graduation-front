/**
 * 库存物品模块API调用
 * @module api/inventory
 * @description 提供库存物品管理相关的所有API接口，包括物品列表查询、分类查询、物品新增等功能
 */

import request from '@/utils/http';
import {
  InventoryQuery,
  InventoryForm,
  InventoryPageResponse,
  InventoryCategory
} from '@/types/inventory';

/**
 * 分页查询物品列表
 * @description 用于库存管理页面的表格展示，支持按名称、分类、库存状态等多条件筛选
 * @param params 物品查询参数，包含页码、每页条数、搜索关键词、分类ID、库存状态等筛选条件
 * @returns 返回物品分页数据，包含物品列表、总记录数、当前页码等信息
 */
export function fetchPage(params?: InventoryQuery) {
  return request.get<InventoryPageResponse>({
    params,
    url: 'inventories/page'
  });
}

/**
 * 获取库存分类列表
 * @description 用于库存分类筛选下拉框或分类管理，获取系统中所有物品分类
 * @returns 返回分类列表，每个分类包含ID、名称、描述等信息
 */
export function fetchCategories() {
  return request.get<InventoryCategory[]>({
    url: 'inventories/categories'
  });
}

/**
 * 新增物品
 * @description 用于录入新物品信息，添加到库存管理系统中
 * @param data 新增物品表单数据，包含物品名称、分类、规格、单价、库存数量等信息
 * @returns 返回新创建的物品ID，可用于后续操作或跳转详情
 */
export function create(data: InventoryForm) {
  return request.post<number>({
    data,
    url: 'inventories/add'
  });
}