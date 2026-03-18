/**
 * Department module type definitions
 * @description Auto-generated, follows frontend architecture guidelines
 * @author dstnamefish
 * @date 2026-03-15
 */

/**
 * 科室查询参数
 * @description 科室列表查询的筛选条件
 * @property name - 科室名称（模糊搜索）
 * @property status - 科室状态：1-启用，0-禁用，默认只查询启用状态的科室
 */
export interface DepartmentQuery {
  name?: string;
  status?: number;
}

/**
 * 科室医生信息
 * @description 科室下医生列表的展示信息，包含医生的基本信息和专业领域
 * @property doctorId - 医生ID，唯一标识一位医生
 * @property name - 医生全名，已格式化的显示名称
 * @property avatar - 医生头像URL
 * @property specialist - 专科领域，医生在该科室下的专业方向
 */
export interface DepartmentDoctor {
  doctorId: number;
  name: string;
  avatar: string;
  specialist: string;
}

/**
 * 科室卡片
 * @description 首页或科室列表页展示的科室摘要信息
 * @property id - 科室ID，唯一标识
 * @property name - 科室名称（当前语言），作为卡片标题显示
 * @property description - 科室描述（当前语言），简要介绍科室的诊疗范围
 * @property avatar - 科室封面图，顶部展示的大图
 * @property topDoctorAvatars - 医生头像列表，最多返回4个头像
 * @property extraDoctorCount - 额外医生数量，用于渲染 "+ X others" 提示
 */
export interface Department {
  id: number;
  name: string;
  description: string;
  avatar: string;
  topDoctorAvatars: string[];
  extraDoctorCount: number;
}

/**
 * 科室卡片类型别名
 * @description 用于列表页展示的科室卡片数据类型
 */
export type DepartmentCard = Department;

/**
 * 科室详情响应
 * @description 科室详情页展示的完整科室信息，包含基本信息、联系方式和完整的医生团队列表
 * @property id - 科室ID，唯一标识
 * @property name - 科室名称，作为详情页标题显示
 * @property description - 科室详细介绍，对应页面 "About" 板块
 * @property avatar - 科室封面图，详情页顶部展示的大图
 * @property phone - 科室联系电话，用于患者咨询、预约
 * @property totalDoctors - 医生团队总人数
 * @property teamMembers - 团队成员列表，对应页面 "Our Team" 板块
 */
export interface DepartmentDetailResponse {
  id: number;
  name: string;
  description: string;
  avatar: string;
  phone: string;
  totalDoctors: number;
  teamMembers: DepartmentDoctor[];
}

/**
 * 科室卡片列表响应
 * @description 科室卡片列表查询的响应数据类型
 */
export type DepartmentCardListResponse = Department[];
