<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-2xl font-extrabold text-slate-400">About</h3>
    <p class="text-slate-500 leading-relaxed text-sm md:text-base font-medium">
      {{ props.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DetailAbout' });

const props = defineProps<{
  description: string;
}>();
</script>
