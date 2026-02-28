<template>
  <WnIconButton
    icon="local-user/settting"
    @click="openSetting"
  />
</template>

<script setup lang="ts">
import { mittBus } from '@/utils/sys';

defineOptions({ name: 'WnSetting' });

const openSetting = () => {
  mittBus.emit('openSetting');
};
</script>
