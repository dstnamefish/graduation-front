<template>
  <div class="min-h-screen flex relative">
    <AuthTopBar />
    <LoginLeftView class="hidden md:flex md:w-1/2" />
    <div class="flex flex-1 items-center justify-center p-8 bg-surface">
      <div class="w-full max-w-md">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginLeftView from '@/components/core/views/login/LoginLeftView.vue';
import AuthTopBar from '@/components/core/views/login/AuthTopBar.vue';

defineOptions({ name: 'AuthLayout' });
</script>
