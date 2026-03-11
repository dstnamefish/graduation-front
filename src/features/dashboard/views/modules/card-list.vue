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
        class="group relative flex flex-col justify-between px-6 py-6 rounded-[24px] border border-[#e7e7e9] transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <WnSvgIcon
              :icon="getIcon(item.iconName)"
              :size="20"
              color="#666"
            />
            <span class="text-sm font-medium text-slate-500 leading-[21px]">{{ item.title }}</span>
          </div>

          <button
            class="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer p-1 -mr-1"
          >
            <WnSvgIcon
              icon="local-common/more"
              :size="20"
              color="#666"
            />
          </button>
        </div>

        <div class="flex items-center justify-between mt-4">
          <span class="text-[30px] font-bold text-slate-900 tracking-tight leading-[36px]">
            {{ item.value.toLocaleString() }}
          </span>

          <div
            class="flex items-center px-2 py-1 rounded-lg text-[12px] font-medium"
            :class="item.trendPercent >= 0 ? 'bg-[#a1f1ee]' : 'bg-[#ffbabc]'"
          >
            <WnSvgIcon
              :icon="
                item.trendPercent >= 0 ? 'local-dashboard/trend-up' : 'local-dashboard/trend-down'
              "
              :size="12"
              class="mr-1"
            />
            <span class="leading-[18px]">
              {{ item.trendPercent > 0 ? '+' : '' }}{{ item.trendPercent }}%
            </span>
          </div>
        </div>

        <div
          class="text-[12px] text-slate-400 font-regular mt-2 flex items-center gap-1 leading-[18px]"
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

const getIcon = (name: string) => `local-dashboard/${name}`;

interface CardDataItem {
  iconName: string;
  title: string;
  value: number;
  trendPercent: number;
  changeValue: number;
}

const dataList = reactive<CardDataItem[]>([
  {
    iconName: 'invoice',
    title: 'Total Invoice',
    value: 1287,
    trendPercent: 2.14,
    changeValue: 56,
  },
  {
    iconName: 'patients',
    title: 'Total Patients',
    value: 965,
    trendPercent: 3.78,
    changeValue: 45,
  },
  {
    iconName: 'appt',
    title: 'Appointments',
    value: 128,
    trendPercent: -1.56,
    changeValue: -18,
  },
  {
    iconName: 'bed',
    title: 'Bedroom',
    value: 315,
    trendPercent: 1.64,
    changeValue: 56,
  },
]);
</script>
