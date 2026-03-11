import NProgress from 'nprogress';

import { useSettingStore } from '@/app/store/setting';
import { Router } from 'vue-router';

/** 路由全局后置守卫 */
export function setupAfterEachGuard(router: Router) {
  const { scrollToTop } = useCommon();

  router.afterEach(() => {
    scrollToTop();
    if (useSettingStore().showNprogress) {NProgress.done();}
  });
}