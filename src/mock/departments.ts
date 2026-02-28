export interface DepartmentItem {
  id: number;
  name: string;
  code: string;
  head: string;
  floor: string;
  doctorCount: number;
  description: string;
  icon: string;
}

/**
 * 获取科室模拟数据
 * @returns 科室数据数组
 */
export const getMockDepartments = (): DepartmentItem[] => [
  {
    id: 1,
    name: 'General Medicine',
    code: 'GM',
    head: 'Dr. Petra Winsburry',
    floor: '2F',
    doctorCount: 12,
    description: 'General health checkups and routine medicine.',
    icon: 'local-menu/departments',
  },
  {
    id: 2,
    name: 'Cardiology',
    code: 'CD',
    head: 'Dr. Olivia Martinez',
    floor: '3F',
    doctorCount: 8,
    description: 'Specialized care for heart-related conditions.',
    icon: 'local-menu/departments',
  },
  {
    id: 3,
    name: 'Pediatrics',
    code: 'PD',
    head: 'Dr. Damian Sanchez',
    floor: '1F',
    doctorCount: 15,
    description: 'Medical care for infants, children, and adolescents.',
    icon: 'local-menu/departments',
  },
  {
    id: 4,
    name: 'Neurology',
    code: 'NL',
    head: 'Dr. Thomas Brown',
    floor: '4F',
    doctorCount: 5,
    description: 'Treatment for disorders of the nervous system.',
    icon: 'local-menu/departments',
  },
  {
    id: 5,
    name: 'Orthopedics',
    code: 'OR',
    head: 'Dr. Mark Wilson',
    floor: '2F',
    doctorCount: 10,
    description: 'Focus on musculoskeletal system injuries.',
    icon: 'local-menu/departments',
  },
];
