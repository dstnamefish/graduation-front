/**
 * 库存管理 API 服务
 * @module api/services/inventory.service
 */

import request from '@/utils/http';
import type {
  CreateInventoryRequest,
  UpdateInventoryRequest,
  GetInventoryParams,
  AdjustStockRequest,
  InventoryResponse,
  InventoryListResponse,
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

  /** 获取所有库存 */
  async fetchAllInventories(): Promise<InventoryResponse[]> {
    return request.get<InventoryResponse[]>({
      url: `${BASE_URL}/list`,
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
  async createInventory(data: CreateInventoryRequest): Promise<boolean> {
    return request.post<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 更新库存 */
  async updateInventory(data: UpdateInventoryRequest): Promise<boolean> {
    return request.put<boolean>({
      url: BASE_URL,
      params: data,
    });
  }

  /** 增加库存 */
  async increaseStock(id: number, data: AdjustStockRequest): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/increase`,
      params: data,
    });
  }

  /** 减少库存 */
  async decreaseStock(id: number, data: AdjustStockRequest): Promise<boolean> {
    return request.put<boolean>({
      url: `${BASE_URL}/${id}/decrease`,
      params: data,
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
