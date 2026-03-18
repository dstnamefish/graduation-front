/**
 * Authentication related type definitions
 */

/**
 * Login form
 * @description Form data for user login
 * @property {string} username - Login account, supports username, phone, email
 * @property {string} password - Login password, plain text
 * @property {number} sysType - System type: 0-Super Admin, 1-Doctor, 2-Patient, 3-Admin
 */
export interface AuthForm {
  username: string;
  password: string;
  sysType?: number;
}

/**
 * Update password form
 * @description Form data for updating password while logged in
 * @property {string} oldPassword - Old password for verification
 * @property {string} newPassword - New password
 */
export interface AuthUpdatePasswordForm {
  oldPassword: string;
  newPassword: string;
}

/**
 * Send verification code form
 * @description Form data for sending verification code to phone or email
 * @property {string} target - Target account, phone number or email address
 * @property {string} type - Verification code type: EMAIL, PHONE
 */
export interface AuthSendCodeForm {
  target: string;
  type: string;
}

/**
 * Reset password form
 * @description Form data for resetting password via verification code
 * @property {string} target - Target account, phone number or email address
 * @property {string} code - Verification code received
 * @property {string} newPassword - New password
 * @property {string} type - Verification code type: EMAIL, PHONE
 */
export interface AuthResetPasswordForm {
  target: string;
  code: string;
  newPassword: string;
  type?: string;
}

/**
 * Token info
 * @description Token info returned after successful login
 * @property {string} accessToken - Access token for API authentication
 * @property {string} refreshToken - Refresh token for renewing access token
 * @property {number} expiresIn - Token validity period in seconds
 * @property {string} realName - User real name/nickname for frontend display
 * @property {string} avatar - User avatar URL
 * @property {string} roleCode - Role code, e.g. ROLE_DOCTOR, ROLE_PATIENT, ROLE_ADMIN
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
 * Captcha info
 * @description Captcha info returned when getting image captcha
 * @property {string} captchaKey - Captcha unique key for login/register request association
 * @property {string} captchaImg - Captcha image Base64 encoded, can be used directly in img src
 */
export interface Captcha {
  captchaKey: string;
  captchaImg: string;
}

/**
 * Login response
 * @description Login API response data
 * @property {TokenInfo} data - Token info
 */
export interface AuthLoginResponse {
  data: TokenInfo;
}

/**
 * Captcha response
 * @description Get captcha API response data
 * @property {Captcha} data - Captcha info
 */
export interface AuthCaptchaResponse {
  data: Captcha;
}
