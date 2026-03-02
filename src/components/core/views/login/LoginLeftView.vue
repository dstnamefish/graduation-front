<!-- 登录、注册、忘记密码左侧背景 -->
<template>
  <div class="flex-1 text-title-inverse relative flex-jc bg-surface-brand">
    <div class="brand-content flex flex-col items-center w-full pt-20">
      <div class="flex items-center mb-15 gap-3">
        <img src="/favicon.svg" alt="Wellnest" class="h-8 w-8"/>
        <span class="text-2xl">Wellnest</span>
      </div>

      <div class="text-center flex flex-col gap-2">
        <h1 class="text-3xl font-bold">{{ t('auth.login.welcome') }}</h1>
        <p class="opacity-80 text-md whitespace-nowrap font-medium scale-x-105">
          {{ t('auth.login.slogan') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LoginLeftView',
});

const { t } = useI18n();
</script>