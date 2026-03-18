/**
 * 字典服务API调用
 * @module api/dict
 * @description 提供系统字典数据相关的API接口，用于获取各类下拉选项数据
 */

import request from '@/utils/http';

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
 * @description 根据字典类型获取对应的字典项列表，用于下拉选择等场景
 * @param type 字典类型，如状态、性别、角色等
 * @returns 返回字典项列表，每个项包含编码和名称
 */
export function getDict(type: DictType): DictItem[] {
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
