export interface BillingItem {
  id: string;
  name: string;
  type: 'billing' | 'supply';
  price?: string;
  location?: string;
}

export const getMockBilling = (): BillingItem[] => [
  {
    id: 'B001',
    name: '核磁共振 (MRI)',
    type: 'billing',
    price: '¥800.00 / 次',
  },
  {
    id: 'B002',
    name: '普通换药费 (Dressing)',
    type: 'billing',
    price: '¥25.00 / 次',
  },
  {
    id: 'U001',
    name: '一次性口罩 (Mask)',
    type: 'supply',
    location: '主仓库 A1-03',
  },
  {
    id: 'U002',
    name: '采血管 (Vacutainer)',
    type: 'supply',
    location: '临检实验室 201',
  },
];
