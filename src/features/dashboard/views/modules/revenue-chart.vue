<template>
  <div class="p-6 rounded-[24px] border border-[#e7e7e9] w-full bg-white">
    <div>
      <!-- Header with Title and Time Tabs -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
        <h2 class="text-2xl font-bold text-slate-800">Revenue</h2>
        <div class="bg-[#f2f3f5] p-0.5 rounded-xl flex items-center">
          <button
            v-for="tab in timeTabs"
            :key="tab"
            @click="selectedTab = tab"
            class="px-5 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
            :class="
              selectedTab === tab
                ? 'bg-[#243956] text-white shadow-sm'
                : 'text-[#666] hover:text-[#333] hover:bg-white/50'
            "
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-8 mb-6">
        <div class="flex items-center gap-2.5">
          <span class="w-3.5 h-3.5 rounded-full bg-[#243956]"></span>
          <span class="text-sm text-[#666]">Income</span>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="w-3.5 h-3.5 rounded-full bg-[#67e8f9]"></span>
          <span class="text-sm text-[#666]">Expense</span>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div
      ref="chartRef"
      class="w-full h-[320px]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';

defineOptions({ name: 'RevenueChart' });

// --- State ---
const timeTabs = ['Week', 'Month', 'Year'];
const selectedTab = ref('Week');
const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// --- Data Generation ---
const generateData = (type: string) => {
  if (type === 'Month') {
    // Current month: 1 to 30 + 2 auxiliary points
    const days = ['', ...Array.from({ length: 30 }, (_, i) => `${i + 1}`), ''];
    const income = Array.from({ length: 32 }, () => Math.floor(Math.random() * 800 + 800));
    const expense = Array.from({ length: 32 }, () => Math.floor(Math.random() * 600 + 400));
    return { x: days, income, expense };
  } else if (type === 'Year') {
    // 12 Months + 2 auxiliary points
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''];
    const income = Array.from({ length: 14 }, () => Math.floor(Math.random() * 1000 + 1000));
    const expense = Array.from({ length: 14 }, () => Math.floor(Math.random() * 800 + 500));
    return { x: months, income, expense };
  } else {
    // Week: Mon-Sun (7 days) + 2 auxiliary points (Last Sun, Next Mon)
    const weekLabels = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ''];
    const income = [800, 920, 1150, 1000, 1495, 820, 1350, 1100, 900];
    const expense = [400, 650, 420, 780, 400, 580, 350, 450, 380];
    return { x: weekLabels, income, expense };
  }
};

// --- Chart Configuration ---
const generateChartOptions = () => {
  const { x, income, expense } = generateData(selectedTab.value);
  
  // DataZoom for Month/Year to enable scrolling
  let zoomEnd = 100;
  if (selectedTab.value === 'Month') zoomEnd = (7 / 32) * 100;
  if (selectedTab.value === 'Year') zoomEnd = (6 / 14) * 100;

  const dataZoom = (selectedTab.value === 'Month' || selectedTab.value === 'Year')
    ? [
        {
          type: 'inside',
          xAxisIndex: 0,
          startValue: 0,
          endValue: selectedTab.value === 'Month' ? 6 : 5, // Show 7 days or 6 months
          zoomLock: true, // Allow panning only, not zooming scale
          filterMode: 'none', // 保持连续性：不在此处过滤掉视图外的点，确保线条能连到边缘
        },
      ]
    : [];

  return {
    color: ['#243956', '#67e8f9'],
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
      backgroundColor: '#dff9fa',
      borderColor: '#dff9fa',
      padding: [8, 16],
      textStyle: {
        color: '#1e293b',
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
      // 统一视口偏移逻辑：
      // 这里的 min/max 计算针对所有视图：
      // min: 0.5 表示从第一个辅助点和第一个正式点的中间开始
      // max: 长度 - 1.5 表示结束在最后一个正式点和最后一个辅助点的中间
      min: 0.5,
      max: x.length - 2.5,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#94a3b8',
        margin: 20,
        fontSize: 16,
        interval: 0, // 确保所有标签（Mon-Sun）都尝试显示
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e2e8f0',
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
          color: '#e2e8f0',
          type: 'solid',
          width: 2,
        },
      },
      axisLabel: {
        color: '#62748e',
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
        lineStyle: { width: 3, color: '#243956' },
        data: income,
        emphasis: {
          scale: true,
          itemStyle: {
            color: '#243956',
            borderColor: '#243956',
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
        lineStyle: { width: 3, color: '#67e8f9' },
        data: expense,
        emphasis: {
          scale: true,
          itemStyle: {
            color: '#67e8f9',
            borderColor: '#67e8f9',
            borderWidth: 3,
            opacity: 1,
          },
        },
      },
    ],
  };
};

// --- Lifecycle & Methods ---
const init = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(generateChartOptions());

  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  chartInstance?.resize();
};

watch(selectedTab, () => {
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
