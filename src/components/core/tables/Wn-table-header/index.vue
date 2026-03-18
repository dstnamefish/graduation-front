<!-- 表格头部组件：包含表格工具栏、刷新、全屏、列设置等功能 -->
<template>
  <div class="flex-cb max-md:block!" id="wn-table-header">
    <div class="flex flex-wrap items-center gap-2">
      <slot name="left"></slot>
    </div>
    <div class="flex items-center gap-2 md:justify-end max-md:mt-3 max-sm:hidden!">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WnTableHeader' });
</script>