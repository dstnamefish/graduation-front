import { AppRouteRecord } from '@/types/router';

/**
 * Patients (患者管理) 路由配置
 */
export const patientsRoutes: AppRouteRecord[] = [
  {
    component: 'features/patient/views/index',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'local-menu/patients',
      keepAlive: false,
      roles: ['ADMIN'],
      fixedHeight: true,
      title: 'menus.patients.title',
    },
    name: 'Patients',
    path: '/patients',
  },
  {
    component: 'features/patient/views/detail/index',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      isDetail: true,
      isHide: true,
      activePath: '/patients',
      keepAlive: false,
      fixedHeight: true,
      title: 'Patient Detail',
    },
    name: 'PatientDetail',
    path: '/patients/detail/:id',
  },
];
