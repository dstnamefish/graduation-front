export interface ScheduleEvent {
  id: number;
  doctorName: string;
  avatar: string;
  title: string;
  time: string;
  color: 'mint' | 'cyan'; // specific color types for the UI
  date: Date;
}

export const getMockScheduleEvents = (year: number, month: number): ScheduleEvent[] => {
  const doctors = [
    { name: 'Dr. John Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { name: 'Dr. Emily Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    {
      name: 'Dr. Petra Winsburry',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petra',
    },
    {
      name: 'Dr. Michael Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    { name: 'Dr. Linda Green', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda' },
  ];

  const titles = [
    'Routine Check-Up with John Smith',
    'Acute Illness Treatment for Flu Symptoms with James Brown',
    'Chronic Disease Management for Hypertension with Patricia Clark',
    'Preventive Care Consultation with Nancy Martinez',
    'Geriatric Care for Arthritis Management with Robert Wilson',
  ];

  const mockEvents: ScheduleEvent[] = [];
  let id = 1;

  // Predictable pseudorandom generation to look like the screenshot
  for (let day = 1; day <= 31; day++) {
    // Add 1-2 events for some days
    if (day % 3 !== 0) {
      const numEvents = day % 2 === 0 ? 2 : 1;
      for (let i = 0; i < numEvents; i++) {
        const docIndex = (day + i) % doctors.length;
        const doctor = doctors[docIndex];
        mockEvents.push({
          id: id++,
          doctorName: doctor.name,
          avatar: doctor.avatar,
          title: titles[(day + i) % titles.length],
          time: `${String((day % 4) + 8).padStart(2, '0')}:00 ${day % 2 === 0 ? 'PM' : 'AM'}`,
          color: (day + i) % 2 === 0 ? 'mint' : 'cyan',
          date: new Date(year, month, day),
        });
      }
    }
  }

  return mockEvents;
};
