import { AppRouteRecord } from '@/types/router';

/**
 * Doctors (医生管理) 路由配置
 */
export const doctorsRoutes: AppRouteRecord[] = [
  {
    component: '/doctors',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      icon: 'local-menu/doctors',
      keepAlive: false,
      roles: ['ADMIN'],
      fixedHeight: true,
      title: 'menus.doctors.title',
    },
    name: 'Doctors',
    path: '/doctors',
  },
  {
    component: '/doctors/detail',
    meta: {
      headerBar: {
        globalSearch: false,
      },
      isDetail: true,
      isHide:true,
      activePath: '/doctors',
      keepAlive: false,
      fixedHeight: true,
      title: 'Doctor Detail',
    },
    name: 'DoctorDetail',
    path: '/doctors/detail/:id',
  },
];
