<template>
  <WnIconButton
    icon="local-user/settting"
    @click="openSetting"
  />
</template>

<script setup lang="ts">
import { mittBus } from '@/shared/lib/utils/sys';

defineOptions({ name: 'WnSetting' });

const openSetting = () => {
  mittBus.emit('openSetting');
};
</script>
