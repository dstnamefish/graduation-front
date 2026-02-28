/**
 * 库存模块类型定义
 * @module types/api/inventory.types
 */

import type { PaginationParams, PaginatedResponse } from './common.types';

/** 库存状态 */
export enum InventoryStatus {
  OUT_OF_STOCK = 0,  // 无库存
  LOW_STOCK = 1,     // 低库存
  SUFFICIENT = 2,    // 充足
}

/** 库存 - 请求参数 */
export interface CreateInventoryRequest {
  name: string;
  imageUrl?: string;
  status?: number;
  quantityStock: number;
  quantityRecorder?: number;
  categoryId?: number;
}

/** 库存 - 更新请求 */
export interface UpdateInventoryRequest extends Partial<CreateInventoryRequest> {
  id: number;
}

/** 库存 - 查询参数 */
export interface GetInventoryParams extends Partial<PaginationParams> {
  name?: string;
  categoryId?: number;
  status?: InventoryStatus;
}

/** 库存 - 库存调整参数 */
export interface AdjustStockRequest {
  quantity: number;
}

/** 库存 - 响应数据 */
export interface InventoryResponse {
  id: number;
  name: string;
  imageUrl?: string;
  status: InventoryStatus;
  quantityStock: number;
  quantityRecorder?: number;
  categoryId?: number;
  categoryName?: string;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
}

/** 库存 - 分页列表 */
export type InventoryListResponse = PaginatedResponse<InventoryResponse>;
