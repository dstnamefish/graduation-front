<template>
  <div class="p-6 rounded-3xl border border-border w-full bg-surface">
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
        <h2 class="text-2xl font-bold text-title">Revenue</h2>
        <WnTabSwitch
          v-model="selectedTab"
          :options="timeTabOptions"
          type="status"
        />
      </div>

      <div class="flex items-center gap-8 mb-6">
        <div class="flex items-center gap-2.5">
          <span class="w-3.5 h-3.5 rounded-full" style="background-color: var(--color-slate-800)"></span>
          <span class="text-sm text-muted">Income</span>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="w-3.5 h-3.5 rounded-full" style="background-color: var(--color-primary-400)"></span>
          <span class="text-sm text-muted">Expense</span>
        </div>
      </div>
    </div>

    <div
      ref="chartRef"
      class="w-full h-[320px]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import WnTabSwitch from '@/components/core/widget/Wn-tab-switch/index.vue';
import { useSettingStore } from '@/store/setting';

defineOptions({ name: 'RevenueChart' });

const timeTabOptions = [
  { label: 'Week', value: 'Week' },
  { label: 'Month', value: 'Month' },
  { label: 'Year', value: 'Year' },
];
const selectedTab = ref('Week');
const settingStore = useSettingStore();
const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const generateData = (type: string) => {
  if (type === 'Month') {
    const days = ['', ...Array.from({ length: 30 }, (_, i) => `${i + 1}`), ''];
    const income = Array.from({ length: 32 }, () => Math.floor(Math.random() * 800 + 800));
    const expense = Array.from({ length: 32 }, () => Math.floor(Math.random() * 600 + 400));
    return { x: days, income, expense };
  } else if (type === 'Year') {
    const months = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      '',
    ];
    const income = Array.from({ length: 14 }, () => Math.floor(Math.random() * 1000 + 1000));
    const expense = Array.from({ length: 14 }, () => Math.floor(Math.random() * 800 + 500));
    return { x: months, income, expense };
  } else {
    const weekLabels = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ''];
    const income = [800, 920, 1150, 1000, 1495, 820, 1350, 1100, 900];
    const expense = [400, 650, 420, 780, 400, 580, 350, 450, 380];
    return { x: weekLabels, income, expense };
  }
};

const currentData = ref(generateData(selectedTab.value));

const generateChartOptions = () => {
  const c = (val: string) => val.startsWith('var(') ? getCssVar(val.slice(4, -1)).trim() : val;
  const { x, income, expense } = currentData.value;

  let zoomEnd = 100;
  if (selectedTab.value === 'Month') zoomEnd = (7 / 32) * 100;
  if (selectedTab.value === 'Year') zoomEnd = (6 / 14) * 100;

  const dataZoom =
    selectedTab.value === 'Month' || selectedTab.value === 'Year'
      ? [
          {
            type: 'inside',
            xAxisIndex: 0,
            startValue: 0,
            endValue: selectedTab.value === 'Month' ? 6 : 5,
            zoomLock: true,
            filterMode: 'none',
          },
        ]
      : [];

  return {
    color: [c('var(--color-slate-800)'), c('var(--color-primary-400)')],
    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
    dataZoom: dataZoom as any,
    grid: {
      left: '0',
      right: '2%',
      bottom: '5%',
      top: '5%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: c('var(--color-primary-100)'),
      borderColor: c('var(--color-primary-100)'),
      padding: [8, 16],
      textStyle: {
        color: c('var(--color-slate-900)'),
        fontSize: 14,
        fontWeight: 'bold',
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 12px;',
      formatter: (params: any) => {
        return `$${Number(params.value).toLocaleString()}`;
      },
    },
    xAxis: {
      type: 'category',
      data: x,
      boundaryGap: true,
      min: 0.5,
      max: x.length - 2.5,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: c('var(--color-slate-400)'),
        margin: 20,
        fontSize: 16,
        interval: 0,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: c('var(--color-slate-200)'),
          type: 'solid',
          width: 1,
        },
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      splitNumber: 4,
      splitLine: {
        show: true,
        lineStyle: {
          color: c('var(--color-slate-200)'),
          type: 'solid',
          width: 2,
        },
      },
      axisLabel: {
        color: c('var(--color-slate-400)'),
        fontSize: 16,
        margin: 16,
        formatter: (value: number) => {
          if (value >= 1000) {
            return (value / 1000).toFixed(1).replace('.0', '') + 'K';
          }
          return value + '';
        },
      },
    },
    series: [
      {
        name: 'Income',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 12,
        itemStyle: {
          color: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 0,
        },
        lineStyle: { width: 3, color: c('var(--color-slate-800)') },
        data: income,
        emphasis: {
          scale: true,
          itemStyle: {
            color: c('var(--color-slate-800)'),
            borderColor: c('var(--color-slate-800)'),
            borderWidth: 3,
            opacity: 1,
          },
        },
      },
      {
        name: 'Expense',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 12,
        itemStyle: {
          color: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 0,
        },
        lineStyle: { width: 3, color: c('var(--color-primary-400)') },
        data: expense,
        emphasis: {
          scale: true,
          itemStyle: {
            color: c('var(--color-primary-400)'),
            borderColor: c('var(--color-primary-400)'),
            borderWidth: 3,
            opacity: 1,
          },
        },
      },
    ],
  };
};

const init = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(generateChartOptions());

  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  chartInstance?.resize();
};

watch([selectedTab, () => settingStore.isDark], ([newTab], [oldTab]) => {
  if (newTab !== oldTab) {
    currentData.value = generateData(newTab as string);
  }
  if (chartInstance) {
    chartInstance.setOption(generateChartOptions());
  }
});

onMounted(() => {
  nextTick(() => {
    init();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});
</script>
