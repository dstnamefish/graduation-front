<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-slate-200">403</h1>
      <h2 class="mt-4 text-2xl font-semibold text-slate-800">Access Denied</h2>
      <p class="mt-2 text-slate-500">Sorry, you do not have permission to access this page.</p>
      <WnButton class="mt-6" @click="goHome">Go Home</WnButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({ name: 'Exception403' });

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>
