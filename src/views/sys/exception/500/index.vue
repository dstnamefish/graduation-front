<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-slate-200">500</h1>
      <h2 class="mt-4 text-2xl font-semibold text-slate-800">Internal Server Error</h2>
      <p class="mt-2 text-slate-500">Sorry, something went wrong on our end.</p>
      <WnButton class="mt-6" @click="handleGoHome">Go Home</WnButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/types/api/user.model';

defineOptions({ name: 'Exception500' });

const userStore = useUserStore();

const handleGoHome = () => {
  userStore.logOut();
};
</script>
