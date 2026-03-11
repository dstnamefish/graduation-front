<template>
  <div class="w-full">
    <!-- Logo -->
    <div class="flex-cc flex-col mb-8">
      <img
        src="/favicon.svg"
        alt="Logo"
        class="w-16 h-16 drop-shadow-sm"
      />
    </div>

    <!-- 标题 -->
    <div class="text-center mb-9 space-y-2">
      <h2 class="text-2xl font-bold tracking-tight text-body">
        {{ t('auth.register.title') }}
      </h2>
      <p class="text-sm text-muted">{{ t('auth.register.subtitle') }}</p>
    </div>

    <ElForm
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      labelPosition="top"
      size="large"
    >
      <ElFormItem
        :label="t('auth.register.workId')"
        prop="username"
        class="mb-5"
      >
        <ElInput
          v-model="registerForm.username"
          :placeholder="t('auth.register.workIdPlaceholder')"
        />
      </ElFormItem>

      <ElFormItem
        :label="t('auth.register.email')"
        prop="email"
        class="mb-5"
      >
        <ElInput
          v-model="registerForm.email"
          :placeholder="t('auth.register.emailPlaceholder')"
        />
      </ElFormItem>

      <ElFormItem
        :label="t('auth.register.password')"
        prop="password"
        class="mb-5"
      >
        <ElInput
          v-model="registerForm.password"
          type="password"
          :placeholder="t('auth.register.passwordPlaceholder')"
          showPassword
        />
      </ElFormItem>

      <ElFormItem
        :label="t('auth.register.confirmPassword')"
        prop="confirmPassword"
        class="mb-8"
      >
        <ElInput
          v-model="registerForm.confirmPassword"
          type="password"
          :placeholder="t('auth.register.confirmPasswordPlaceholder')"
          showPassword
        />
      </ElFormItem>

      <ElFormItem>
        <ElButton
          type="primary"
          class="w-full h-12"
          @click="handleRegister(registerFormRef)"
        >
          {{ t('auth.register.createAccountButton') }}
        </ElButton>
      </ElFormItem>
    </ElForm>

    <div class="mt-4 text-sm flex-cc gap-1 text-muted">
      <span>{{ t('auth.register.alreadyHaveAccount') }}</span>
      <ElLink
        :underline="false"
        @click="goToLogin"
      >
        {{ t('auth.register.loginNow') }}
      </ElLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RoutesAlias } from '@/router/routesAlias';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchRegister } from '@/features/auth/api';

import { useI18n } from 'vue-i18n';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({ name: 'Register' });

const { t } = useI18n();
const router = useRouter();
const registerFormRef = ref<FormInstance>();

const registerForm = reactive({
  confirmPassword: '',
  email: '',
  password: '',
  username: '',
});

const registerRules = reactive<FormRules>({
  confirmPassword: [
    {
      message: t('auth.register.validation.confirmPasswordRequired'),
      required: true,
      trigger: 'blur',
    },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (value !== registerForm.password) {
          callback(new Error(t('auth.register.validation.passwordMismatch')));
        } else {
          callback();
        }
      },
    },
  ],
  email: [
    { message: t('auth.register.validation.emailRequired'), required: true, trigger: 'blur' },
    {
      message: t('auth.register.validation.emailInvalid'),
      trigger: ['blur', 'change'],
      type: 'email',
    },
  ],
  password: [
    { message: t('auth.register.validation.passwordRequired'), required: true, trigger: 'blur' },
    { message: t('auth.register.validation.passwordLength'), min: 6, trigger: 'blur' },
  ],
  username: [
    { message: t('auth.register.validation.workIdRequired'), required: true, trigger: 'blur' },
  ],
});

const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        await fetchRegister({
          username: registerForm.username,
          password: registerForm.password,
          email: registerForm.email,
          phone: '', // 暂时为空，后续可以添加手机号输入
        });
        ElMessage.success(t('auth.register.registrationSuccess'));
        router.push(RoutesAlias.Login);
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  });
};

const goToLogin = () => {
  router.push(RoutesAlias.Login);
};
</script>
