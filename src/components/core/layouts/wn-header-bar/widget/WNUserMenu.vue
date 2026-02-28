<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UserInfo } from '@/types/api/core/user';
import { fetchUserInfo } from '@/api/core/user';
import { useElementSize } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ArrowDown from '@/assets/svg/common/arrow-down.svg?component';
import AvatarEmpty from '@/assets/svg/user/avatar-empty.svg?component';
import EarthIcon from '@/assets/svg/user/profile.svg?component';
import LockIcon from '@/assets/svg/user/lock.svg?component';
import ExitIcon from '@/assets/svg/user/exit.svg?component';

defineOptions({ name: 'WnUserMenu' });

const { t } = useI18n();

const menuItems = [
  {
    label: 'userMenu.viewProfile',
    icon: EarthIcon,
    onClick: 'goToProfile',
  },
  {
    label: 'userMenu.changePassword',
    icon: LockIcon,
    onClick: 'goToPassword',
  },
  {
    label: 'userMenu.logout',
    icon: ExitIcon,
    onClick: 'handleLogout',
    hasDivider: true,
  },
];

// 组件引用
const userMenuPopover = ref();

// 响应式数据
const userInfo = ref<UserInfo | null>(null);
const loading = ref(false);
const imageError = ref(false); // 图片加载失败状态

// 响应式数据：Popover 是否可见
const isPopoverVisible = ref(false);

const router = useRouter();

// 引用 trigger 元素用于计算宽度
const triggerRef = ref(null);
const { width: triggerWidth } = useElementSize(triggerRef);

// 处理点击方法映射
const handleItemClick = (methodName: string) => {
  if (methodName === 'goToProfile') goToProfile();
  else if (methodName === 'goToPassword') goToPassword();
  else if (methodName === 'handleLogout') handleLogout();
};

// 获取用户信息
const loadUserInfo = async () => {
  try {
    loading.value = true;
    imageError.value = false;
    userInfo.value = await fetchUserInfo();
  } catch (error) {
    console.error('Failed to load user info:', error);
    ElMessage.error('获取用户信息失败');
  } finally {
    loading.value = false;
  }
};

// 导航到个人资料页面
const goToProfile = () => {
  router.push('/profile');
  userMenuPopover.value?.hide?.();
};

// 导航到修改密码页面
const goToPassword = () => {
  router.push('/settings/security');
  userMenuPopover.value?.hide?.();
};

// 显示主题切换
const showThemeToggle = () => {
  // 这里可以触发主题切换逻辑
  ElMessage.info('主题切换功能');
  userMenuPopover.value?.hide?.();
};

// 处理退出登录
const handleLogout = () => {
  // 显示确认对话框
  ElMessageBox.confirm(t('userMenu.logoutConfirm'), t('userMenu.logoutTitle'), {
    cancelButtonText: t('common.cancel'),
    confirmButtonText: t('userMenu.logout'),
    type: 'warning',
  })
    .then(() => {
      // 执行退出逻辑
      ElMessage.success(t('userMenu.logoutSuccess'));
      router.push('/auth/login');
      userMenuPopover.value?.hide?.();
    })
    .catch(() => {
      // ElMessage.info(t('userMenu.cancelLogout'));
    });
};

// 组件挂载时加载用户信息
onMounted(() => {
  loadUserInfo();
});
</script>

<!-- 用户菜单-->
<template>
  <ElPopover
    ref="userMenuPopover"
    v-model:visible="isPopoverVisible"
    placement="bottom-end"
    trigger="hover"
    :show-arrow="false"
    :offset="4"
    :popper-style="{
      width: triggerWidth > 0 ? `${triggerWidth + 16}px` : 'auto',
      padding: 0,
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    }"
  >
    <template #reference>
      <div
        ref="triggerRef"
        class="flex-cc gap-2 h-10 rounded-xl p-2 bg-g-150 hover:bg-g-200 cursor-pointer transition-all duration-200"
      >
        <!-- 用户头像 -->
        <div class="w-7 h-7 rounded-lg flex-cc overflow-hidden">
          <!-- 优先展示后端图片 -->
          <img
            v-if="!loading && userInfo?.avatar && !imageError"
            :src="userInfo.avatar"
            :alt="userInfo?.realName || userInfo?.username"
            class="w-full h-full object-cover"
            @error="imageError = true"
          />
          <AvatarEmpty
            v-else
            class="w-full h-full object-cover opacity-60"
          />
        </div>

        <!-- 用户名 -->
        <span class="text-sm text-t-0">
          {{ userInfo?.realName || userInfo?.username || 'Alfredo Westervelt' }}
        </span>

        <!-- 下拉箭头 -->
        <ArrowDown
          class="w-4 h-4 text-g-500 transition-transform duration-300"
          :class="{ 'rotate-180': isPopoverVisible }"
        />
      </div>
    </template>

    <template #default>
      <div class="p-2 rounded-xl">
        <!-- 统一循环菜单项 -->
        <template
          v-for="item in menuItems"
          :key="item.label"
        >
          <!-- 分隔线 -->
          <div
            v-if="item.hasDivider"
            class="h-[0.5px] bg-br my-1.5 opacity-60"
          ></div>

          <div
            class="p-2 cursor-pointer rounded-xl flex items-center gap-2 transition-colors duration-150 group hover:bg-g-150"
            @click="handleItemClick(item.onClick)"
          >
            <component
              :is="item.icon"
              class="w-6 h-6 text-g-500 group-hover:text-g-700 transition-all"
            />
            <span class="text-sm font-medium text-g-700 group-hover:text-g-950 transition-colors">
              {{ t(item.label) }}
            </span>
          </div>
        </template>
      </div>
    </template>
  </ElPopover>
</template>
