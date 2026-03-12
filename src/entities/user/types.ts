/**
 * 用户实体类型定义
 */

/**
 * 登录表单
 * @description 用于用户登录时提交的表单数据
 * @property {string} username - 登录账号，支持用户名、手机号、邮箱等多种登录方式
 * @property {string} password - 登录密码，明文密码
 * @property {number} sysType - 系统类型：0-超级运营，1-医生端，2-患者端，3-管理后台
 */
export interface LoginForm {
  username: string;
  password: string;
  sysType?: number;
}

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
 * 用户信息
 * @description 用户详细信息，包含角色信息
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
 * 令牌信息
 * @description 登录成功后返回的令牌信息
 * @property {string} accessToken - 访问令牌，用于接口访问鉴权
 * @property {string} refreshToken - 刷新令牌，当访问令牌过期时使用
 * @property {number} expiresIn - 令牌有效期，单位：秒
 * @property {string} realName - 用户真实姓名/昵称，用于前端展示
 * @property {string} avatar - 用户头像 URL
 * @property {string} roleCode - 角色标识，如 ROLE_DOCTOR、ROLE_PATIENT、ROLE_ADMIN
 */
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  realName: string;
  avatar: string;
  roleCode: string;
}

/**
 * 登录响应
 * @description 登录接口的响应数据
 * @property {TokenInfo} data - 令牌信息
 */
export interface LoginResponse {
  data: TokenInfo;
}

/**
 * 用户信息响应
 * @description 获取用户信息的响应数据
 * @property {User} data - 用户信息
 */
export interface UserResponse {
  data: User;
}
