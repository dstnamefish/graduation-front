<template>
  <ElRow
    :gutter="24"
    class="flex flex-wrap"
  >
    <ElCol
      v-for="(item, index) in dataList"
      :key="index"
      :xs="24"
      :sm="12"
      :md="6"
      :lg="6"
    >
      <div
        class="group relative flex flex-col justify-between px-6 py-6 rounded-2xl border border-border transition-all duration-300 hover:shadow-sm hover:border-border-strong"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <WnSvgIcon
              :icon="item.iconName"
              :size="20"
              class="text-muted"
            />
            <span class="text-sm font-medium text-muted leading-5">{{ item.title }}</span>
          </div>

          <button
            class="text-placeholder hover:text-action-text transition-colors cursor-pointer p-1 -mr-1"
          >
            <WnSvgIcon
              icon="hugeicons:more-horizontal"
              :size="20"
              class="text-placeholder group-hover:text-action-text"
            />
          </button>
        </div>

        <div class="flex items-center justify-between mt-4">
          <span class="text-3xl font-bold text-title tracking-tight leading-9">
            {{ item.value.toLocaleString() }}
          </span>

          <div
            class="flex items-center px-2 py-1 rounded-lg text-xs text-title font-medium"
            :class="item.trendPercent >= 0 ? 'bg-accent-background' : 'bg-destructive-bg'"
          >
            <WnSvgIcon
              :icon="
                item.trendPercent >= 0 ? 'iconamoon:trend-up-light' : 'iconamoon:trend-down-light'
              "
              :size="16"
              class="mr-1"
            />
            <span class="leading-4">
              {{ item.trendPercent > 0 ? '+' : '' }}{{ item.trendPercent }}%
            </span>
          </div>
        </div>

        <div
          class="text-xs text-placeholder font-regular mt-2 flex items-center gap-1 leading-4"
        >
          <span>{{ Math.abs(item.changeValue) }}</span>
          <span>{{ item.changeValue >= 0 ? 'more' : 'less' }}</span>
          <span>than yesterday</span>
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
defineOptions({ name: 'CardList' });

interface CardDataItem {
  iconName: string;
  title: string;
  value: number;
  trendPercent: number;
  changeValue: number;
}

const dataList = reactive<CardDataItem[]>([
  {
    iconName: 'ph:users',
    title: 'Total Invoice',
    value: 1287,
    trendPercent: 2.14,
    changeValue: 56,
  },
  {
    iconName: 'uil:user-circle',
    title: 'Total Patients',
    value: 965,
    trendPercent: 3.78,
    changeValue: 45,
  },
  {
    iconName: 'mdi:calendar-check-outline',
    title: 'Appointments',
    value: 128,
    trendPercent: -1.56,
    changeValue: -18,
  },
  {
    iconName: 'ph:bed-light',
    title: 'Bedroom',
    value: 315,
    trendPercent: 1.64,
    changeValue: 56,
  },
]);
</script>