/**
 * 用户状态管理模块
 *
 * 提供用户相关的状态管理
 *
 * ## 主要功能
 *
 * - 用户登录状态管理
 * - 用户信息存储
 * - 访问令牌和刷新令牌管理
 * - 语言设置
 * - 搜索历史记录
 * - 锁屏状态和密码管理
 * - 登出清理逻辑
 *
 * ## 使用场景
 *
 * - 用户登录和认证
 * - 权限验证
 * - 个人信息展示
 * - 多语言切换
 * - 锁屏功能
 * - 搜索历史管理
 *
 * ## 持久化
 *
 * - 使用 localStorage 存储
 * - 存储键：sys-v{version}-user
 * - 登出时自动清理
 *
 * @module store/modules/user
 * @author 16518
 */

import { LanguageEnum } from '@/enums/appEnum';
import { router } from '@/router';
import { resetRouterState } from '@/router/guards/beforeEach';
import { useSettingStore } from '@/store/setting';
import { useWorktabStore } from '@/store/worktab';
import { useMenuStore } from '@/store/menu';
import { storage } from '@/utils/storage';
import { setPageTitle } from '@/utils/router';
import * as AuthApi from '@/api/auth';
import * as UserApi from '@/api/user';
import type { User } from '@/types/api/user';

/**
 * 用户状态管理
 * 管理用户登录状态、个人信息、语言设置、搜索历史、锁屏状态等
 */
export const useUserStore = defineStore(
  'userStore',
  () => {
    /** 语言设置 */
    const language = ref(LanguageEnum.ZH);

    /** 登录状态 */
    const isLogin = ref(false);

    /** 锁屏状态 */
    const isLock = ref(false);

    /** 锁屏密码 */
    const lockPassword = ref('');

    /** 用户信息 */
    const info = ref<Partial<User>>({});

    /** 搜索历史记录 */
    const searchHistory = ref<any[]>([]);

    /** 访问令牌 */
    const accessToken = ref('');

    /** 刷新令牌 */
    const refreshToken = ref('');

    /** 获取用户信息 */
    const getUserInfo = computed(() => info.value);

    /** 获取设置状态 */
    const getSettingState = computed(() => useSettingStore().$state);

    /** 获取工作台状态 */
    const getWorktabState = computed(() => useWorktabStore().$state);

    /** 获取用户角色编码 */
    const getUserRoleCode = computed(() => info.value.role?.code);

    /** 设置用户信息 */
    const setUserInfo = (newInfo: User) => {
      info.value = newInfo;
    };

    /** 设置登录状态 */
    const setLoginStatus = (status: boolean) => {
      isLogin.value = status;
    };

    /** 设置语言 */
    const setLanguage = (lang: LanguageEnum) => {
      setPageTitle(router.currentRoute.value);
      language.value = lang;
    };

    /** 设置搜索历史 */
    const setSearchHistory = (list: any[]) => {
      searchHistory.value = list;
    };

    /** 设置锁屏状态 */
    const setLockStatus = (status: boolean) => {
      isLock.value = status;
    };

    /** 设置锁屏密码 */
    const setLockPassword = (password: string) => {
      lockPassword.value = password;
    };

    /** 设置令牌 */
    const setToken = (newAccessToken: string, newRefreshToken?: string) => {
      accessToken.value = newAccessToken;
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken;
      }
      storage.set('accessToken', newAccessToken);
      if (newRefreshToken) {
        storage.set('refreshToken', newRefreshToken);
      }
    };

    /** 登录 */
    const login = async (username: string, password: string) => {
      const tokenInfo = await AuthApi.login({ username, password });
      setToken(tokenInfo.accessToken, tokenInfo.refreshToken);
      setLoginStatus(true);
      const userInfo = await UserApi.getCurrentUser();
      setUserInfo(userInfo);
      return tokenInfo;
    };

    /** 检查用户角色是否匹配 */
    const checkRoleCode = (roleCode: string): boolean => {
      return info.value.role?.code === roleCode;
    };

    /** 退出登录 */
    const logOut = () => {
      info.value = {};
      isLogin.value = false;
      isLock.value = false;
      lockPassword.value = '';
      accessToken.value = '';
      refreshToken.value = '';
      storage.remove('accessToken');
      storage.remove('refreshToken');
      useWorktabStore().opened = [];
      sessionStorage.removeItem('iframeRoutes');
      useMenuStore().setHomePath('');
      resetRouterState();
      router.push({ name: 'Login' });
    };

    return {
      accessToken,
      checkRoleCode,
      getSettingState,
      getUserInfo,
      getUserRoleCode,
      getWorktabState,
      info,
      isLock,
      isLogin,
      language,
      lockPassword,
      logOut,
      login,
      refreshToken,
      searchHistory,
      setLanguage,
      setLockPassword,
      setLockStatus,
      setLoginStatus,
      setSearchHistory,
      setToken,
      setUserInfo,
    };
  },
  {
    persist: {
      key: 'user',
      storage: localStorage,
    },
  },
);
