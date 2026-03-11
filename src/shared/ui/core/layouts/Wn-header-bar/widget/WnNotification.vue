<template>
  <WnIconButton
    icon="local-user/notification"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { mittBus } from '@/shared/lib/utils/sys';

defineOptions({ name: 'WnNotification' });

const handleClick = () => {
  mittBus.emit('openNotification');
};
</script>
