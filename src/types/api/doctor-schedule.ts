/**
 * Doctor Schedule module type definitions
 * @module types/api/doctor-schedule
 */

/** Schedule status */
export enum ScheduleStatus {
  DELETED = -1,
  STOPPED = 0,
  NORMAL = 1,
  EXPERT = 2,
}

/** Pagination params */
interface PaginationParams {
  pageNum?: number;
  pageSize?: number;
}

/** Paginated response */
interface PaginatedResponse<T> {
  total: number;
  size: number;
  current: number;
  records: T[];
}

/** Schedule - Request params */
export interface CreateScheduleParams {
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  status?: number;
  maxAppointments?: number;
  doctorId: number;
}

/** Schedule - Update request params */
export interface UpdateScheduleParams extends Partial<CreateScheduleParams> {
  id: number;
}

/** Schedule - Query params */
export interface GetScheduleParams extends Partial<PaginationParams> {
  doctorId?: number;
  status?: ScheduleStatus;
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
}

/** Schedule - Response data */
export interface ScheduleResponse {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  status: ScheduleStatus;
  maxAppointments: number;
  doctorId: number;
  tenantId: number;
  createdTime: string;
  updatedTime: string;
  doctorName?: string;
}

/** Schedule - Paginated list */
export type ScheduleListResponse = PaginatedResponse<ScheduleResponse>;

/** Schedule event for calendar view */
export interface ScheduleEvent {
  id: number;
  title: string;
  doctorName: string;
  time: string;
  date: Date;
  type: string;
  color: 'mint' | 'cyan' | 'purple';
  status: number;
}

/** Day object for month view */
export interface ScheduleDayObject {
  date: number;
  fullDate: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ScheduleEvent[];
}

/** Week day object for week view */
export interface ScheduleWeekDayObject {
  fullDate: Date;
  isToday: boolean;
  events: ScheduleEvent[];
  dayName: string;
  dateNum: number;
}
