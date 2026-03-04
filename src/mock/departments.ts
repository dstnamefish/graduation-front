export interface DepartmentItem {
  id: number;
  name: string;
  code: string;
  head: string;
  floor: string;
  teamCount: number;
  description: string;
  icon: string;
  image: string;
  teamAvatars: string[];
}

/**
 * 获取科室模拟数据
 */
export const getMockDepartments = (): DepartmentItem[] => {
  const data = [
    {
      name: 'General Medicine',
      head: 'Dr. James Wilson',
      floor: '1F',
      image:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      description:
        'Comprehensive healthcare services including routine check-ups and treatment for general illnesses.',
    },
    {
      name: 'Cardiology',
      head: 'Dr. Sarah Chen',
      floor: '3F',
      image:
        'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=800&auto=format&fit=crop',
      description:
        'Specialized care for heart health, diagnostics, and advanced cardiovascular treatments.',
    },
    {
      name: 'Pediatrics',
      head: 'Dr. Emily Brown',
      floor: '2F',
      image:
        'https://images.unsplash.com/photo-1581594634754-57acf5256e29?q=80&w=800&auto=format&fit=crop',
      description:
        'Dedicated child healthcare from birth through adolescence, ensuring healthy development.',
    },
    {
      name: 'Neurology',
      head: 'Dr. Robert Miller',
      floor: '4F',
      image:
        'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop',
      description:
        'Expert diagnostics and treatment for disorders affecting the brain and nervous system.',
    },
    {
      name: 'Orthopedics',
      head: 'Dr. David Smith',
      floor: '2F',
      image:
        'https://images.unsplash.com/photo-1504813184591-01592fd03cf7?q=80&w=800&auto=format&fit=crop',
      description:
        'Advanced services for bone and joint health, sports injuries, and rehabilitation.',
    },
    {
      name: 'Dermatology',
      head: 'Dr. Linda White',
      floor: '1F',
      image:
        'https://images.unsplash.com/photo-1629909613654-28a3a7c4d459?q=80&w=800&auto=format&fit=crop',
      description:
        'Professional care for skin conditions, aesthetics, and specialized dermatological treatments.',
    },
    {
      name: 'Ophthalmology',
      head: 'Dr. Michael Chang',
      floor: '3F',
      image:
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
      description:
        'Specialized eye care including vision tests, surgery, and treatment for eye diseases.',
    },
    {
      name: 'Oncology',
      head: 'Dr. Rachel Green',
      floor: '5F',
      image:
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
      description:
        'Comprehensive cancer care involving diagnosis, treatment, and patient support services.',
    },
    {
      name: 'Gastroenterology',
      head: 'Dr. Steven Wu',
      floor: '4F',
      image:
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=800&auto=format&fit=crop',
      description: 'Expertise in digestive system health and disorders of the liver and pancreas.',
    },
    {
      name: 'Psychiatry',
      head: 'Dr. Anna Taylor',
      floor: '6F',
      image:
        'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?q=80&w=800&auto=format&fit=crop',
      description:
        'Mental health services focusing on diagnosis, treatment, and prevention of disorders.',
    },
    {
      name: 'Radiology',
      head: 'Dr. Paul Adams',
      floor: 'B1',
      image:
        'https://images.unsplash.com/photo-1516549149129-dbd1d80fb78d?q=80&w=800&auto=format&fit=crop',
      description:
        'Advanced medical imaging services including X-ray, MRI, CT scans, and ultrasound.',
    },
    {
      name: 'Urology',
      head: 'Dr. Kevin Lee',
      floor: '2F',
      image:
        'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800&auto=format&fit=crop',
      description: 'Specialized care for urinary tract conditions and male reproductive health.',
    },
  ];

  return data.map((item, i) => ({
    id: i + 1,
    name: item.name,
    code: item.name.substring(0, 2).toUpperCase(),
    head: item.head,
    floor: item.floor,
    teamCount: Math.floor(Math.random() * 15) + 5,
    description: item.description,
    icon: 'local-menu/departments',
    image: item.image,
    teamAvatars: Array.from(
      { length: 8 },
      (_, idx) => `https://api.dicebear.com/7.x/avataaars/svg?seed=Doc${i}${idx}`,
    ),
  }));
};
