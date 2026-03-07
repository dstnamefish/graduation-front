/**
 * 库存管理 API 服务
 * @module api/services/inventory.service
 */

import request from '@/utils/http';
import type {
  CreateInventoryParams,
  UpdateInventoryParams,
  GetInventoryParams,
  AdjustStockParams,
  InventoryResponse,
  InventoryListResponse,
  BatchOperationParams,
} from '@/types/api';

const BASE_URL = '/api/inventory';

class InventoryService {
  /** 获取库存分页列表 */
  async fetchInventories(params?: GetInventoryParams): Promise<InventoryListResponse> {
    return request.get<InventoryListResponse>({
      url: `${BASE_URL}/page`,
      params,
    });
  }

  /** 根据查询参数分页查询库存列表 */
  async searchInventories(pageParams: { page: number; pageSize: number }, queryParams: GetInventoryParams): Promise<InventoryListResponse> {
    return request.post<InventoryListResponse>({
      url: `${BASE_URL}/page`,
      params: { ...pageParams, ...queryParams },
    });
  }

  /** 获取所有库存 */
  async fetchAllInventories(): Promise<InventoryResponse[]> {
    return request.get<InventoryResponse[]>({
      url: `${BASE_URL}/list`,
    });
  }

  /** 获取所有分类 */
  async fetchCategories(): Promise<string[]> {
    return request.get<string[]>({
      url: `${BASE_URL}/categories`,
    });
  }

  /** 获取库存详情 */
  async getInventoryById(id: number): Promise<InventoryResponse> {
    return request.get<InventoryResponse>({
      url: `${BASE_URL}/${id}`,
    });
  }

  /** 获取低库存物品列表 */
  async getLowStockList(): Promise<InventoryResponse[]> {
    return request.get<InventoryResponse[]>({
      url: `${BASE_URL}/low-stock`,
    });
  }

  /** 创建库存 */
  async createInventory(data: CreateInventoryParams): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 更新库存 */
  async updateInventory(data: UpdateInventoryParams): Promise<boolean> {
    return request.put<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 增加库存 */
  async increaseStock(id: number, quantity: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/increase`,
      params: { quantity },
    });
  }

  /** 减少库存 */
  async decreaseStock(id: number, quantity: number): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/decrease`,
      params: { quantity },
    });
  }

  /** 批量删除库存 */
  async batchDelete(ids: number[]): Promise<boolean> {
    return request.post<boolean>({
      url: `${BASE_URL}/batch-delete`,
      params: ids,
    });
  }

  /** 批量补货 */
  async batchReorder(ids: number[]): Promise<boolean> {
    return request.post<boolean>({
      url: `${BASE_URL}/batch-reorder`,
      params: ids,
    });
  }

  /** 删除库存 */
  async deleteInventory(id: number): Promise<boolean> {
    return request.del<boolean>({
      url: `${BASE_URL}/${id}`,
    });
  }
}

export const inventoryService = new InventoryService();
