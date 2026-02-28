<template>
  <div class="p-6 rounded-2xl border border-[#e7e7e9] w-full">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Patient Overview</h2>
        <p class="text-sm text-[#666]">by Departments</p>
      </div>
      <button class="text-[#666] cursor-pointer">
        <WnSvgIcon
          icon="local-common/more"
          :size="20"
        />
      </button>
    </div>

    <div
      ref="chartRef"
      class="w-full h-[280px]"
    ></div>

    <div class="flex flex-col gap-3 mt-4">
      <div
        v-for="item in currentData"
        :key="item.name"
        class="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors"
      >
        <div class="flex items-center gap-3">
          <span
            class="w-2.5 h-2.5 rounded-full"
            :style="{ backgroundColor: item.color }"
          ></span>
          <span class="text-[#666]">{{ item.name }}</span>
        </div>
        <span class="">{{ item.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, markRaw } from 'vue';
import * as echarts from 'echarts';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';

defineOptions({ name: 'PatientOverviewDepartment' });

// 定义数据接口
interface ChartDataItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const timeOptions = ['This Day', 'This Week', 'This Month'];
const selectedTab = ref('This Week');

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 根据不同维度生成模拟数据
const generateData = (type: string) => {
  if (type === 'This Day') {
    return [
      { name: 'Emergency', value: 12, percentage: 40, color: '#243956' },
      { name: 'General', value: 8, percentage: 26, color: '#a2f2ef' },
      { name: 'Internal', value: 6, percentage: 20, color: '#dff9fa' },
      { name: 'Other', value: 4, percentage: 14, color: '#e6e6e8' },
    ];
  } else if (type === 'This Month') {
    return [
      { name: 'Emergency', value: 850, percentage: 32, color: '#243956' },
      { name: 'General', value: 720, percentage: 28, color: '#a2f2ef' },
      { name: 'Internal', value: 640, percentage: 25, color: '#dff9fa' },
      { name: 'Other', value: 380, percentage: 15, color: '#e6e6e8' },
    ];
  }
  // Default Week
  return [
    { name: 'Emergency Medicine', value: 35, percentage: 35, color: '#243956' },
    { name: 'General Medicine', value: 28, percentage: 28, color: '#a2f2ef' },
    { name: 'Internal Medicine', value: 20, percentage: 20, color: '#dff9fa' },
    { name: 'Other Departments', value: 17, percentage: 17, color: '#e6e6e8' },
  ];
};

const currentData = ref(generateData(selectedTab.value));

// 切换选项的逻辑
const toggleTab = () => {
  const currentIndex = timeOptions.indexOf(selectedTab.value);
  const nextIndex = (currentIndex + 1) % timeOptions.length;
  selectedTab.value = timeOptions[nextIndex];
  currentData.value = generateData(selectedTab.value);
};

const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = markRaw(echarts.init(chartRef.value));
  renderChart();
};

const renderChart = () => {
  if (!chartInstance) return;

  const option: echarts.EChartsOption = {
    tooltip: { show: false },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '38%',
        style: {
          text: 'Overall',
          fill: '#666',
          fontSize: 16,
          fontWeight: 500,
          align: 'center',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '48%',
        style: {
          text:
            selectedTab.value === 'This Day'
              ? '124'
              : selectedTab.value === 'This Month'
                ? '8,420'
                : '1,890',
          fill: '#243956',
          fontSize: 28,
          fontWeight: 800,
          align: 'center',
        },
      },
      {
        type: 'group',
        left: 'center',
        top: '64%',
        bounding: 'all', // 确保整个 文本+图标 组合在圆环中心对齐
        onclick: toggleTab,
        cursor: 'pointer',
        children: [
          {
            type: 'text',
            left: 0,
            top: 0,
            style: {
              text: selectedTab.value,
              fill: '#666',
              fontSize: 12,
              fontWeight: 500,
              align: 'left',
            },
          },
          {
            type: 'polyline', // polyline 是 ECharts 最基础的类型，兼容性最好
            // 为不同长度的文字精确设置左边距
            left:
              selectedTab.value === 'This Day' ? 52 : selectedTab.value === 'This Week' ? 60 : 68,
            top: 2, // 中心对齐微调
            shape: {
              points: [
                [0, 0],
                [5, 5],
                [10, 0],
              ], // 定义向下箭头的折线点坐标
            },
            style: {
              stroke: '#666',
              lineWidth: 1.5,
              fill: 'none',
            },
          },
        ],
      },
    ],
    series: [
      {
        name: 'Departments',
        type: 'pie',
        radius: ['62%', '84%'],
        center: ['50%', '50%'],
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 10,
        },
        data: currentData.value.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
        })),
        itemStyle: {
          borderWidth: 0,
        },
      },
    ],
  };

  chartInstance.setOption(option, true);
};

// 监听数据变化刷新图表
import { watch } from 'vue';
watch([selectedTab, currentData], () => {
  renderChart();
});

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

const handleResize = () => {
  chartInstance?.resize();
};
</script>
