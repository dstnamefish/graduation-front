<!-- 登录注册忘记密码的页面 -->
<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- 侧边品牌展示区域 -->
    <LoginLeftView />

    <!-- 内容区域 -->
    <div class="flex-1 flex-cc relative overflow-hidden">
      <div class="w-full max-w-[520px] px-6">
        <RouterView #default="{ Component }">
          <Transition name="auth-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import LoginLeftView from '@/components/core/views/login/LoginLeftView.vue';

defineOptions({ name: 'AuthLayout' });

const route = useRoute();
</script>

<style scoped>
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: all 0.3s ease;
}

.auth-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.auth-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>