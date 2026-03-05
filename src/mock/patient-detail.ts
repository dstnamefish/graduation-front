export interface PatientDetailData {
  id: string;
  name: string;
  avatar: string;
  status: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    emergencyName: string;
    emergencyPhone: string;
  };
  general: {
    gender: string;
    age: string;
    dob: string;
    occupation: string;
    insurance: string;
  };
  notes: {
    date: string;
    condition: string;
    text: string;
  }[];
  medical: {
    height: string;
    weight: string;
    bmi: string;
    heartRate: string;
    bp: string;
    bloodSugar: string;
    cholesterol: string;
    respiratory: string;
    hemoglobin: string;
    allergies: string[];
    conditions: string[];
    medications: string[];
  };
  reports: {
    id: string;
    name: string;
    size: string;
  }[];
  appointments: {
    upcoming: {
      type: string;
      status: string;
      doctor: string;
      date: string;
    };
    history: {
      id: string;
      type: string;
      status: string;
      doctor: string;
      date: string;
    }[];
  };
}

export const getMockPatientDetail = (id: string): PatientDetailData => {
  return {
    id: id || '301',
    name: 'Caren G. Simpson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caren',
    status: 'Active',
    contact: {
      phone: '+1 555-123-4567',
      email: 'caren.simpson@example.com',
      address: '123 Maple Street\nSpringfield, IL, USA',
      emergencyName: 'John Simpson - Brother',
      emergencyPhone: '+1 555-234-5678',
    },
    general: {
      gender: 'Female',
      age: '35 years old',
      dob: '1989-06-15',
      occupation: 'Software Engineer',
      insurance: 'HealthPlus',
    },
    notes: [
      {
        date: 'Jun 8, 2027, 4:45 PM',
        condition: 'Asthma',
        text: 'Ensure the patient always carries an inhaler and avoids allergy triggers.',
      },
      {
        date: 'Apr 9, 2028, 9:15 AM',
        condition: 'Hypertension',
        text: 'Advise the patient to engage in light exercise and monitor blood pressure weekly.',
      },
      {
        date: 'Oct 10, 2027, 2:30 PM',
        condition: 'Type 2 Diabetes',
        text: 'Patient needs to monitor blood sugar levels regularly & follow the recommended diet.',
      },
    ],
    medical: {
      height: '5 ft 1.5 in',
      weight: '140 lbs',
      bmi: '135 lbs', // Actually wait, bmi usually is a number, but in screenshot it says 135 lbs for BMI box... We'll just mimic the text.
      heartRate: '72 bpm',
      bp: '120/80 mmHg',
      bloodSugar: '90 mg/dL',
      cholesterol: '180 mg/dl',
      respiratory: '16 b/m',
      hemoglobin: '14 g/dL',
      allergies: ['Penicillin', 'Latex', 'Shellfish'],
      conditions: ['Hypertension', 'Asthma', 'Hypothyroidism'],
      medications: ['Lisinopril', 'Albuterol Inhaler', 'Levothyroxine'],
    },
    reports: [
      { id: '1', name: 'blood_test_2024_06_15.pdf', size: '1.45 MB' },
      { id: '2', name: 'cardiac_rprt_28_05_10.pdf', size: '5.60 MB' },
    ],
    appointments: {
      upcoming: {
        type: 'Routine Check-Up',
        status: 'Confirmed',
        doctor: 'Dr. Petra Winsburry',
        date: 'Thu, 07 July 2028 — 09:00 AM',
      },
      history: [
        {
          id: '1',
          type: 'Blood Test',
          status: 'Completed',
          doctor: 'Dr. Emily Smith',
          date: 'Tue, 15 June 2028 — 10:00 AM',
        },
        {
          id: '2',
          type: 'Cardiac Consultation',
          status: 'Completed',
          doctor: 'Dr. Olivia Martinez',
          date: 'Wed, 10 May 2028 — 11:00 AM',
        },
      ],
    },
  };
};
