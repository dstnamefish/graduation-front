import { AppRouteRecord } from '@/types/router';

import { dashboardRoutes } from './dashboard';
import { appointmentsRoutes } from './appointments';
import { doctorsRoutes } from './doctors';
import { departmentsRoutes } from './departments';
import { doctorsScheduleRoutes } from './doctorsSchedule';
import { paymentsRoutes } from './payments';
import { inventoryRoutes } from './inventory';
import { messagesRoutes } from './messages';
import { patientsRoutes } from './patients';
import { feedbackRoutes } from './feedback';
import { financeRoutes } from './finance';
import { dictionaryRoutes } from './dictionary';
import { scheduleRoutes } from './schedule';
import { systemRoutes } from './system';

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  ...dashboardRoutes,
  ...appointmentsRoutes,
  ...patientsRoutes,
  ...doctorsRoutes,
  ...departmentsRoutes,
  ...doctorsScheduleRoutes,
  ...paymentsRoutes,
  ...inventoryRoutes,
  ...messagesRoutes,
  ...feedbackRoutes,
  ...financeRoutes,
  ...dictionaryRoutes,
  ...scheduleRoutes,
  ...systemRoutes,
];