export interface PaymentItem {
  id: string;
  invoiceId: string;
  patientName: string;
  patientAvatar: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
  method: 'Credit Card' | 'Cash' | 'Insurance' | 'Bank Transfer';
  treatment: string;
  department: string;
}

export const getMockPayments = (): PaymentItem[] => {
  const items: PaymentItem[] = [];
  const names = [
    'John Doe',
    'Mary Johnson',
    'Robert Brown',
    'Susan Lee',
    'Michael Chen',
    'Emily Davis',
    'David Miller',
    'Sophie Martin',
  ];

  const treatments = [
    { title: 'Routine Check-Up', dept: 'General Medicine' },
    { title: 'Heart Surgery', dept: 'Cardiology' },
    { title: 'Flu Symptoms', dept: 'General Medicine' },
    { title: 'Skin Treatment', dept: 'Dermatology' },
    { title: 'Dental Cleaning', dept: 'Dentistry' },
    { title: 'Eye Exam', dept: 'Ophthalmology' },
  ];

  const statuses: ('Paid' | 'Pending')[] = ['Paid', 'Pending'];
  const methods: ('Credit Card' | 'Cash' | 'Insurance' | 'Bank Transfer')[] = [
    'Credit Card',
    'Cash',
    'Insurance',
    'Bank Transfer',
  ];

  for (let i = 1; i <= 1000; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const treatment = treatments[Math.floor(Math.random() * treatments.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];

    // 生成随机日期在 2028 年 7 月左右，匹配图片
    const date = new Date(2028, 6, 1);
    date.setDate(date.getDate() + Math.floor(Math.random() * 30));

    items.push({
      id: i.toString(),
      invoiceId: `INV-WNH-${i.toString().padStart(3, '0')}`,
      patientName: name,
      patientAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i}`,
      date: date.toISOString().split('T')[0],
      amount: [100, 5000, 120, 200, 80, 150][Math.floor(Math.random() * 6)],
      status,
      method,
      treatment: treatment.title,
      department: treatment.dept,
    });
  }
  return items;
};
