<template>
  <div class="flex flex-col gap-6">
    <!-- 统计总计卡片 -->
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-surface rounded-3xl p-6 flex items-center justify-between border border-border flex-1">
        <div class="flex items-center gap-4">
          <!-- 图标容器 -->
          <div class="w-16 h-16 rounded-[20px] bg-accent text-primary flex items-center justify-center shrink-0">
            <WnSvgIcon icon="ri:account-circle-line" :size="32" />
          </div>
          <!-- 数值与标签 -->
          <div class="flex flex-col justify-center">
            <p class="text-[13px] font-medium text-muted mb-1">{{ t('doctors.stats.totalPatients') }}</p>
            <h2 class="text-3xl font-bold text-title leading-none">{{ stats.totalPatients }}</h2>
          </div>
        </div>
        <!-- 更多操作按钮 -->
        <WnIconButton icon="ri:more-2-fill" :size="20" class="text-muted shrink-0" />
      </div>

      <div class="bg-surface rounded-3xl p-6 flex items-center justify-between border border-border flex-1">
        <div class="flex items-center gap-4">
          <!-- 图标容器 -->
          <div class="w-16 h-16 rounded-[20px] bg-accent text-primary flex items-center justify-center shrink-0">
            <WnSvgIcon icon="ri:calendar-line" :size="32" />
          </div>
          <!-- 数值与标签 -->
          <div class="flex flex-col justify-center">
            <p class="text-[13px] font-medium text-muted mb-1">{{ t('doctors.stats.totalAppointments') }}</p>
            <h2 class="text-3xl font-bold text-title leading-none">{{ stats.totalAppointments }}</h2>
          </div>
        </div>
        <!-- 更多操作按钮 -->
        <WnIconButton icon="ri:more-2-fill" :size="20" class="text-muted shrink-0" />
      </div>
    </div>

    <!-- Appointment Stats Graph -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[360px]">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-lg font-extrabold text-slate-800">{{ t('doctors.stats.appointmentStats') }}</h3>
        <select class="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl outline-none appearance-none cursor-pointer pr-10 relative shadow-md">
          <option>{{ t('doctors.stats.thisWeek') }}</option>
          <option>{{ t('doctors.stats.lastWeek') }}</option>
        </select>
      </div>

      <!-- ECharts 图表容器 -->
      <div class="flex-1 w-full relative min-h-[240px] mt-4">
        <div ref="chartRef" class="w-full h-full"></div>
      </div>

      <!-- 底部统计摘要 -->
      <div class="grid grid-cols-3 gap-6 bg-surface-sunken rounded-2xl p-4 mt-6">
        <div class="flex flex-col border-l-4 border-primary-300 pl-3">
          <span class="text-lg font-bold text-title">{{ totalAppts }}</span>
          <span class="text-[11px] font-medium text-muted">{{ t('doctors.stats.totalAppointments') }}</span>
        </div>
        <div class="flex flex-col border-l-4 border-slate-800 pl-3">
          <span class="text-lg font-bold text-title">{{ totalNew }}</span>
          <span class="text-[11px] font-medium text-muted">{{ t('doctors.stats.newPatients') }}</span>
        </div>
        <div class="flex flex-col border-l-4 border-primary-200 pl-3">
          <span class="text-lg font-bold text-title">{{ totalFollowUp }}</span>
          <span class="text-[11px] font-medium text-muted">{{ t('doctors.stats.followUpPatients') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, markRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';
import type { DayStat } from '@/types/doctor';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';

defineOptions({ name: 'DetailStats' });

const { t } = useI18n();

const props = defineProps<{
  stats: { totalPatients: number; totalAppointments: number };
  data: DayStat[];
}>();

// 底部统计计算
const totalNew = computed(() => props.data.reduce((acc, curr) => acc + curr.newPatient, 0));
const totalFollowUp = computed(() => props.data.reduce((acc, curr) => acc + curr.followUpPatient, 0));
const totalAppts = computed(() => totalNew.value + totalFollowUp.value);

// ECharts 图表逻辑
const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  if (!chartInstance) {
    chartInstance = markRaw(echarts.init(chartRef.value));
  }

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      textStyle: { color: 'var(--color-body)', fontSize: 12 },
      padding: [12, 16],
      borderRadius: 12,
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowBlur: 10,
    },
    grid: {
      top: 20,
      right: 0,
      bottom: 0,
      left: 0,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.day),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { 
        color: 'var(--color-muted)', 
        fontSize: 11, 
        fontWeight: 'bold', 
        margin: 16,
        formatter: (value: string) => value.substring(0, 3), // 简写周几
      }
    },
    yAxis: {
      type: 'value',
      splitLine: { 
        lineStyle: { type: 'dashed', color: 'var(--color-border)' } 
      },
      axisLabel: { 
        color: 'var(--color-placeholder)', 
        fontSize: 11, 
        fontWeight: 'bold' 
      }
    },
    series: [
      {
        name: 'New Patient',
        type: 'bar',
        stack: 'total',
        barWidth: 40,
        itemStyle: { 
          color: 'var(--color-slate-800)', 
          borderRadius: [0, 0, 8, 8], // 下半部分圆角
        },
        data: props.data.map((d) => d.newPatient),
      },
      {
        name: 'Follow-Up Patient',
        type: 'bar',
        stack: 'total',
        barWidth: 40,
        itemStyle: { 
          color: 'var(--color-primary-300)', 
          borderRadius: [8, 8, 0, 0], // 上半部分圆角
        },
        data: props.data.map((d) => d.followUpPatient),
      }
    ]
  };
  
  chartInstance.setOption(option);
};

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  chartInstance?.dispose();
  window.removeEventListener('resize', handleResize);
});

// 当数据更新时重绘图表
watch(() => props.data, () => {
  initChart();
}, { deep: true });
</script>
