<!-- 表格头部，包含表格大小、刷新、全屏、列设置、其他设置 -->
<template>
  <div
    class="flex-cb max-md:block! p-6!"
    id="wn-table-header"
  >
    <div class="flex flex-wrap items-center gap-3">
      <slot name="left"></slot>
    </div>

    <div class="flex-c md:justify-end max-md:mt-3 max-sm:hidden!">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'WnTableHeader' });
</script>
