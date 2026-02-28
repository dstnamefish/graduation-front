export interface PatientItem {
  id: number;
  name: string;
  patientCode: string;
  gender: 'Male' | 'Female';
  age: number;
  phone: string;
  bloodType: string;
  lastVisit: string;
  status: 'Critical' | 'Stable' | 'Recovering';
  avatar: string;
}

/**
 * 获取患者模拟数据
 * @returns 患者数据数组
 */
export const getMockPatients = (): PatientItem[] => [
  {
    id: 1,
    name: 'Robert Miller',
    patientCode: 'PT-2024-001',
    gender: 'Male',
    age: 45,
    phone: '138-xxxx-8888',
    bloodType: 'A+',
    lastVisit: '2024-02-20',
    status: 'Stable',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
  },
  {
    id: 2,
    name: 'Alice Thompson',
    patientCode: 'PT-2024-002',
    gender: 'Female',
    age: 28,
    phone: '139-xxxx-9999',
    bloodType: 'O-',
    lastVisit: '2024-02-21',
    status: 'Recovering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    id: 3,
    name: 'David Wilson',
    patientCode: 'PT-2024-003',
    gender: 'Male',
    age: 62,
    phone: '137-xxxx-7777',
    bloodType: 'B+',
    lastVisit: '2024-02-18',
    status: 'Critical',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
  {
    id: 4,
    name: 'Sophie Chen',
    patientCode: 'PT-2024-004',
    gender: 'Female',
    age: 35,
    phone: '136-xxxx-6666',
    bloodType: 'AB+',
    lastVisit: '2024-02-22',
    status: 'Stable',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  },
  {
    id: 5,
    name: 'James Rodriguez',
    patientCode: 'PT-2024-005',
    gender: 'Male',
    age: 50,
    phone: '135-xxxx-5555',
    bloodType: 'A-',
    lastVisit: '2024-02-19',
    status: 'Stable',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
];
