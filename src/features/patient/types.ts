/**
 * 患者相关类型定义
 */

/**
 * 患者查询参数
 * @description 用于患者分页查询的请求参数，支持多条件筛选
 * @property {number} status - 患者状态：1-活跃，0-非活跃
 * @property {string} startDate - 登记开始时间，用于按登记时间范围筛选
 * @property {string} endDate - 登记结束时间，用于按登记时间范围筛选
 * @property {string} treatment - 治疗项目名称
 * @property {number} doctorId - 负责医生ID
 * @property {string} query - 综合搜索关键词，按患者姓名、病历号等字段模糊匹配
 * @property {number} page - 页码，默认1
 * @property {number} size - 每页大小，默认10
 */
export interface PatientQuery {
  status?: number;
  startDate?: string;
  endDate?: string;
  treatment?: string;
  doctorId?: number;
  query?: string;
  page?: number;
  size?: number;
}

/**
 * 患者创建表单
 * @description 用于创建新患者档案的表单数据
 * @property {string} firstName - 名字
 * @property {string} lastName - 姓氏
 * @property {string} phone - 手机号码
 * @property {number} gender - 性别：1-男，2-女
 * @property {string} birthday - 出生日期，用于动态计算年龄
 * @property {string} email - 邮箱
 * @property {string} avatar - 头像URL
 * @property {string} patientNo - 患者编号/病历号
 * @property {string} checkInTime - 登记/入住时间，默认为当前时间
 */
export interface PatientForm {
  firstName: string;
  lastName: string;
  phone: string;
  gender: number;
  birthday?: string;
  email?: string;
  avatar?: string;
  patientNo: string;
  checkInTime?: string;
}

/**
 * 患者详情信息
 * @description 用于患者列表页面的详细信息展示
 * @property {number} id - 患者ID
 * @property {string} name - 患者姓名
 * @property {string} avatar - 头像URL
 * @property {string} patientNo - 患者编号/病历号
 * @property {number} age - 年龄
 * @property {string} checkInTime - 登记时间
 * @property {number} status - 患者状态：0-非活跃，1-活跃，2-新患者
 * @property {string} doctorAssigned - 负责医生
 * @property {string} treatment - 治疗项目
 * @property {string} room - 病房信息
 */
export interface Patient {
  id: number;
  name: string;
  avatar: string;
  patientNo: string;
  age: number;
  checkInTime: string;
  status: number;
  doctorAssigned: string;
  treatment: string;
  room: string;
}

/**
 * 处方明细项
 * @description 处方中的药品明细信息
 * @property {number} inventoryItemId - 物资ID（药品），关联inventory_item表的主键
 * @property {string} itemName - 药品名称
 * @property {string} specification - 规格，示例：500mg/片、10ml/支
 * @property {number} quantity - 数量
 * @property {number} unitPrice - 单价
 * @property {number} amount - 金额，通常为quantity * unitPrice
 * @property {string} usage - 用法用量，示例：每日2次，每次1片
 */
export interface PrescriptionItem {
  inventoryItemId: number;
  itemName: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  usage: string;
}

/**
 * 处方创建表单
 * @description 用于创建处方的表单数据
 * @property {number} patientId - 患者ID
 * @property {number} doctorId - 医生ID
 * @property {string} diagnosis - 诊断结果
 * @property {string} prescriptionDate - 开具日期
 * @property {string} expiryDate - 有效期至
 * @property {string} remark - 备注
 * @property {Array<PrescriptionItem>} items - 处方药品明细
 */
export interface PrescriptionForm {
  patientId: number;
  doctorId: number;
  diagnosis: string;
  prescriptionDate?: string;
  expiryDate?: string;
  remark?: string;
  items: PrescriptionItem[];
}

/**
 * 处方详情信息
 * @description 用于返回处方完整信息给前端
 * @property {number} id - 处方ID
 * @property {number} patientId - 患者ID
 * @property {string} patientName - 患者姓名
 * @property {number} doctorId - 医生ID
 * @property {string} doctorName - 医生姓名
 * @property {string} prescriptionNo - 处方编号
 * @property {string} diagnosis - 诊断结果
 * @property {number} status - 处方状态：1-有效，2-已使用，3-过期
 * @property {string} statusName - 状态名称，对应状态的中文描述
 * @property {string} prescriptionDate - 开具日期
 * @property {string} expiryDate - 有效期至
 * @property {string} remark - 备注
 * @property {Array<PrescriptionItem>} items - 处方药品明细
 * @property {number} totalAmount - 总金额，各明细金额的合计
 */
export interface Prescription {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  prescriptionNo: string;
  diagnosis: string;
  status: number;
  statusName: string;
  prescriptionDate: string;
  expiryDate: string;
  remark: string;
  items: PrescriptionItem[];
  totalAmount: number;
}

/**
 * 患者分页响应
 * @description 患者列表的分页响应数据
 * @property {number} total - 总记录数
 * @property {number} size - 每页大小
 * @property {number} current - 当前页码
 * @property {Array<Patient>} records - 患者列表数据
 */
export interface PatientPageResponse {
  total: number;
  size: number;
  current: number;
  records: Patient[];
}

/**
 * 处方列表响应
 * @description 获取患者处方列表的响应数据
 * @property {Array<Prescription>} data - 处方列表
 */
export interface PrescriptionListResponse {
  data: Prescription[];
}

/**
 * 处方详情响应
 * @description 获取处方详情的响应数据
 * @property {Prescription} data - 处方详情
 */
export interface PrescriptionDetailResponse {
  data: Prescription;
}

/**
 * 患者创建响应
 * @description 创建患者档案的响应数据
 * @property {number} data - 生成的患者ID
 */
export interface PatientCreateResponse {
  data: number;
}

/**
 * 处方创建响应
 * @description 创建处方的响应数据
 * @property {number} data - 处方ID
 */
export interface PrescriptionCreateResponse {
  data: number;
}

/**
 * 处方标记响应
 * @description 标记处方为已使用的响应数据
 * @property {boolean} data - 标记是否成功
 */
export interface PrescriptionMarkResponse {
  data: boolean;
}
