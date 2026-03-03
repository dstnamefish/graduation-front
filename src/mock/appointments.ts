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
    { name: 'Dr. Petra Winsburry' },
    { name: 'Dr. Olivia Martinez' },
    { name: 'Dr. Damian Sanchez' },
    { name: 'Dr. Chloe Harrington' },
    { name: 'Dr. Emily Smith' },
    { name: 'Dr. Samuel Thompson' },
    { name: 'Dr. Sarah Johnson' },
    { name: 'Dr. Luke Harrison' },
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

    // 生成随机日期
    const date = new Date();
    date.setDate(date.getDate() + (Math.floor(Math.random() * 60) - 30));
    const dateStr = date.toISOString().split('T')[0];

    // 生成随机时间
    const hour = Math.floor(Math.random() * 12) + 8;
    const minute = Math.floor(Math.random() * 4) * 15;
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    appointments.push({
      id: i,
      appointmentDate: dateStr,
      appointmentTime: timeStr,
      status: status,
      patientName: name,
      doctorName: doctor.name,
      departmentName: treatment,
    });
  }

  return appointments;
};
