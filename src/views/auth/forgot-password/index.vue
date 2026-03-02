<!-- 忘记密码 -->
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
        {{ t('auth.forgotPassword.title') }}
      </h2>
      <p class="text-sm text-muted">
        {{ t('auth.forgotPassword.subtitle') }}
      </p>
    </div>

    <ElTabs
      v-model="activeTab"
      class="auth-tabs mb-6"
      stretch
    >
      <ElTabPane
        :label="t('auth.forgotPassword.emailTab')"
        name="email"
      >
        <ElForm
          ref="emailFormRef"
          :model="emailForm"
          :rules="emailRules"
          labelPosition="top"
          size="large"
        >
          <ElFormItem
            :label="t('auth.forgotPassword.emailAddress')"
            prop="email"
            class="mb-5"
          >
            <ElInput
              v-model="emailForm.email"
              :placeholder="t('auth.forgotPassword.emailPlaceholder')"
            />
          </ElFormItem>

          <ElFormItem
            :label="t('auth.forgotPassword.verificationCode')"
            prop="code"
            class="mb-5"
          >
            <div class="flex gap-2 w-full">
              <ElInput
                v-model="emailForm.code"
                :placeholder="t('auth.forgotPassword.codePlaceholder')"
                class="flex-1"
              />
              <ElButton
                type="primary"
                :disabled="emailCountdown > 0"
                class="w-32"
                @click="sendEmailCode"
              >
                {{ emailCountdown > 0 ? `${emailCountdown}s` : t('auth.forgotPassword.sendCode') }}
              </ElButton>
            </div>
          </ElFormItem>
        </ElForm>
      </ElTabPane>

      <ElTabPane
        :label="t('auth.forgotPassword.phoneTab')"
        name="phone"
      >
        <ElForm
          ref="phoneFormRef"
          :model="phoneForm"
          :rules="phoneRules"
          labelPosition="top"
          size="large"
        >
          <ElFormItem
            :label="t('auth.forgotPassword.phoneNumber')"
            prop="phone"
            class="mb-5"
          >
            <ElInput
              v-model="phoneForm.phone"
              :placeholder="t('auth.forgotPassword.phonePlaceholder')"
            />
          </ElFormItem>

          <ElFormItem
            :label="t('auth.forgotPassword.verificationCode')"
            prop="code"
            class="mb-5"
          >
            <div class="flex gap-2 w-full">
              <ElInput
                v-model="phoneForm.code"
                :placeholder="t('auth.forgotPassword.codePlaceholder')"
                class="flex-1"
              />
              <ElButton
                type="primary"
                :disabled="phoneCountdown > 0"
                class="w-32"
                @click="sendPhoneCode"
              >
                {{ phoneCountdown > 0 ? `${phoneCountdown}s` : t('auth.forgotPassword.sendCode') }}
              </ElButton>
            </div>
          </ElFormItem>
        </ElForm>
      </ElTabPane>
    </ElTabs>

    <ElForm
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      labelPosition="top"
      size="large"
      class="mb-6"
    >
      <ElFormItem
        :label="t('auth.forgotPassword.newPassword')"
        prop="password"
        class="mb-5"
      >
        <ElInput
          v-model="passwordForm.password"
          type="password"
          :placeholder="t('auth.forgotPassword.newPasswordPlaceholder')"
          showPassword
        />
      </ElFormItem>
      <ElFormItem
        :label="t('auth.forgotPassword.confirmNewPassword')"
        prop="confirmPassword"
        class="mb-8"
      >
        <ElInput
          v-model="passwordForm.confirmPassword"
          type="password"
          :placeholder="t('auth.forgotPassword.confirmNewPasswordPlaceholder')"
          showPassword
        />
      </ElFormItem>

      <ElButton
        type="primary"
        class="w-full h-12"
        @click="handleReset"
      >
        {{ t('auth.forgotPassword.resetButton') }}
      </ElButton>
    </ElForm>

    <div class="mt-4 text-sm flex-cc gap-1 text-muted">
      <ElLink
        :underline="false"
        @click="goToLogin"
      >
        {{ t('auth.forgotPassword.backToLogin') }}
      </ElLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { RoutesAlias } from '@/router/routesAlias';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

defineOptions({ name: 'ForgotPassword' });

const { t } = useI18n();
const router = useRouter();
const activeTab = ref('email');

const emailFormRef = ref<FormInstance>();
const phoneFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();

const emailForm = reactive({ code: '', email: '' });
const phoneForm = reactive({ code: '', phone: '' });
const passwordForm = reactive({ confirmPassword: '', password: '' });

const emailCountdown = ref(0);
const phoneCountdown = ref(0);

let emailTimer: number | null = null;
let phoneTimer: number | null = null;

const emailRules = reactive<FormRules>({
  code: [
    { message: t('auth.forgotPassword.validation.codeRequired'), required: true, trigger: 'blur' },
  ],
  email: [
    { message: t('auth.forgotPassword.validation.emailRequired'), required: true, trigger: 'blur' },
    { message: t('auth.forgotPassword.validation.emailInvalid'), trigger: 'blur', type: 'email' },
  ],
});

const phoneRules = reactive<FormRules>({
  code: [
    { message: t('auth.forgotPassword.validation.codeRequired'), required: true, trigger: 'blur' },
  ],
  phone: [
    { message: t('auth.forgotPassword.validation.phoneRequired'), required: true, trigger: 'blur' },
    {
      message: t('auth.forgotPassword.validation.phoneInvalid'),
      pattern: /^1[3-9]\d{9}$/,
      trigger: 'blur',
    },
  ],
});

const passwordRules = reactive<FormRules>({
  confirmPassword: [
    {
      message: t('auth.forgotPassword.validation.confirmNewPasswordRequired'),
      required: true,
      trigger: 'blur',
    },
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value !== passwordForm.password) {
          callback(new Error(t('auth.forgotPassword.validation.passwordMismatch')));
        } else {
          callback();
        }
      },
    },
  ],
  password: [
    {
      message: t('auth.forgotPassword.validation.newPasswordRequired'),
      required: true,
      trigger: 'blur',
    },
    { message: t('auth.forgotPassword.validation.newPasswordLength'), min: 6, trigger: 'blur' },
  ],
});

const startCountdown = (type: 'email' | 'phone') => {
  if (type === 'email') {
    emailCountdown.value = 60;
    if (emailTimer) clearInterval(emailTimer);
    emailTimer = window.setInterval(() => {
      emailCountdown.value--;
      if (emailCountdown.value <= 0 && emailTimer) {
        clearInterval(emailTimer);
        emailTimer = null;
      }
    }, 1000);
  } else {
    phoneCountdown.value = 60;
    if (phoneTimer) clearInterval(phoneTimer);
    phoneTimer = window.setInterval(() => {
      phoneCountdown.value--;
      if (phoneCountdown.value <= 0 && phoneTimer) {
        clearInterval(phoneTimer);
        phoneTimer = null;
      }
    }, 1000);
  }
};

const sendEmailCode = async () => {
  await emailFormRef.value?.validateField('email', (valid) => {
    if (valid) {
      ElMessage.success(t('auth.forgotPassword.codeSentEmail'));
      startCountdown('email');
    }
  });
};

const sendPhoneCode = async () => {
  await phoneFormRef.value?.validateField('phone', (valid) => {
    if (valid) {
      ElMessage.success(t('auth.forgotPassword.codeSentPhone'));
      startCountdown('phone');
    }
  });
};

const handleReset = async () => {
  const isAuthValid =
    activeTab.value === 'email'
      ? await emailFormRef.value?.validate()
      : await phoneFormRef.value?.validate();

  if (!isAuthValid) {
    return;
  }

  await passwordFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success(t('auth.forgotPassword.resetSuccess'));
      router.push(RoutesAlias.Login);
    }
  });
};

const goToLogin = () => {
  router.push(RoutesAlias.Login);
};

onUnmounted(() => {
  if (emailTimer) clearInterval(emailTimer);
  if (phoneTimer) clearInterval(phoneTimer);
});
</script>
