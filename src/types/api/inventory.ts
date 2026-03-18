/**
 * Inventory item module type definitions
 * @module features/inventory/types
 */

/**
 * Inventory category
 */
export interface InventoryCategory {
  id: number;
  name: string;
}

/**
 * Inventory item query params
 * @description Request params for item pagination query with multiple filters
 * @property {number} pageNum - Current page number, starts from 1, default 1
 * @property {number} pageSize - Page size, default 10, max 100
 * @property {string[]} columns - Sort field array, supports multi-field sorting
 * @property {string[]} orders - Sort rule array, corresponds to columns, ASC/DESC
 * @property {number} categoryId - Category ID for filtering by item category
 * @property {string} availabilityStatus - Item status, e.g. Normal, Low Stock, Out of Stock
 * @property {string} query - Search keyword for item name, number, etc.
 */
export interface InventoryQuery {
  pageNum?: number;
  pageSize?: number;
  columns?: string[];
  orders?: string[];
  categoryId?: number;
  availabilityStatus?: string;
  query?: string;
}

/**
 * Inventory item creation form
 * @description Form data for creating new item
 * @property {string} name - Item name, required
 * @property {number} categoryId - Category ID, required
 * @property {string} image - Item image URL
 * @property {number} qtyInStock - Initial stock quantity, required, cannot be negative
 * @property {number} qtyInReorder - Reorder point, suggest reorder when stock below this value, default 0
 * @property {number} lowStockThreshold - Low stock warning threshold, default 10
 */
export interface InventoryForm {
  name: string;
  categoryId: number;
  image?: string;
  qtyInStock: number;
  qtyInReorder?: number;
  lowStockThreshold?: number;
}

/**
 * Inventory item basic info
 * @description Query result display for item list page
 * @property {number} id - Item ID
 * @property {string} image - Item image URL
 * @property {string} name - Item name
 * @property {string} categoryName - Category name, from associated query
 * @property {string} availability - Stock status, Available, Low, Out of Stock
 * @property {number} qtyInStock - Current stock quantity
 * @property {number} qtyInReorder - Reorder point
 */
export interface Inventory {
  id: number;
  image: string;
  name: string;
  categoryName: string;
  availability: string;
  qtyInStock: number;
  qtyInReorder: number;
}

/**
 * Inventory item detail
 * @description Complete info for item detail page
 * @property {number} id - Item ID
 * @property {number} tenantId - Tenant ID, multi-tenant isolation
 * @property {number} categoryId - Category ID, foreign key to category table
 * @property {string} name - Item name
 * @property {string} imageUrl - Item image URL
 * @property {number} qtyInStock - Current stock quantity
 * @property {number} qtyInReorder - In-transit/reorder quantity
 * @property {number} lowStockThreshold - Low stock warning threshold
 * @property {number} status - Item status, 0-Disabled, 1-Normal
 * @property {number} version - Optimistic lock version for concurrency control
 * @property {string} createTime - Create time
 * @property {string} updateTime - Update time
 */
export interface InventoryDetail {
  id: number;
  tenantId: number;
  categoryId: number;
  name: string;
  imageUrl: string;
  qtyInStock: number;
  qtyInReorder: number;
  lowStockThreshold: number;
  status: number;
  version: number;
  createTime: string;
  updateTime: string;
}

/**
 * Inventory item pagination response
 * @description Paginated response for item list
 * @property {number} total - Total records
 * @property {number} size - Page size
 * @property {number} current - Current page
 * @property {Array<Inventory>} records - Item list data
 */
export interface InventoryPageResponse {
  total: number;
  size: number;
  current: number;
  records: Inventory[];
}

/**
 * Inventory item creation response
 * @description Response for creating item
 * @property {number} data - Generated item ID
 */
export interface InventoryCreateResponse {
  data: number;
}
