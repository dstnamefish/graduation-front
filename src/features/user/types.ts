/**
 * 用户相关类型定义
 */

/**
 * 角色信息
 * @description 用户关联的角色信息
 * @property {number} id - 角色ID
 * @property {string} name - 角色名称
 * @property {string} code - 角色代码
 * @property {string} description - 角色描述
 */
export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
}

/**
 * 用户注册表单
 * @description 用于用户注册或新增时提交的个人信息和角色信息
 * @property {string} firstName - 名字
 * @property {string} lastName - 姓氏
 * @property {string} phone - 手机号码
 * @property {string} email - 电子邮箱
 * @property {number} gender - 性别：0-未知，1-男，2-女
 * @property {string} birthday - 出生日期
 * @property {string} address - 联系地址
 * @property {number} roleId - 角色ID
 */
export interface UserForm {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  gender: number;
  birthday?: string;
  address?: string;
  roleId: number;
}

/**
 * 用户详情信息
 * @description 用于返回用户详情时，同时包含用户基本信息和关联的角色信息
 * @property {number} id - 用户ID
 * @property {string} nickName - 用户昵称
 * @property {string} avatar - 头像URL
 * @property {string} email - 电子邮箱
 * @property {string} phone - 手机号码
 * @property {number} status - 用户状态：1-正常，0-禁用，-1-删除
 * @property {Role} role - 关联的角色信息
 */
export interface User {
  id: number;
  nickName: string;
  avatar: string;
  email: string;
  phone: string;
  status: number;
  role: Role;
}

/**
 * 用户注册响应
 * @description 新增用户的响应数据
 * @property {number} data - 新增用户的ID
 */
export interface UserCreateResponse {
  data: number;
}

/**
 * 用户详情响应
 * @description 获取用户详情的响应数据
 * @property {User} data - 用户详情信息
 */
export interface UserDetailResponse {
  data: User;
}

/**
 * 角色分配响应
 * @description 为用户分配角色的响应数据
 * @property {boolean} data - 操作结果
 */
export interface RoleAssignResponse {
  data: boolean;
}
