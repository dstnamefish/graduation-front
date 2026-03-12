/**
 * 认证相关类型定义
 */

/**
 * 登录表单
 * @description 用于用户登录时提交的表单数据
 * @property {string} username - 登录账号，支持用户名、手机号、邮箱等多种登录方式
 * @property {string} password - 登录密码，明文密码
 * @property {number} sysType - 系统类型：0-超级运营，1-医生端，2-患者端，3-管理后台
 */
export interface AuthForm {
  username: string;
  password: string;
  sysType?: number;
}

/**
 * 修改密码表单
 * @description 用于用户登录状态下修改个人密码的表单数据
 * @property {string} oldPassword - 原密码，用于验证用户身份
 * @property {string} newPassword - 新密码，用户设置的新密码
 */
export interface AuthUpdatePasswordForm {
  oldPassword: string;
  newPassword: string;
}

/**
 * 发送验证码表单
 * @description 用于向用户手机或邮箱发送验证码的表单数据
 * @property {string} target - 目标账号，接收验证码的手机号或邮箱地址
 * @property {string} type - 验证码类型：EMAIL-发送到邮箱，PHONE-发送到手机
 */
export interface AuthSendCodeForm {
  target: string;
  type: string;
}

/**
 * 重置密码表单
 * @description 用于用户忘记密码时，通过验证码重置密码的表单数据
 * @property {string} target - 目标账号，接收验证码的手机号或邮箱地址
 * @property {string} code - 验证码，用户收到的短信或邮件验证码
 * @property {string} newPassword - 新密码，用户设置的新密码
 * @property {string} type - 验证码类型：EMAIL-邮箱验证码，PHONE-短信验证码
 */
export interface AuthResetPasswordForm {
  target: string;
  code: string;
  newPassword: string;
  type?: string;
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
 * 验证码信息
 * @description 获取图形验证码时返回的验证码信息
 * @property {string} captchaKey - 验证码唯一键，用于在提交登录/注册请求时关联本次验证码
 * @property {string} captchaImg - 验证码图片 Base64 编码，前端可直接用于 img 标签的 src 属性显示
 */
export interface Captcha {
  captchaKey: string;
  captchaImg: string;
}

/**
 * 登录响应
 * @description 登录接口的响应数据
 * @property {TokenInfo} data - 令牌信息
 */
export interface AuthLoginResponse {
  data: TokenInfo;
}

/**
 * 验证码响应
 * @description 获取验证码接口的响应数据
 * @property {Captcha} data - 验证码信息
 */
export interface AuthCaptchaResponse {
  data: Captcha;
}
