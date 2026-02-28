/**
 * API 服务统一导出
 * @module api/services
 */

// 科室服务
export { departmentService, specialtyService } from './department.service';

// 医生服务
export { doctorService } from './doctor.service';

// 患者服务
export { patientService } from './patient.service';

// 预约服务
export { appointmentService } from './appointment.service';

// 排班服务
export { scheduleService } from './schedule.service';

// 库存服务
export { inventoryService } from './inventory.service';

// 发票服务
export { invoiceService } from './invoice.service';

// 支付服务
export { paymentService } from './payment.service';

// 消息服务
export { messageService } from './message.service';

// 会话服务
export { conversationService } from './conversation.service';
