/**
 * 字典服务API调用
 */

import request from '@/shared/lib/utils/http';

/**
 * 字典项
 * @description 字典服务返回的单个字典项
 */
export interface DictItem {
  code: string | number;
  name: string;
}

/**
 * 字典类型
 * @description 系统中支持的字典类型
 */
export enum DictType {
  STATUS = 'status',
  GENDER = 'gender',
  SYS_TYPE = 'sysType',
  ROLE = 'role'
}

/**
 * 获取字典数据
 * @param type 字典类型
 * @returns 字典项列表
 */
export function getDict(type: DictType): DictItem[] {
  // 这里根据字典类型返回对应的枚举数据
  // 实际项目中，这些数据可能来自后端API
  switch (type) {
    case DictType.STATUS:
      return [
        { code: 1, name: '启用' },
        { code: 0, name: '禁用' },
        { code: -1, name: '删除' }
      ];
    case DictType.GENDER:
      return [
        { code: 0, name: '未知' },
        { code: 1, name: '男' },
        { code: 2, name: '女' }
      ];
    case DictType.SYS_TYPE:
      return [
        { code: 0, name: '超级运营' },
        { code: 1, name: '医生端' },
        { code: 2, name: '患者端' },
        { code: 3, name: '管理后台' }
      ];
    case DictType.ROLE:
      return [
        { code: 'ROLE_ADMIN', name: '管理员' },
        { code: 'ROLE_DOCTOR', name: '医生' },
        { code: 'ROLE_PATIENT', name: '患者' },
        { code: 'ROLE_STAFF', name: '工作人员' }
      ];
    default:
      return [];
  }
}
