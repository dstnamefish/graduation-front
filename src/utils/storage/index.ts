/**
 * 存储相关工具函数统一导出
 */

export * from './storage';
export * from './storage-config';
export * from './storage-key-manager';

/**
 * 存储操作工具对象
 * 提供简洁的本地存储操作方法
 */
export const storage = {
  /**
   * 设置存储值
   * @param key 存储键
   * @param value 存储值
   */
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('[Storage] 设置存储失败:', error);
    }
  },

  /**
   * 获取存储值
   * @param key 存储键
   * @returns 存储值，如果不存在则返回null
   */
  get: (key: string): any => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('[Storage] 获取存储失败:', error);
      return null;
    }
  },

  /**
   * 移除存储值
   * @param key 存储键
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[Storage] 移除存储失败:', error);
    }
  },

  /**
   * 清空所有存储
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[Storage] 清空存储失败:', error);
    }
  }
};