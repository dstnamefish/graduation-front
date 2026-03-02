import {
  AppointmentStatus,
  CheckInStatus,
  CallStatus,
  AppointmentSource,
  type AppointmentResponse,
} from '@/types/api/appointment.types';

/**
 * 获取预约模拟数据
 * @returns 预约数据数组
 */
export const getMockAppointments = (): AppointmentResponse[] => {
  const appointments: AppointmentResponse[] = [];
  const names = [
    'Caren G. Simpson',
    'Edgar Marrow',
    'Ocean Jane Lupre',
    'Shane Riddick',
    'Queen Lawnston',
    'Alice Mitchell',
    'Mikhail Morozov',
    'Mateus Fernandes',
    'Pari Desai',
    'Omar Ali',
    'Camila Alvarez',
    'Thabo van Rooyen',
    'Chance Geidt',
    'James Wilson',
    'Robert Brown',
    'Michael Davis',
    'William Miller',
    'David Garcia',
    'Richard Rodriguez',
    'Joseph Martinez',
    'Thomas Hernandez',
    'Christopher Lopez',
    'Linda Gonzales',
    'Mary Wilson',
    'Patricia Anderson',
    'Barbara Taylor',
    'Elizabeth Moore',
    'Jennifer White',
    'Maria Jackson',
    'Susan Martin',
  ];

  const doctors = [
    {
      name: 'Dr. Petra Winsburry',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petra',
    },
    {
      name: 'Dr. Olivia Martinez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    },
    {
      name: 'Dr. Damian Sanchez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Damian',
    },
    {
      name: 'Dr. Chloe Harrington',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe',
    },
    { name: 'Dr. Emily Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    {
      name: 'Dr. Samuel Thompson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel',
    },
    { name: 'Dr. Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { name: 'Dr. Luke Harrison', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luke' },
  ];

  const treatments = [
    'Routine Check-Up',
    'Cardiac Consultation',
    'Pediatric Check-Up',
    'Skin Allergy',
    'Follow-Up Visit',
    'General Examination',
    'Dental Check',
    'Eye Exam',
  ];

  const statuses = [
    AppointmentStatus.PENDING,
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED,
  ];

  for (let i = 1; i <= 100; i++) {
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const treatment = treatments[Math.floor(Math.random() * treatments.length)];

    // Generate a random date within the next 30 days or past 30 days
    const date = new Date();
    date.setDate(date.getDate() + (Math.floor(Math.random() * 60) - 30));
    const dateStr = date.toISOString().split('T')[0];

    // Generate a random time
    const hour = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
    const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    appointments.push({
      id: i,
      appointmentDate: dateStr,
      appointmentTime: timeStr,
      appointmentNumber: `APT-${1000 + i}`,
      status: status,
      checkInStatus: CheckInStatus.NOT_CHECKED,
      callStatus: CallStatus.NOT_CALLED,
      patientId: i,
      doctorId: Math.floor(Math.random() * 10) + 1,
      departmentId: Math.floor(Math.random() * 5) + 1,
      appointmentSource: AppointmentSource.OFFLINE,
      isOvertime: false,
      tenantId: 1,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString(),
      patientName: name,
      patientAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/ /g, '')}`,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatar,
      departmentName: treatment,
    });
  }

  return appointments;
};
