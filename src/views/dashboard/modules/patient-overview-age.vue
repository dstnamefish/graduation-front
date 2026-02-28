<template>
  <div class="p-6 rounded-3xl border border-[#e7e7e9] w-full">
    <div class="flex justify-between items-start mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Patient Overview</h2>
        <p class="text-sm text-[#666] mt-1">by Age Stages</p>
      </div>

      <button
        class="flex items-center gap-2 text-white bg-[#233956] px-3 py-2.5 rounded-xl hover:bg-[#334155] transition-colors"
      >
        Last 8 Days
        <WnSvgIcon
          icon="local-common/arrow-down"
          :size="20"
          color="#ffffff"
        />
      </button>
    </div>

    <div class="flex gap-6">
      <div
        v-for="item in legendData"
        :key="item.name"
        class="flex items-center gap-2"
      >
        <span
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: item.color }"
        ></span>
        <span class="text-sm text-[#666]">{{ item.name }}</span>
      </div>
    </div>

    <div
      ref="chartRef"
      class="w-full h-[320px]"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { useChart } from '@/hooks/core/useChart';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';

defineOptions({ name: 'PatientOverviewAge' });

const { chartRef, initChart } = useChart();

const dates = ['4 Jul', '5 Jul', '6 Jul', '7 Jul', '8 Jul', '9 Jul', '10 Jul', '11 Jul'];
const dataChild = [85, 130, 110, 125, 90, 110, 140, 135];
const dataAdult = [45, 68, 80, 95, 68, 38, 62, 80];
const dataElderly = [15, 18, 35, 8, 12, 48, 25, 18];

const legendData = [
  { name: 'Adult', color: '#5eead4' },
  { name: 'Child', color: '#243956' },
  { name: 'Elderly', color: '#dff9fa' },
];

onMounted(() => {
  initChart({
    grid: {
      top: 30,
      left: '0%',
      right: '0%',
      bottom: 40,
      containLabel: false,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      position: (point, params, dom, rect, size) => {
        const index = (params as any)[0].dataIndex;
        const isLeft = index <= dates.length / 2;
        // If on the left side of chart, show tooltip on the RIGHT (offset positive)
        // If on the right side of chart, show tooltip on the LEFT (offset negative)
        // Y position: place it above the mouse so the bottom corners (which are sharp) act as the anchor
        const x = isLeft ? point[0] + 20 : point[0] - size.contentSize[0] - 20;
        const y = point[1] - size.contentSize[1] - 20;
        return [x, y];
      },
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      shadowBlur: 0,
      extraCssText: 'box-shadow: none; border: none;',
      formatter: (params: any) => {
        const p = params as any[];
        const index = p[0].dataIndex;
        const isLeft = index <= dates.length / 2;
        const radiusClass = isLeft ? 'rounded-bl-none' : 'rounded-br-none';

        const data = legendData.map((item) => {
          const value = p.find((i: any) => i.seriesName === item.name)?.value || 0;
          return { ...item, value };
        });

        return `
          <div class="flex items-center justify-center min-w-[200px] p-3 rounded-xl ${radiusClass} bg-[#dff9fa]">
            ${data
              .map(
                (item, index) => `
              <div class="flex-1 flex flex-col items-center justify-center px-2 ${index < data.length - 1 ? 'border-r border-slate-400' : ''}">
                <div class="text-sm text-slate-500">${item.name}</div>
                <div class="text-[16px] font-extrabold text-slate-900">${item.value}</div>
              </div>
            `,
              )
              .join('')}
          </div>
        `;
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.1)',
          width: 60,
          type: 'solid',
        },
        z: 1,
      },
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 14,
        fontWeight: 'bold',
        margin: 20,
      },
    },
    yAxis: {
      type: 'value',
      max: 170,
      min: 0,
      interval: 40,
      splitLine: {
        lineStyle: {
          color: ['#e7e7e9', '#e7e7e9', '#e7e7e9', '#e7e7e9', '#e7e7e9', 'transparent'],
          type: 'solid',
        },
      },
      axisLabel: {
        color: '#62748e',
        fontSize: 16,
        margin: 20,
        formatter: (value: number) => {
          if (value < 0 || value > 160) return '';
          return value.toString();
        },
      },
    },
    series: [
      {
        name: 'Adult',
        type: 'bar',
        data: dataAdult,
        barWidth: 12,
        barGap: '20%',
        barCategoryGap: '30%',
        itemStyle: {
          color: '#5eead4',
          borderRadius: [8, 8, 0, 0],
        },
        z: 2,
      },
      {
        name: 'Child',
        type: 'bar',
        data: dataChild,
        barWidth: 12,
        barGap: '20%',
        barCategoryGap: '30%',
        itemStyle: {
          color: '#243956',
          borderRadius: [8, 8, 0, 0],
        },
        z: 2,
      },
      {
        name: 'Elderly',
        type: 'bar',
        data: dataElderly,
        barWidth: 12,
        barGap: '20%',
        barCategoryGap: '30%',
        itemStyle: {
          color: '#dff9fa',
          borderRadius: [8, 8, 0, 0],
        },
        z: 2,
      },
    ],
  });
});
</script>
