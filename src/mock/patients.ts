export interface PatientItem {
  id: number;
  name: string;
  patientId: string;
  age: number;
  checkIn: string;
  treatment: string;
  doctorAssigned: string;
  room: string;
  status: 'Active' | 'New Patient' | 'Inactive';
  avatar: string;
}

/**
 * 获取患者模拟数据（生成1000条）
 * @returns 患者数据数组
 */
export const getMockPatients = (): PatientItem[] => {
  const patients: PatientItem[] = [];
  const firstNames = [
    'James',
    'Mary',
    'Robert',
    'Patricia',
    'John',
    'Jennifer',
    'Michael',
    'Linda',
    'William',
    'Elizabeth',
    'David',
    'Barbara',
    'Richard',
    'Susan',
    'Joseph',
    'Jessica',
    'Thomas',
    'Sarah',
    'Christopher',
    'Karen',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
  ];
  const treatments = [
    'Routine Check-Up',
    'Cardiac Consultation',
    'Pediatric Check-Up',
    'Skin Allergy',
    'Follow-Up Visit',
    'Dental Cleaning',
    'Eye Exam',
    'Physical Therapy',
  ];
  const doctors = [
    'Dr. Petra Winsburry',
    'Dr. Olivia Martinez',
    'Dr. Damian Sanchez',
    'Dr. Chloe Harrington',
    'Dr. Samuel Thompson',
    'Dr. Emily Smith',
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
  ];
  const statuses: ('Active' | 'New Patient' | 'Inactive')[] = ['Active', 'New Patient', 'Inactive'];

  for (let i = 1; i <= 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const id = 1000 + i;

    patients.push({
      id: id,
      name: `${firstName} ${lastName}`,
      patientId: `PT-${id}`,
      age: Math.floor(Math.random() * 80) + 1,
      checkIn: `${Math.floor(Math.random() * 28) + 1} July 2028`,
      treatment: treatments[Math.floor(Math.random() * treatments.length)],
      doctorAssigned: doctors[Math.floor(Math.random() * doctors.length)],
      room:
        Math.random() > 0.5
          ? `${Math.random() > 0.5 ? 'Single' : 'Double'} - ${100 + Math.floor(i / 10)}`
          : '-',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
    });
  }

  return patients;
};
