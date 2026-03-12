/**
 * 科室相关类型定义
 */

/**
 * 科室查询参数
 * @description 用于科室列表查询时的筛选条件
 * @property {string} name - 科室名称，支持模糊搜索
 * @property {number} status - 科室状态：1-启用，0-禁用，默认只查询启用状态的科室
 */
export interface DepartmentQuery {
  name?: string;
  status?: number;
}

/**
 * 科室医生信息
 * @description 用于返回科室下医生列表的展示信息
 * @property {number} doctorId - 医生ID，唯一标识一位医生
 * @property {string} name - 医生全名，已格式化的显示名称
 * @property {string} avatar - 医生头像URL
 * @property {string} specialist - 专科领域，医生在该科室下的专业方向或擅长领域
 */
export interface DepartmentDoctor {
  doctorId: number;
  name: string;
  avatar: string;
  specialist: string;
}

/**
 * 科室卡片信息
 * @description 用于首页或科室列表页展示科室摘要信息
 * @property {number} id - 科室ID，唯一标识一个科室
 * @property {string} name - 科室名称，作为卡片标题显示
 * @property {string} description - 科室描述，简要介绍科室的诊疗范围、特色服务等
 * @property {string} avatar - 科室封面图，科室顶部展示的大图
 * @property {Array<string>} topDoctorAvatars - 医生头像列表，展示该科室下部分医生的头像
 * @property {number} extraDoctorCount - 额外医生数量，科室总医生数减去已显示头像的医生数
 */
export interface DepartmentCard {
  id: number;
  name: string;
  description: string;
  avatar: string;
  topDoctorAvatars: string[];
  extraDoctorCount: number;
}

/**
 * 科室详情信息
 * @description 用于科室详情页展示完整的科室信息
 * @property {number} id - 科室ID，唯一标识一个科室
 * @property {string} name - 科室名称，作为详情页的标题显示
 * @property {string} description - 科室详细介绍，对应页面 "About" 板块的详细内容
 * @property {string} avatar - 科室封面图，详情页顶部展示的大图
 * @property {string} phone - 科室联系电话，用于患者咨询、预约的联系方式
 * @property {number} totalDoctors - 医生团队总人数，科室下所有医生的总数
 * @property {Array<DepartmentDoctor>} teamMembers - 团队成员列表，对应页面底部 "Our Team" 板块的完整医生列表
 */
export interface DepartmentDetail {
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
 * @description 获取科室卡片列表的响应数据
 * @property {Array<DepartmentCard>} data - 科室卡片列表
 */
export interface DepartmentCardListResponse {
  data: DepartmentCard[];
}

/**
 * 科室详情响应
 * @description 获取科室详情的响应数据
 * @property {DepartmentDetail} data - 科室详情信息
 */
export interface DepartmentDetailResponse {
  data: DepartmentDetail;
}
