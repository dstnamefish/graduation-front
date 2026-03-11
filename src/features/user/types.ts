/**
 * 角色信息
 * @property code 角色代码
 * @property name 角色名称
 */
export interface Role {
  code: string;
  name: string;
}

/**
 * 用户信息
 * @property id 用户ID
 * @property username 用户名
 * @property role 角色信息
 * @property realName 真实姓名
 * @property avatar 头像
 */
export interface UserInfo {
  id: number;
  username: string;
  role: Role;
  realName?: string;
  avatar?: string;
}