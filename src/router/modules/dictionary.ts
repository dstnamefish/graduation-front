import { AppRouteRecord } from '@/types/router';

export const dictionaryRoutes: AppRouteRecord[] = [
  {
    path: '/dictionary',
    name: 'Dictionary',
    redirect: '/dictionary/drug',
    meta: {
      title: '字典管理',
      icon: 'hugeicons:medicine',
    },
    children: [
      {
        path: 'drug',
        name: 'DictionaryDrug',
        component: '/dictionary/drug',
        meta: {
          title: '医药字典',
          icon: 'hugeicons:pill',
        },
      },
    ],
  },
];
