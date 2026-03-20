import { AppRouteRecord } from '@/types/router';

export const financeRoutes: AppRouteRecord[] = [
  {
    path: '/finance',
    name: 'Finance',
    redirect: '/finance/invoice',
    meta: {
      title: '财务管理',
      icon: 'hugeicons:invoice-03',
    },
    children: [
      {
        path: 'invoice',
        name: 'FinanceInvoice',
        component: '/finance/invoice',
        meta: {
          title: '发票管理',
          icon: 'hugeicons:invoice',
        },
      },
    ],
  },
];
