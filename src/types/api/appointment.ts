/**
 * Appointment Module Type Definitions
 * @module types/api/core/appointment
 * @description 预约模块相关类型定义，严格遵循前端架构规范
 */

/**
 * 预约状态枚举
 * 1-待就诊(Pending)，2-已完成(Completed)，3-已取消(Cancelled)
 */
export enum AppointmentStatus {
  PENDING = 1,
  CONFIRMED = 2,
  CANCELLED = 3,
}

/**
 * 签到状态枚举
 * 0-未签到，1-已签到
 */
export enum CheckInStatus {
  UNCHECKED = 0,
  CHECKED_IN = 1,
}

/**
 * 叫号状态枚举
 * 0-未叫号，1-已叫号，2-已过号
 */
export enum CallStatus {
  WAITING = 0,
  CALLED = 1,
  MISSED = 2,
}

/**
 * 预约来源枚举
 * 0-微信小程序，1-APP，2-网页端，3-后台管理系统，4-电话预约
 */
export enum AppointmentSource {
  MINI_PROGRAM = 0,
  APP = 1,
  WEB = 2,
  SYSTEM = 3,
  PHONE = 4,
}

/**
 * 预约基础实体
 * @description 用于预约列表展示的核心数据模型
 * @property id - 预约ID，唯一标识
 * @property treatmentName - 诊疗项目/就诊目的
 * @property doctorName - 接诊医生姓名
 * @property patientName - 预约患者姓名
 * @property appointmentDate - 预约日期，ISO格式：yyyy-MM-dd
 * @property appointmentTime - 预约时间，ISO格式：HH:mm:ss
 * @property status - 预约状态码：1-待就诊，2-已完成，3-已取消，4-已爽约
 * @property statusText - 预约状态文本，直接用于前端展示
 */
export interface Appointment {
  id: number;
  treatmentName: string;
  doctorName: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: number;
  statusText: string;
}

/**
 * 预约分页查询参数
 * @description 用于预约管理后台的分页查询请求
 * @property query - 综合搜索关键字，用于按患者姓名、医生姓名、预约号等模糊匹配
 * @property status - 预约状态筛选：1-待就诊，2-已完成，3-已取消
 * @property dateFilter - 日期筛选：today, week, month, custom 或日期范围字符串
 * @property pageNum - 页码，默认1
 * @property pageSize - 每页条数，默认10
 */
export interface AppointmentQuery {
  query?: string;
  status?: number;
  dateFilter?: string;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 预约创建表单
 * @description 用于创建预约时提交的表单数据
 * @property patientId - 患者ID，关联患者表主键
 * @property doctorId - 医生ID，关联医生表主键
 * @property departmentId - 科室ID，关联科室表主键
 * @property appointmentDate - 预约日期，格式：yyyy-MM-dd
 * @property appointmentTime - 预约时间，格式：HH:mm:ss
 * @property appointmentSource - 预约来源：0-微信小程序(默认)，1-APP，2-网页端，3-后台管理系统，4-电话预约
 * @property remark - 备注信息，用户填写的附加说明
 */
export interface AppointmentForm {
  patientId: number;
  doctorId: number;
  departmentId: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentSource?: number;
  remark?: string;
}

/**
 * 预约快速添加表单
 * @description 用于从日程视图快速添加预约时提交的数据
 * @property patientId - 患者ID，关联患者表主键
 * @property doctorId - 医生ID，关联医生表主键
 * @property departmentId - 科室ID，关联科室表主键
 * @property appointmentDate - 预约日期，格式：yyyy-MM-dd
 * @property appointmentTime - 预约时间，格式：HH:mm:ss
 */
export interface AppointmentAddForm {
  patientId: number;
  doctorId: number;
  departmentId: number;
  appointmentDate: string;
  appointmentTime: string;
}

/**
 * 日程查询参数
 * @description 用于日程视图的复杂查询，支持多维度筛选
 * @property startDate - 日历视图开始日期，格式：yyyy-MM-dd
 * @property endDate - 日历视图结束日期，格式：yyyy-MM-dd
 * @property doctorId - 医生ID筛选
 * @property departmentId - 科室ID筛选
 * @property status - 预约状态筛选：1-待就诊，2-已完成，3-已取消，4-已爽约
 */
export interface AgendaQuery {
  startDate: string;
  endDate: string;
  doctorId?: number;
  departmentId?: number;
  status?: number;
}

/**
 * 日程事件
 * @description 用于日历视图中的事件展示
 * @property id - 预约ID
 * @property date - 预约日期，格式：yyyy-MM-dd
 * @property time - 预约时间，格式：HH:MM AM/PM
 * @property doctorName - 医生姓名
 * @property description - 事件描述，格式：症状 + 患者姓名
 * @property colorTheme - 动态颜色主题：blue, green, purple
 * @property status - 预约状态：1-待就诊，2-已完成，3-已取消，4-已爽约
 */
export interface AgendaEvent {
  id: number;
  date: string;
  time: string;
  doctorName: string;
  description: string;
  colorTheme: string;
  status: number;
}

/**
 * 预约取消参数
 * @description 用于取消预约时传递的参数
 * @property id - 预约ID
 * @property reason - 取消原因（可选）
 */
export interface AppointmentCancelParams {
  id: number;
  reason?: string;
}

/**
 * 患者预约查询参数
 * @description 用于查询指定患者的预约列表
 * @property patientId - 患者ID
 * @property isUpcoming - true-待进行预约，false-历史预约
 */
export interface PatientAppointmentQuery {
  patientId: number;
  isUpcoming?: boolean;
}

/**
 * 预约状态统计
 * @description 用于展示各状态预约的数量统计
 * @property status - 预约状态码：1-待就诊，2-已完成，3-已取消
 * @property count - 该状态的预约数量
 */
export interface AppointmentStatusCount {
  status: number;
  count: number;
}

/**
 * 预约分页响应
 * @description 分页查询预约列表的响应数据结构
 * @property total - 总记录数
 * @property size - 每页条数
 * @property current - 当前页码
 * @property records - 预约列表数据
 */
export interface AppointmentPageResponse {
  total: number;
  size: number;
  current: number;
  records: Appointment[];
}

/**
 * 日程事件列表响应
 * @description 日程视图查询的响应数据类型
 */
export type AgendaEventListResponse = AgendaEvent[];

/**
 * 预约状态统计列表响应
 * @description 按状态统计预约数量的响应数据类型
 */
export type AppointmentStatusCountListResponse = AppointmentStatusCount[];
