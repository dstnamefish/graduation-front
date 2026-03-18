/**
 * Patient module type definitions
 * @description Auto-generated, follows frontend architecture guidelines
 * @author dstnamefish
 * @date 2026-03-15
 */

// ==========================================
// Query Parameter Types (Query)
// ==========================================

/**
 * Patient query params
 * @description Request params for patient pagination query with multiple filters
 */
export interface PatientQuery {
  /** Patient status: 1-Active, 0-Inactive */
  status?: number;
  /** Registration start time for time range filter */
  startDate?: string;
  /** Registration end time for time range filter */
  endDate?: string;
  /** Treatment item name */
  treatment?: string;
  /** Responsible doctor ID */
  doctorId?: number;
  /** Search keyword for patient name, medical record number, etc. */
  query?: string;
  /** Page number, default 1 */
  page?: number;
  /** Page size, default 10 */
  size?: number;
}

// ==========================================
// Form Input Types (Form)
// ==========================================

/**
 * Patient creation form
 * @description Form data for creating new patient record
 */
export interface PatientForm {
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Phone number */
  phone: string;
  /** Gender: 1-Male, 2-Female */
  gender: number;
  /** Date of birth for dynamic age calculation */
  birthday?: string;
  /** Email */
  email?: string;
  /** Avatar URL */
  avatar?: string;
  /** Patient number/Medical record number */
  patientNo: string;
  /** Registration/Check-in time, defaults to current time */
  checkInTime?: string;
}

/**
 * Prescription item form
 * @description Prescription drug item info
 */
export interface PrescriptionItemForm {
  /** Inventory item ID (drug), foreign key to inventory_item table */
  inventoryItemId: number;
  /** Drug name */
  itemName: string;
  /** Specification, e.g. 500mg/tablet, 10ml/bottle */
  specification: string;
  /** Quantity */
  quantity: number;
  /** Unit price */
  unitPrice: number;
  /** Amount, usually quantity * unitPrice */
  amount: number;
  /** Usage and dosage, e.g. 2 times daily, 1 tablet each time */
  usage: string;
}

/**
 * Prescription creation form
 * @description Form data for creating prescription
 */
export interface PrescriptionForm {
  /** Patient ID */
  patientId: number;
  /** Doctor ID */
  doctorId: number;
  /** Diagnosis result */
  diagnosis: string;
  /** Prescription date */
  prescriptionDate?: string;
  /** Expiry date */
  expiryDate?: string;
  /** Remarks */
  remark?: string;
  /** Prescription drug items */
  items: PrescriptionItemForm[];
}

// ==========================================
// Base Data Entity Types (Entity)
// ==========================================

/**
 * Patient entity
 * @description Patient list item data
 */
export interface Patient {
  /** Patient ID */
  id: number;
  /** Patient number/Medical record number */
  patientNo: string;
  /** Patient name */
  name: string;
  /** Avatar URL */
  avatar: string;
  /** Age */
  age: number;
  /** Registration/Check-in time */
  checkInTime: string;
  /** Treatment item */
  treatment: string;
  /** Responsible doctor */
  doctorAssigned: string;
  /** Room info */
  room: string;
  /** Patient status: 0-Inactive, 1-Active, 2-New Patient */
  status: number;
  /** Gender: 1-Male, 2-Female */
  gender: number;
}

/**
 * Prescription item entity
 * @description Prescription drug item info
 */
export interface PrescriptionItem {
  /** Item ID */
  id: number;
  /** Prescription ID */
  prescriptionId: number;
  /** Inventory item ID (drug) */
  inventoryItemId: number;
  /** Drug name */
  itemName: string;
  /** Specification, e.g. 500mg/tablet, 10ml/bottle */
  specification: string;
  /** Quantity */
  quantity: number;
  /** Unit price */
  unitPrice: number;
  /** Amount */
  amount: number;
  /** Usage and dosage */
  usage: string;
}

/**
 * Prescription entity
 * @description Complete prescription info
 */
export interface Prescription {
  /** Prescription ID */
  id: number;
  /** Patient ID */
  patientId: number;
  /** Patient name */
  patientName: string;
  /** Doctor ID */
  doctorId: number;
  /** Doctor name */
  doctorName: string;
  /** Prescription number */
  prescriptionNo: string;
  /** Diagnosis result */
  diagnosis: string;
  /** Prescription status: 1-Valid, 2-Used, 3-Expired */
  status: number;
  /** Status name */
  statusName: string;
  /** Prescription date */
  prescriptionDate: string;
  /** Expiry date */
  expiryDate: string;
  /** Remarks */
  remark: string;
  /** Prescription drug items */
  items: PrescriptionItem[];
  /** Total amount */
  totalAmount: number;
}

/**
 * Patient profile
 * @description Basic info for patient personal homepage
 */
export interface PatientProfile {
  /** Patient ID */
  patientId: number;
  /** Patient number/Medical record number */
  patientNo: string;
  /** Patient status: 0-Inactive, 1-Active, 2-New Patient */
  patientStatus: number;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Avatar URL */
  avatar: string;
  /** Gender: 1-Male, 2-Female */
  gender: number;
  /** Age */
  age: number;
  /** Date of birth */
  birthday: string;
  /** Phone number */
  phone: string;
  /** Email */
  email: string;
  /** Contact address */
  address: string;
  /** Emergency contact name */
  emergencyContactName: string;
  /** Emergency contact phone */
  emergencyContactPhone: string;
}

/**
 * Patient health data
 * @description Patient's various health indicators
 */
export interface PatientHealth {
  /** Height (unit: cm) */
  height: number;
  /** Weight (unit: kg) */
  weight: number;
  /** Heart rate (beats/min) */
  heartRate: number;
  /** Blood pressure, format: 120/80 mmHg */
  bloodPressure: string;
  /** Blood glucose (unit: mmol/L) */
  bloodGlucose: number;
  /** Cholesterol (unit: mmol/L) */
  cholesterol: number;
  /** Respiratory rate (breaths/min) */
  respiratoryRate: number;
  /** Hemoglobin (unit: g/L) */
  hemoglobin: number;
  /** Allergies */
  allergies: string;
  /** Medical history */
  medicalHistory: string;
  /** Current medications */
  medications: string;
  /** Last updated time */
  lastUpdated: string;
}

/**
 * Patient note
 * @description Doctor or nurse's observation record of patient
 */
export interface PatientNote {
  /** Note ID */
  id: number;
  /** Note title */
  title: string;
  /** Note content */
  content: string;
  /** Created time */
  createdTime: string;
}

/**
 * Health report
 * @description Patient's test reports, examination forms, etc.
 */
export interface HealthReport {
  /** Report ID */
  id: number;
  /** Report name */
  reportName: string;
  /** File size, unit: KB/MB */
  fileSize: number;
  /** Report generation/upload time */
  createdTime: string;
}

/**
 * Patient appointment
 * @description Patient's appointment record
 */
export interface PatientAppointment {
  /** Appointment ID */
  id: number;
  /** Patient ID */
  patientId: number;
  /** Patient name */
  patientName: string;
  /** Doctor ID */
  doctorId: number;
  /** Doctor name */
  doctorName: string;
  /** Department ID */
  departmentId: number;
  /** Department name */
  departmentName: string;
  /** Appointment date */
  appointmentDate: string;
  /** Time slot */
  timeSlot: string;
  /** Treatment item */
  treatmentName: string;
  /** Appointment status: 0-Pending, 1-Confirmed, 2-Completed, 3-Cancelled */
  status: number;
  /** Status text */
  statusText: string;
}

// ==========================================
// Response Output Types (Response)
// ==========================================

/**
 * Patient pagination response
 * @description Paginated response data for patient list
 */
export interface PatientPageResponse {
  /** Total records */
  total: number;
  /** Page size */
  size: number;
  /** Current page */
  current: number;
  /** Patient list data */
  records: Patient[];
}

/**
 * Patient dashboard response
 * @description Aggregated data for patient personal homepage
 */
export interface PatientDashboardResponse {
  /** Patient profile */
  profile: PatientProfile;
  /** Patient health data */
  healthData: PatientHealth;
  /** Visit notes list */
  notes: PatientNote[];
  /** Examination reports list */
  reports: HealthReport[];
  /** Upcoming appointments */
  upcomingAppointments: PatientAppointment[];
  /** Historical visit records */
  historyAppointments: PatientAppointment[];
}

/**
 * Prescription detail response
 * @description Complete prescription info response
 */
export interface PrescriptionDetailResponse {
  /** Prescription ID */
  id: number;
  /** Patient ID */
  patientId: number;
  /** Patient name */
  patientName: string;
  /** Doctor ID */
  doctorId: number;
  /** Doctor name */
  doctorName: string;
  /** Prescription number */
  prescriptionNo: string;
  /** Diagnosis result */
  diagnosis: string;
  /** Prescription status: 1-Valid, 2-Used, 3-Expired */
  status: number;
  /** Status name */
  statusName: string;
  /** Prescription date */
  prescriptionDate: string;
  /** Expiry date */
  expiryDate: string;
  /** Remarks */
  remark: string;
  /** Prescription drug items */
  items: PrescriptionItem[];
  /** Total amount */
  totalAmount: number;
}
