/**
 * API 服务统一导出
 * @module api/core
 */

// 认证相关
export * from './auth';

// 用户相关
export * from './user';

// 菜单相关
export * from './menu';

// 科室相关
export { departmentService, specialtyService } from './department';

// 医生相关
export { doctorService } from './doctor';

// 患者相关
export { patientService } from './patient';

// 预约相关
export { appointmentService } from './appointment';

// 排班相关
export { scheduleService } from './schedule';

// 库存相关
export { inventoryService } from './inventory';

// 发票相关
export { invoiceService } from './invoice';

// 支付相关
export { paymentService } from './payment';

// 消息相关
export { messageService } from './message';

// 会话相关
export { conversationService } from './conversation';
