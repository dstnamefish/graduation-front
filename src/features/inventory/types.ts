/**
 * 库存模块类型定义
 * @module types/api/core/inventory
 */


/** 库存状态 */
export enum InventoryStatus {
  OUT_OF_STOCK = 0,  // 无库存
  LOW_STOCK = 1,     // 低库存
  SUFFICIENT = 2,    // 充足
}

/** 可用性状态 */
export enum AvailabilityStatus {
  AVAILABLE = 'Available',
  LOW = 'Low',
  OUT_OF_STOCK = 'Out of Stock',
}

/** 库存 - 创建请求参数 */
export interface CreateInventoryParams {
  name: string;
  image?: string;
  status?: number;
  stock: number;
  reorder?: number;
  categoryId?: number;
}

/** 库存 - 更新请求参数 */
export interface UpdateInventoryParams extends Partial<CreateInventoryParams> {
  id: number;
}

/** 库存 - 查询参数 */
export interface GetInventoryParams extends Partial<PaginationParams> {
  query?: string;
  category?: string;
  categoryId?: number;
  status?: InventoryStatus;
  availability?: AvailabilityStatus;
}

/** 库存 - 库存调整参数 */
export interface AdjustStockParams {
  quantity: number;
}

/** 库存 - 响应数据 */
export interface InventoryResponse {
  id: number;
  name: string;
  image?: string;
  status: InventoryStatus;
  stock: number;
  reorder?: number;
  categoryId?: number;
  category?: string;
  tenantId: number;
  availability?: AvailabilityStatus;
  createdTime: string;
  updatedTime: string;
}

/** 库存 - 分页列表响应 */
export type InventoryListResponse = PaginatedResponse<InventoryResponse>;

/** 批量操作参数 */
export interface BatchOperationParams {
  ids: number[];
}
