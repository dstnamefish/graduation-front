/**
 * 预约相关类型定义
 */

/**
 * 预约基础实体
 * @description 预约记录的核心数据模型，包含预约的基本信息和状态
 * @property {number} id - 预约ID，记录的唯一标识
 * @property {string} treatmentName - 诊疗项目/就诊目的
 * @property {string} doctorName - 医生姓名
 * @property {string} patientName - 患者姓名
 * @property {string} appointmentDate - 预约日期，格式：yyyy-MM-dd
 * @property {string} appointmentTime - 预约时间，格式：HH:mm
 * @property {number} status - 预约状态码：1-待就诊、2-已完成、3-已取消、4-已爽约
 * @property {string} statusText - 预约状态文本，直接用于前端展示
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
 * 预约创建表单
 * @description 用于前端创建预约时提交的表单数据
 * @property {number} patientId - 患者ID，关联到患者表的主键
 * @property {number} doctorId - 医生ID，关联到医生表的主键
 * @property {number} departmentId - 科室ID，关联到科室表的主键
 * @property {string} appointmentDate - 预约日期，格式：yyyy-MM-dd
 * @property {string} appointmentTime - 预约时间，格式：HH:mm:ss
 * @property {number} appointmentSource - 预约来源：0-微信小程序（默认），1-APP，2-网页端，3-后台管理系统，4-电话预约
 * @property {string} remark - 备注信息，用户填写的附加说明
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
 * @description 用于从日程视图快速添加预约时提交的表单数据
 * @property {number} patientId - 患者ID，关联patient表
 * @property {number} doctorId - 医生ID，关联doctor表
 * @property {number} departmentId - 科室ID，关联department表
 * @property {string} appointmentDate - 预约日期，格式：yyyy-MM-dd
 * @property {string} appointmentTime - 预约时间，格式：HH:mm:ss
 */
export interface AppointmentAddForm {
  patientId: number;
  doctorId: number;
  departmentId: number;
  appointmentDate: string;
  appointmentTime: string;
}

/**
 * 预约分页查询参数
 * @description 用于预约管理后台的分页查询请求
 * @property {string} query - 综合搜索关键词，用于按患者姓名、医生姓名、预约号等模糊匹配
 * @property {number} status - 预约状态筛选：1-待就诊、2-已完成、3-已取消
 * @property {string} dateFilter - 日期筛选：today, week, month, custom 或具体日期范围字符串
 * @property {number} page - 页码，默认1
 * @property {number} size - 每页大小，默认10
 */
export interface AppointmentQuery {
  query?: string;
  status?: number;
  dateFilter?: string;
  page?: number;
  size?: number;
}

/**
 * 日程查询参数
 * @description 用于日程视图的复杂查询，支持多维度筛选
 * @property {string} startDate - 日历视图开始日期，格式：yyyy-MM-dd
 * @property {string} endDate - 日历视图结束日期，格式：yyyy-MM-dd
 * @property {number} doctorId - 医生ID筛选
 * @property {number} departmentId - 科室ID筛选
 * @property {number} status - 预约状态筛选：1-待就诊，2-已完成，3-已取消，4-已爽约
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
 * @description 用于日程视图中的日历事件展示
 * @property {number} id - 预约ID
 * @property {string} date - 预约日期，格式：yyyy-MM-dd
 * @property {string} time - 预约时间，格式：HH:MM AM/PM
 * @property {string} doctorName - 医生姓名
 * @property {string} description - 事件描述，拼接格式：症状 + 患者姓名
 * @property {string} colorTheme - 动态颜色主题：blue（蓝色）、green（绿色）、purple（紫色）
 * @property {number} status - 预约状态：1-待就诊，2-已完成，3-已取消，4-已爽约
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
 * 预约分页响应
 * @description 预约列表的分页响应数据
 * @property {number} total - 总记录数
 * @property {number} size - 每页大小
 * @property {number} current - 当前页码
 * @property {Array<Appointment>} records - 预约列表数据
 */
export interface AppointmentPageResponse {
  total: number;
  size: number;
  current: number;
  records: Appointment[];
}

/**
 * 预约取消参数
 * @description 用于取消预约的请求参数
 * @property {number} id - 预约ID
 * @property {string} reason - 取消原因（可选）
 */
export interface AppointmentCancelParams {
  id: number;
  reason?: string;
}

/**
 * 患者预约查询参数
 * @description 用于查询患者预约列表的请求参数
 * @property {number} patientId - 患者ID
 * @property {boolean} isUpcoming - true-待进行预约，false-历史预约
 */
export interface PatientAppointmentQuery {
  patientId: number;
  isUpcoming?: boolean;
}