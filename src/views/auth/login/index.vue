<!-- 登录页面 -->
<template>
  <div class="w-full">
    <!-- Logo -->
    <div class="flex-cc flex-col mb-8">
      <img src="/favicon.svg" alt="Logo" class="w-16 h-16 drop-shadow-sm" />
    </div>

    <!-- 标题 -->
    <div class="text-center mb-9 space-y-2">
      <h2 class="text-2xl font-bold tracking-tight text-t-100">
        {{ t('auth.login.title') }}
      </h2>
      <p class="text-sm text-t-200">
        {{ t('auth.login.subtitle') }}
      </p>
    </div>

    <!-- 表单 -->
    <ElForm ref="loginFormRef" :model="loginForm" :rules="rules" labelPosition="top" size="large">
      <ElFormItem :label="t('auth.login.workId')" prop="username" class="mb-6">
        <ElInput v-model="loginForm.username" :placeholder="t('auth.login.workIdPlaceholder')" />
      </ElFormItem>

      <ElFormItem :label="t('auth.login.password')" prop="password" class="mb-4">
        <ElInput v-model="loginForm.password" type="password" :placeholder="t('auth.login.passwordPlaceholder')" showPassword/>
      </ElFormItem>

      <!-- 记住我和忘记密码 -->
      <div class="flex-cb mb-8">
        <div class="flex-ic gap-2">
          <ElCheckbox v-model="loginForm.remember" class="mr-0!" />
          <span class="text-sm text-t-200 cursor-pointer select-none" @click="loginForm.remember = !loginForm.remember">
            {{ t('auth.login.rememberMe') }}
          </span>
        </div>
        <ElLink :underline="false" @click="goToForgotPassword">
          {{ t('auth.login.forgotPassword') }}
        </ElLink>
      </div>

      <!-- 登录按钮 -->
      <ElFormItem>
        <ElButton type="primary" class="w-full h-12" @click="handleLogin(loginFormRef)">
          {{ t('auth.login.loginButton') }}
        </ElButton>
      </ElFormItem>
    </ElForm>

    <!-- 注册 -->
    <div class="mt-4 text-sm flex-cc gap-1 text-t-200">
      <span>{{ t('auth.login.noAccount') }}</span>
      <ElLink :underline="false" @click="goToRegister">
        {{ t('auth.login.registerNow') }}
      </ElLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { fetchLogin } from '@/api/core/auth';
import { RoutesAlias } from '@/router/routesAlias';
import { useUserStore } from '@/store/modules/user';

defineOptions({ name: 'Login' });

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const loginFormRef = ref<FormInstance>();

const loginForm = reactive({
  password: '',
  remember: false,
  username: '',
});

const rules: FormRules = {
  password: [
    { message: t('auth.login.validation.passwordRequired'), required: true, trigger: 'blur' },
    { message: t('auth.login.validation.passwordLength'), min: 6, trigger: 'blur' },
  ],
  username: [
    { message: t('auth.login.validation.workIdRequired'), required: true, trigger: 'blur' },
  ],
};

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const res = await fetchLogin({
          password: loginForm.password,
          username: loginForm.username,
        });

        userStore.setToken(res.accessToken, res.refreshToken);
        userStore.setLoginStatus(true);

        if (!loginForm.remember) {
          loginForm.remember = true;
        }

        ElMessage.success(t('auth.login.loginSuccess'));

        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else {
      ElMessage.error(t('auth.login.validation.checkInputs'));
    }
  });
};

const goToRegister = () => {
  router.push(RoutesAlias.Register);
};

const goToForgotPassword = () => {
  router.push(RoutesAlias.ForgotPassword);
};
</script>