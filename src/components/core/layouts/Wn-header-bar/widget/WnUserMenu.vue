<!-- 用户菜单组件：显示用户头像和名称，提供个人资料、修改密码、退出登录等功能 -->
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
        class="flex-cc gap-2 h-10 rounded-xl p-2 bg-field-muted hover:bg-field-muted-hover cursor-pointer transition-all duration-200"
      >
        <div class="w-7 h-7 rounded-lg flex-cc overflow-hidden">
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
        <span class="text-sm text-color-text-main">
          {{ userInfo?.realName || userInfo?.username || 'Guest' }}
        </span>
        <ArrowDown
          class="w-4 h-4 text-color-text-sub transition-transform duration-300"
          :class="{ 'rotate-180': isPopoverVisible }"
        />
      </div>
    </template>
    <template #default>
      <div class="p-2 rounded-xl">
        <template
          v-for="item in menuItems"
          :key="item.label"
        >
          <div
            v-if="item.hasDivider"
            class="h-[0.5px] bg-color-border my-1.5 opacity-60"
          ></div>
          <div
            class="p-2 cursor-pointer rounded-xl flex items-center gap-2 transition-colors duration-150 group hover:bg-field-muted"
            @click="handleItemClick(item.onClick)"
          >
            <component
              :is="item.icon"
              class="w-6 h-6 text-color-text-sub group-hover:text-color-text-body transition-all"
            />
            <span
              class="text-sm font-medium text-color-text-body group-hover:text-color-text-main transition-colors"
            >
              {{ t(item.label) }}
            </span>
          </div>
        </template>
      </div>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useElementSize } from '@vueuse/core';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Globe as EarthIcon,
  Lock as LockIcon,
  LogOut as ExitIcon,
  User as AvatarEmpty,
  ChevronDown as ArrowDown,
} from 'lucide-vue-next';
import { getCurrentUser } from '@/api/user';
import { logout } from '@/api/auth';
import { useUserStore } from '@/types/api/user.model';

defineOptions({ name: 'WnUserMenu' });

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const userMenuPopover = ref();
const loading = ref(false);
const imageError = ref(false);
const isPopoverVisible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const { width: triggerWidth } = useElementSize(triggerRef);

/** 用户信息 */
const userInfo = computed(() => userStore.info);

/** 菜单配置 */
const menuItems = [
  { label: 'userMenu.viewProfile', icon: EarthIcon, onClick: 'goToProfile' },
  { label: 'userMenu.changePassword', icon: LockIcon, onClick: 'goToPassword' },
  { label: 'userMenu.logout', icon: ExitIcon, onClick: 'handleLogout', hasDivider: true },
];

/** 加载用户信息 */
const loadUserInfo = async () => {
  try {
    loading.value = true;
    imageError.value = false;
    const data = await getCurrentUser();
    userStore.setUserInfo(data);
  } catch (error) {
    console.error('Failed to load user info:', error);
  } finally {
    loading.value = false;
  }
};

const goToProfile = () => {
  router.push('/profile');
  userMenuPopover.value?.hide?.();
};

const goToPassword = () => {
  router.push('/settings/security');
  userMenuPopover.value?.hide?.();
};

const handleLogout = () => {
  ElMessageBox.confirm(t('userMenu.logoutConfirm'), t('userMenu.logoutTitle'), {
    cancelButtonText: t('common.cancel'),
    confirmButtonText: t('userMenu.logout'),
    type: 'warning',
  })
    .then(async () => {
      try {
        await logout();
        userStore.logOut();
        ElMessage.success(t('userMenu.logoutSuccess'));
        userMenuPopover.value?.hide?.();
      } catch (error) {
        console.error('Logout failed:', error);
        userStore.logOut();
      }
    })
    .catch(() => {});
};

const handleItemClick = (methodName: string) => {
  if (methodName === 'goToProfile') goToProfile();
  else if (methodName === 'goToPassword') goToPassword();
  else if (methodName === 'handleLogout') handleLogout();
};

onMounted(() => {
  loadUserInfo();
});
</script>
