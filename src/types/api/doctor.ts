/**
 * Doctor related type definitions
 */

/**
 * Doctor status enum
 */
export enum DoctorStatus {
  ACTIVE = 1,    // Active
  INACTIVE = 0,  // Inactive
  DELETED = -1,  // Deleted
}

/**
 * Doctor query params
 * @description Request params for doctor pagination query with multiple filters
 * @property {string} query - Search keyword for doctor name, employee number, title
 * @property {number} departmentId - Department ID for filtering doctors by department
 * @property {number} specialtyId - Specialty ID for filtering doctors by specialty
 * @property {number} status - Doctor status: 1-Active, 0-Inactive, -1-Deleted
 * @property {number} page - Page number, default 1
 * @property {number} size - Page size, default 10
 */
export interface DoctorQuery {
  query?: string;
  departmentId?: number;
  specialtyId?: number;
  status?: DoctorStatus;
  page?: number;
  size?: number;
}

/**
 * Doctor basic info
 * @description Query result display for doctor list page
 * @property {number} id - Doctor ID
 * @property {string} name - Doctor name
 * @property {string} avatar - Avatar URL
 * @property {string} doctorNo - Doctor number, unique employee ID
 * @property {string} departmentName - Department name
 * @property {string} specialist - Specialty/title, e.g. Chief Physician, Cardiology Specialist
 * @property {number} totalPatients - Total patients
 * @property {number} todayAppointments - Today's appointments
 * @property {string} availabilityStatus - Availability status, e.g. Available, Full Today, On Leave
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
 * Doctor profile
 * @description Doctor personal and professional info
 * @property {number} id - Doctor ID
 * @property {string} name - Doctor name
 * @property {string} doctorNo - Doctor number, unique employee ID
 * @property {string} specialist - Specialty/title, e.g. Chief Physician, Cardiology Specialist
 * @property {string} bio - Personal introduction, professional background, expertise, education
 * @property {string} phone - Contact phone
 * @property {string} email - Email
 * @property {string} address - Contact address, clinic location
 * @property {string} availabilityStatus - Availability status, e.g. Available, Full Today, On Leave
 */
export interface DoctorProfile {
  id: number;
  name: string;
  avatar?: string;
  doctorNo: string;
  specialist: string;
  bio: string;
  phone: string;
  email: string;
  address: string;
  availabilityStatus: string;
}

/**
 * Work experience
 * @description Doctor's career history and work experience
 * @property {string} position - Position/title, e.g. Chief Physician, Department Head
 * @property {string} hospitalName - Hospital/institution name
 * @property {string} employmentType - Employment type, Full-time/Part-time/Guest/Consultant
 * @property {string} dateRange - Work time range, format: yyyy-MM - yyyy-MM or yyyy - Present
 */
export interface WorkExperience {
  position: string;
  hospitalName: string;
  employmentType: string;
  dateRange: string;
}

/**
 * Patient feedback
 * @description Patient's feedback on doctor
 * @property {number} id - Feedback ID
 * @property {number} rating - Rating, 1-5 stars
 * @property {string} content - Feedback content
 * @property {string} patientName - Patient name
 * @property {string} avatar - Patient avatar
 * @property {string} reviewDate - Review date
 */
export interface Feedback {
  id: number;
  rating: number;
  content: string;
  patientName: string;
  avatar?: string;
  reviewDate: string;
}

/**
 * Appointment schedule
 * @description Doctor's appointment arrangement
 * @property {string} patientName - Patient name
 * @property {string} time - Appointment time
 * @property {string} treatment - Treatment item
 * @property {number} status - Appointment status
 */
export interface AppointmentSchedule {
  patientName: string;
  time: string;
  treatment: string;
  status: number;
}

/**
 * Doctor dashboard
 * @description All display data for doctor's personal homepage/dashboard
 * @property {DoctorProfile} profile - Doctor profile
 * @property {number} totalPatients - Total patients
 * @property {number} totalAppointments - Total appointments
 * @property {Array<WorkExperience>} workExperiences - Work experience list
 * @property {Array<Feedback>} feedbacks - Patient feedback list
 * @property {Array<AppointmentSchedule>} todaySchedules - Today's schedule
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
 * Doctor pagination response
 * @description Paginated response for doctor list
 * @property {number} total - Total records
 * @property {number} size - Page size
 * @property {number} current - Current page
 * @property {Array<Doctor>} records - Doctor list data
 */
export interface DoctorPageResponse {
  total: number;
  size: number;
  current: number;
  records: Doctor[];
}

/**
 * Specialty (Expert direction)
 * @property {number} id - Specialty ID
 * @property {string} name - Specialty name
 * @property {string} description - Specialty description
 */
export interface Specialty {
  id: number;
  name: string;
  description?: string;
}

/**
 * Doctor dashboard response
 * @description Response for getting doctor dashboard data
 * @property {DoctorDashboard} data - Doctor dashboard data
 */
export interface DoctorDashboardResponse {
  data: DoctorDashboard;
}
