export interface PaymentItem {
  id: string;
  invoiceId: string;
  patientName: string;
  patientAvatar: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  method: 'Credit Card' | 'Cash' | 'Insurance' | 'Bank Transfer';
}

export const getMockPayments = (): PaymentItem[] => {
  const items: PaymentItem[] = [];
  const names = [
    'Alex Rivera',
    'Sarah Jenkins',
    'Michael Chen',
    'Emily Davis',
    'Robert Wilson',
    'Jessica Thompson',
    'David Miller',
    'Sophie Martin',
  ];
  const statuses: ('Paid' | 'Pending' | 'Overdue')[] = ['Paid', 'Pending', 'Overdue'];
  const methods: ('Credit Card' | 'Cash' | 'Insurance' | 'Bank Transfer')[] = [
    'Credit Card',
    'Cash',
    'Insurance',
    'Bank Transfer',
  ];

  for (let i = 1; i <= 1000; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + Math.floor(Math.random() * 90));

    items.push({
      id: i.toString(),
      invoiceId: `INV-${i.toString().padStart(4, '0')}`,
      patientName: name,
      patientAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i}`,
      date: date.toISOString().split('T')[0],
      amount: `¥${(Math.random() * 5000 + 200).toFixed(2)}`,
      status,
      method,
    });
  }
  return items;
};
