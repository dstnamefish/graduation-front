export interface Experience {
  id: number;
  role: string;
  hospital: string;
  type: string;
  period: string;
}

export interface DayStat {
  day: string;
  newPatient: number;
  followUpPatient: number;
}

export interface ScheduleItem {
  id: number;
  patientName: string;
  type: string;
  time: string;
  color: 'mint' | 'cyan' | 'warning' | 'info';
}

export interface Feedback {
  id: number;
  patientName: string;
  avatar: string;
  date: string;
  text: string;
}

export interface DoctorDetailData {
  id: number;
  name: string;
  avatar: string;
  code: string;
  status: 'Available' | 'Unavailable';
  specialty: string;
  about: string;
  phone: string;
  email: string;
  location: string;
  totalPatients: number;
  totalAppointments: number;
  experience: Experience[];
  appointmentStats: DayStat[];
  todaySchedule: ScheduleItem[];
  feedback: Feedback[];
}

export const getMockDoctorDetail = (id: number): DoctorDetailData => {
  return {
    id,
    name: 'Dr. Petra Winsburry',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petra',
    code: 'WNH-GM-001',
    status: 'Available',
    specialty: 'Routine Check-Ups',
    about:
      'Dr. Petra Winsburry is a seasoned general medicine practitioner with over 15 years of experience in providing comprehensive healthcare services. He is dedicated to ensuring the overall well-being of his patients through routine check-ups and preventive care.',
    phone: '+1 555-234-5678',
    email: 'petra.wins@wellnesthospital.com',
    location: 'WellNest Hospital, 456 Elm Street, Springfield, IL, USA',
    totalPatients: 150,
    totalAppointments: 320,
    experience: [
      {
        id: 1,
        role: 'General Practitioner',
        hospital: 'WellNest Hospital',
        type: 'Full-Time',
        period: '2010-Present',
      },
      {
        id: 2,
        role: 'Resident Doctor',
        hospital: 'City Hospital',
        type: 'Full-Time',
        period: '2005-2010',
      },
    ],
    appointmentStats: [
      { day: 'Monday', newPatient: 2, followUpPatient: 8 },
      { day: 'Tuesday', newPatient: 3, followUpPatient: 9 },
      { day: 'Wednesday', newPatient: 5, followUpPatient: 6 },
      { day: 'Thursday', newPatient: 3, followUpPatient: 6 },
      { day: 'Friday', newPatient: 2, followUpPatient: 6 },
      { day: 'Saturday', newPatient: 1, followUpPatient: 5 },
    ],
    todaySchedule: [
      {
        id: 1,
        patientName: 'Rupert Twinny',
        type: 'Routine Check-Up',
        time: '09:00 AM',
        color: 'mint',
      },
      {
        id: 2,
        patientName: 'Ruth Herdinger',
        type: 'Follow-Up Visit',
        time: '10:00 AM',
        color: 'cyan',
      },
      {
        id: 3,
        patientName: 'Caren G. Simpson',
        type: 'Routine Check-Up',
        time: '11:00 AM',
        color: 'mint',
      },
      { id: 4, patientName: 'Staff Meeting', type: 'Meeting', time: '01:00 PM', color: 'warning' },
      { id: 5, patientName: 'Administrative Work', type: 'Task', time: '03:00 PM', color: 'info' },
    ],
    feedback: [
      {
        id: 1,
        patientName: 'Alice Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        date: '2028-07-01',
        text: 'Dr. Winsburry is very thorough and caring. He took the time to explain my condition and treatment options in detail. I felt very comfortable.',
      },
      {
        id: 2,
        patientName: 'Robert Brown',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
        date: '2028-06-25',
        text: 'Great experience, highly recommend Dr. Winsburry. He is attentive and professional, ensuring that all my questions were answered.',
      },
      {
        id: 3,
        patientName: 'Chance Siphron',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chance',
        date: '2028-06-11',
        text: 'Dr. Winsburry is efficient, professional, and skilled. He quickly diagnosed my issue and provided a clear treatment plan.',
      },
      {
        id: 4,
        patientName: 'Lincoln Donin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lincoln',
        date: '2028-05-27',
        text: 'An exceptional physician who combines deep knowledge with genuine care, addressing all concerns and making patients feel understood.',
      },
    ],
  };
};
