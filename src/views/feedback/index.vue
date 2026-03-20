<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { useTable } from '@/hooks/core/useTable';
import * as feedbackApi from '@/api/feedback';

defineOptions({ name: 'SystemFeedbackList' });

const scoreOptions = [
  { label: '5 星 (极其满意)', value: 5 },
  { label: '4 星 (比较满意)', value: 4 },
  { label: '3 星 (普通水平)', value: 3 },
  { label: '2 星 (表现不佳)', value: 2 },
  { label: '1 星 (非常不满)', value: 1 }
];

const statusOptions = [
  { label: '待处理', value: 'PENDING' },
  { label: '已处理', value: 'PROCESSED' }
];

// ======================= 表格获取 =======================
const {
  loading,
  data: tableData,
  pagination,
  searchParams: searchModel,
  handleCurrentChange,
  handleSizeChange,
  getData: handleSearch,
} = useTable({
  core: {
    // 实际生产环境切换至 feedbackApi.getFeedbackPage
    apiFn: (params: any) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            total: 3,
            list: [
              { id: 1, createTime: '2026-03-20 09:12:00', patientName: '林萧', doctorName: '李建国', score: 1, content: '医生态度非常恶劣，看病全程不过2分钟，完全没有耐心回答我的问题。', status: 'PENDING', reply: '' },
              { id: 2, createTime: '2026-03-19 14:30:22', patientName: '王大雷', doctorName: '王雪绒', score: 5, content: '医生非常专业，耐心讲解了病理，开的药也很见效，十分感谢！', status: 'PROCESSED', reply: '感谢您的认可与信任，我们将继续为您提供优质的医疗服务，祝您身体健康！' },
              { id: 3, createTime: '2026-03-18 10:05:15', patientName: '张芳', doctorName: '赵刚', score: 3, content: '排队等的时间太久了，看病中规中矩吧。', status: 'PENDING', reply: '' },
            ]
          });
        }, 300);
      });
    },
    apiParams: {
      doctorName: '',
      score: undefined,
      status: undefined
    },
    paginationKey: { current: 'pageNum', size: 'pageSize' },
    immediate: true,
  },
});

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'doctorName',
    type: 'input',
    props: {
      placeholder: '被评价医生姓名',
      style: { width: '220px' },
    },
  },
  {
    key: 'score',
    type: 'select',
    props: {
      placeholder: '所有评分',
      options: [{ label: '全部评分', value: undefined }, ...scoreOptions],
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: '处理状态',
      options: [{ label: '所有状态', value: undefined }, ...statusOptions],
      fitInputWidth: true,
    },
  }
]);

const columns = computed(() => [
  { label: '评价时间', prop: 'createTime', minWidth: 160 },
  { label: '患者姓名', prop: 'patientName', minWidth: 120 },
  { label: '被评价医生', prop: 'doctorName', minWidth: 140 },
  { label: '评分评估', prop: 'score', minWidth: 140, useSlot: true },
  { label: '评价内容', prop: 'content', minWidth: 260, useSlot: true },
  { label: '当前状态', prop: 'status', minWidth: 120, useSlot: true, align: 'center' },
  { label: '处理操作', prop: 'action', minWidth: 140, useSlot: true, align: 'center' },
]);

// ======================= 抽屉回复 =======================
const drawerVisible = ref(false);
const activeFeedback = ref<any>(null);
const replyInput = ref('');
const submitting = ref(false);

const handleViewFeedback = (row: any) => {
  activeFeedback.value = row;
  replyInput.value = row.reply || '';
  drawerVisible.value = true;
};

const handleSubmitReply = async () => {
  if (!replyInput.value.trim()) {
    ElMessage.warning('请输入有效的回复内容');
    return;
  }
  
  submitting.value = true;
  try {
    // 实际生产调用
    // await feedbackApi.replyFeedback(activeFeedback.value.id, replyInput.value);
    
    ElMessage.success('管理员回复提交成功！');
    drawerVisible.value = false;
    handleSearch();
  } catch (e) {
    ElMessage.error('回复提交失败');
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="h-full bg-slate-50 p-6 flex flex-col overflow-hidden">
    <!-- 主体容器设计 -->
    <div class="bg-white rounded-[2rem] shadow-soft p-6 flex flex-col flex-1 min-h-0 border border-slate-100/50 feedback-wrapper">
      
      <!-- 极简过滤头 -->
      <WnTableHeader class="shrink-0 mb-6 px-2">
        <template #left>
          <div class="flex items-center gap-5">
            <div>
               <h2 class="text-xl font-bold text-slate-800 tracking-tight">医患反馈管理</h2>
               <p class="text-[13px] text-slate-500 mt-1">处理医院日常纠纷、患者评价回访，关注医护服务质量考核。</p>
            </div>
          </div>
        </template>
        <template #right>
          <WnSearchBar
            v-model="searchModel"
            :items="searchItems"
            @keyup.enter="handleSearch"
            search-bar-background="white"
          />
        </template>
      </WnTableHeader>

      <!-- 核心无框美化表格 -->
      <div
        class="flex-1 min-h-0 relative transition-opacity duration-300 px-3"
        :class="{ 'opacity-50 pointer-events-none': loading }"
      >
        <WnTable
          ref="tableRef"
          :loading="loading"
          :pagination="pagination"
          :data="tableData"
          :columns="columns"
          @pagination:size-change="handleSizeChange"
          @pagination:current-change="handleCurrentChange"
        >
          <!-- 评分处理：3星及以下标红，4-5星金色 -->
          <template #score="{ row }">
            <div 
              class="flex items-center gap-1.5 font-bold tracking-widest text-[16px]"
              :class="row.score <= 3 ? 'text-rose-500' : 'text-amber-400'"
            >
              <div class="flex">
                 <WnSvgIcon v-for="i in row.score" :key="i" icon="solar:star-bold" :size="16" />
                 <!-- 补齐灰色星星 -->
                 <WnSvgIcon v-for="i in (5 - row.score)" :key="`blank-${i}`" icon="solar:star-linear" :size="16" class="text-slate-200" />
              </div>
              <span class="ml-2 text-[13px] font-black" :class="row.score <= 3 ? 'text-rose-600' : 'text-amber-500'">{{ row.score }}.0</span>
            </div>
          </template>

          <!-- 评价内容 (优雅切断) -->
          <template #content="{ row }">
             <div class="truncate max-w-[280px] text-slate-700 font-medium text-[13px]" :title="row.content">
                {{ row.content }}
             </div>
          </template>

          <!-- 状态指示 -->
          <template #status="{ row }">
            <span 
              v-if="row.status === 'PENDING'"
              class="inline-block bg-amber-50 text-amber-600 border border-amber-100/60 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              待处理
            </span>
            <span 
              v-else-if="row.status === 'PROCESSED'"
              class="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100/60 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              已处理
            </span>
          </template>

          <!-- 操作按钮 -->
          <template #action="{ row }">
            <div 
              class="inline-flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl active:scale-95 transition-colors border border-slate-200/50"
              @click="handleViewFeedback(row)"
            >
              <WnSvgIcon :icon="row.status === 'PENDING' ? 'lucide:message-square-plus' : 'lucide:eye'" :size="14" class="text-slate-500" />
              <span class="text-[12px] font-bold text-slate-600">{{ row.status === 'PENDING' ? '回 复' : '查 看' }}</span>
            </div>
          </template>
        </WnTable>
      </div>
    </div>

    <!-- 侧边处理面板 Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="处理反馈/评价"
      size="500px"
      append-to-body
      destroy-on-close
    >
      <div v-if="activeFeedback" class="flex flex-col h-full bg-slate-50 relative">
        <!-- 头部反馈信息流展示 -->
        <div class="bg-white px-8 py-6 mb-4 border-b border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] shrink-0">
           <div class="flex items-start justify-between mb-4">
              <div>
                 <h3 class="text-lg font-black text-slate-800 tracking-tight">{{ activeFeedback.patientName }} 的反馈意见</h3>
                 <p class="text-xs font-semibold text-slate-400 mt-1 uppercase">{{ activeFeedback.createTime }}</p>
              </div>
              <!-- 打分区域复刻 -->
              <div 
                class="flex items-center gap-0.5"
                :class="activeFeedback.score <= 3 ? 'text-rose-500' : 'text-amber-400'"
              >
                 <WnSvgIcon v-for="i in activeFeedback.score" :key="i" icon="solar:star-bold" :size="20" />
              </div>
           </div>
           
           <!-- 指向医生 -->
           <div class="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl mb-4 border border-blue-50">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                 <WnSvgIcon icon="solar:stethoscope-bold-duotone" :size="18" />
              </div>
              <p class="text-[13px] font-medium text-slate-700">服务当事医生：<span class="font-bold text-slate-900">{{ activeFeedback.doctorName }}</span></p>
           </div>
           
           <!-- 留言本体 -->
           <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <WnSvgIcon icon="foundation:quote" :size="28" class="text-slate-200 absolute -translate-x-1 -translate-y-2 opacity-50" />
              <p class="text-sm font-medium text-slate-700 leading-relaxed relative z-10 break-words">
                 {{ activeFeedback.content }}
              </p>
           </div>
        </div>
        
        <!-- 官方处理录入区 -->
        <div class="flex-1 bg-white px-8 py-6 flex flex-col gap-4 relative">
           <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2">
             <WnSvgIcon icon="lucide:message-circle" :size="16" class="text-slate-400" />
             院方跟进回复记录
           </h4>
           <div class="flex-1 relative">
              <textarea 
                v-model="replyInput" 
                class="w-full h-full min-h-[160px] max-h-[220px] resize-none border-2 border-slate-100 focus:border-blue-500 rounded-2xl p-4 text-sm font-medium text-slate-700 outline-none transition-colors"
                placeholder="作为科室主管或总务，请在此处填写针对该评价的处理措施、致歉文案或其他备注。点击提交后该工单将被标记为已处理..."
                :readonly="activeFeedback.status === 'PROCESSED'"
              ></textarea>
              <div v-if="activeFeedback.status === 'PROCESSED'" class="absolute inset-0 bg-slate-50/50 rounded-2xl flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
                  <span class="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold rounded-xl text-[12px] tracking-wider uppercase">官方人员早已处理完毕</span>
              </div>
           </div>
        </div>
        
        <!-- 操作按钮防线 -->
        <div 
          v-if="activeFeedback.status === 'PENDING'"
          class="px-6 py-5 bg-white border-t border-slate-100 grid grid-cols-2 gap-4 shrink-0 shadow-[0_-15px_20px_-10px_rgba(0,0,0,0.02)]"
        >
           <WnButton 
             type="default"
             class="w-full !rounded-xl !py-5"
             @click="drawerVisible = false"
           >
             暂不处理
           </WnButton>
           <WnButton 
             type="primary"
             class="w-full !rounded-xl !py-5 shadow-md shadow-blue-500/20"
             :loading="submitting"
             @click="handleSubmitReply"
           >
             保存回复并归档
           </WnButton>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
/* 深度干掉 B 端刺眼的传统表格线条，向 C 端卡片质感靠拢 */
.feedback-wrapper :deep(.el-table) {
  --el-table-border-color: #f8fafc; /* slate-50极淡 */
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  background-color: transparent;
}
.feedback-wrapper :deep(.el-table th.el-table__cell) {
  border-bottom: 2px solid #f1f5f9 !important; /* slate-100 */
  color: #94a3b8; 
  font-weight: 700;
  padding: 18px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 13px;
}
.feedback-wrapper :deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid #f8fafc !important; /* slate-50 */
  padding: 20px 0;
  transition: all 0.3s ease;
}
.feedback-wrapper :deep(.el-table__row:hover td.el-table__cell) {
  background-color: #f8fafc !important; /* hover极为克制 */
}
/* 消灭边界包裹线与伪元素 */
.feedback-wrapper :deep(.el-table--border::after),
.feedback-wrapper :deep(.el-table--group::after),
.feedback-wrapper :deep(.el-table::before),
.feedback-wrapper :deep(.el-table__inner-wrapper::before) {
  display: none !important;
}

/* 抽屉原生头部克隆并改造为不可见，由手动实现控制 */
:deep(.el-drawer__header) {
  display: none !important;
}
:deep(.el-drawer__body) {
  padding: 0 !important;
  overflow: hidden;
}
</style>
