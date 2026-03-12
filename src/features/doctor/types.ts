/**
 * 医生相关类型定义
 */

/**
 * 医生查询参数
 * @description 用于医生分页查询的请求参数，支持多条件筛选
 * @property {string} query - 综合搜索关键词，可匹配医生姓名、工号、职称等
 * @property {number} departmentId - 科室ID，用于筛选指定科室的医生
 * @property {number} specialtyId - 专业领域ID，用于筛选具有特定专业特长的医生
 * @property {number} status - 医生状态：1-在职，0-离职，-1-删除
 * @property {number} page - 页码，默认1
 * @property {number} size - 每页大小，默认10
 */
export interface DoctorQuery {
  query?: string;
  departmentId?: number;
  specialtyId?: number;
  status?: number;
  page?: number;
  size?: number;
}

/**
 * 医生基本信息
 * @description 用于医生列表页面的查询结果展示
 * @property {number} id - 医生ID
 * @property {string} name - 医生姓名
 * @property {string} avatar - 头像URL
 * @property {string} doctorNo - 医生编号，医院内部的唯一工号
 * @property {string} departmentName - 科室名称
 * @property {string} specialist - 专业领域/职称，示例：主任医师、心脏病学专家
 * @property {number} totalPatients - 累计患者数
 * @property {number} todayAppointments - 今日预约数
 * @property {string} availabilityStatus - 可用状态，示例：可预约、今日已满、休假中
 */
export interface Doctor {
  id: number;
  name: string;
  avatar: string;
  doctorNo: string;
  departmentName: string;
  specialist: string;
  totalPatients: number;
  todayAppointments: number;
  availabilityStatus: string;
}

/**
 * 医生个人信息
 * @description 展示医生的个人资料和专业信息
 * @property {number} id - 医生ID
 * @property {string} name - 医生姓名
 * @property {string} doctorNo - 医生编号，医院内部的唯一工号
 * @property {string} specialist - 专业领域/职称，示例：主任医师、心脏病学专家
 * @property {string} bio - 个人简介，医生的专业背景、擅长领域、教育经历等
 * @property {string} phone - 联系电话
 * @property {string} email - 电子邮箱
 * @property {string} address - 联系地址，诊室位置或门诊地址
 * @property {string} availabilityStatus - 可用状态，示例：可预约、今日已满、休假中
 */
export interface DoctorProfile {
  id: number;
  name: string;
  doctorNo: string;
  specialist: string;
  bio: string;
  phone: string;
  email: string;
  address: string;
  availabilityStatus: string;
}

/**
 * 医生工作经历
 * @description 展示医生的职业履历和工作经验
 * @property {string} position - 职位/职称，示例：主任医师、科室主任
 * @property {string} hospitalName - 医院/机构名称
 * @property {string} employmentType - 聘用类型，全职/兼职/客座/顾问等
 * @property {string} dateRange - 工作时间范围，格式：yyyy-MM - yyyy-MM 或 yyyy - 至今
 */
export interface WorkExperience {
  position: string;
  hospitalName: string;
  employmentType: string;
  dateRange: string;
}

/**
 * 患者评价
 * @description 患者对医生的评价反馈
 * @property {number} id - 评价ID
 * @property {number} score - 评分，1-5分
 * @property {string} content - 评价内容
 * @property {string} patientName - 患者姓名
 * @property {string} createTime - 创建时间
 */
export interface Feedback {
  id: number;
  score: number;
  content: string;
  patientName: string;
  createTime: string;
}

/**
 * 预约日程
 * @description 医生的预约安排
 * @property {number} id - 预约ID
 * @property {string} patientName - 患者姓名
 * @property {string} appointmentTime - 预约时间
 * @property {string} treatmentName - 诊疗项目
 * @property {number} status - 预约状态
 */
export interface AppointmentSchedule {
  id: number;
  patientName: string;
  appointmentTime: string;
  treatmentName: string;
  status: number;
}

/**
 * 医生仪表盘数据
 * @description 医生个人主页/仪表盘页面的所有展示数据
 * @property {DoctorProfile} profile - 医生个人信息
 * @property {number} totalPatients - 累计患者数
 * @property {number} totalAppointments - 累计预约数
 * @property {Array<WorkExperience>} workExperiences - 工作经历列表
 * @property {Array<Feedback>} feedbacks - 患者评价列表
 * @property {Array<AppointmentSchedule>} todaySchedules - 今日日程安排
 */
export interface DoctorDashboard {
  profile: DoctorProfile;
  totalPatients: number;
  totalAppointments: number;
  workExperiences: WorkExperience[];
  feedbacks: Feedback[];
  todaySchedules: AppointmentSchedule[];
}

/**
 * 医生分页响应
 * @description 医生列表的分页响应数据
 * @property {number} total - 总记录数
 * @property {number} size - 每页大小
 * @property {number} current - 当前页码
 * @property {Array<Doctor>} records - 医生列表数据
 */
export interface DoctorPageResponse {
  total: number;
  size: number;
  current: number;
  records: Doctor[];
}

/**
 * 医生仪表盘响应
 * @description 获取医生仪表盘数据的响应数据
 * @property {DoctorDashboard} data - 医生仪表盘数据
 */
export interface DoctorDashboardResponse {
  data: DoctorDashboard;
}
