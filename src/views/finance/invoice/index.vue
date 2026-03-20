<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTable } from '@/hooks/core/useTable';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';

defineOptions({ name: 'FinanceInvoiceList' });

// ===================== 顶部统计卡片数据 =====================
const statistics = ref({
  totalIncome: 142580.50,
  totalRefund: 3650.00,
  pendingOrders: 128
});

// ===================== 表格数据查询 =====================
const {
  loading,
  data: tableData,
  pagination,
  handleCurrentChange,
  handleSizeChange,
} = useTable({
  core: {
    // 模拟后端 API
    apiFn: (params: any) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            total: 6,
            list: [
              { id: 1, invoiceNo: 'INV20260320001', patientName: '张建国', type: '挂号费', amount: 50.00, status: 'PAID', createTime: '2026-03-20 08:30:15' },
              { id: 2, invoiceNo: 'INV20260320002', patientName: '李梦琪', type: '处方费', amount: 365.20, status: 'PENDING', createTime: '2026-03-20 09:15:22' },
              { id: 3, invoiceNo: 'INV20260320003', patientName: '王大锤', type: '检查费', amount: 850.00, status: 'PAID', createTime: '2026-03-20 09:45:00' },
              { id: 4, invoiceNo: 'INV20260320004', patientName: '赵小宝', type: '挂号费', amount: 20.00, status: 'REFUNDED', createTime: '2026-03-20 10:10:05' },
              { id: 5, invoiceNo: 'INV20260320005', patientName: '孙雨婷', type: '住院押金', amount: 5000.00, status: 'PAID', createTime: '2026-03-20 11:20:45' },
              { id: 6, invoiceNo: 'INV20260320006', patientName: '钱多多', type: '材料费', amount: 158.50, status: 'PENDING', createTime: '2026-03-20 13:05:10' },
            ]
          });
        }, 400);
      });
    },
    paginationKey: { current: 'pageNum', size: 'pageSize' },
    immediate: true,
  },
});

const columns = computed(() => [
  { label: '流水单号', prop: 'invoiceNo', minWidth: 170 },
  { label: '患者姓名', prop: 'patientName', minWidth: 120 },
  { label: '业务类型', prop: 'type', minWidth: 120 },
  { label: '总金额', prop: 'amount', minWidth: 150, align: 'right', useSlot: true },
  { label: '支付状态', prop: 'status', minWidth: 140, useSlot: true },
  { label: '创建时间', prop: 'createTime', minWidth: 180 },
  { label: '操作', prop: 'action', minWidth: 120, useSlot: true, align: 'center' },
]);

// ===================== 详情侧边抽屉 =====================
const drawerVisible = ref(false);
const activeInvoice = ref<any>(null);

// 模拟账单明细数据
const mockDetails = ref([
  { name: '阿莫西林胶囊', spec: '0.25g*50粒/盒', quantity: 2, price: 15.80, total: 31.60 },
  { name: '血常规检测', spec: '次', quantity: 1, price: 25.00, total: 25.00 },
  { name: '一次性注射器', spec: '支', quantity: 5, price: 1.20, total: 6.00 }
]);

const handleView = (row: any) => {
  activeInvoice.value = row;
  drawerVisible.value = true;
};
</script>

<template>
  <div class="h-fullbg-slate-50 p-6 flex flex-col gap-6 overflow-hidden">
    <!-- 顶部微型统计卡片区 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
      <!-- 今日总流水 -->
      <div class="bg-white rounded-3xl p-6 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300">
        <div>
          <p class="text-sm font-semibold text-slate-400 mb-1">今日总流水</p>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xl font-bold text-slate-800">￥</span>
            <span class="text-3xl font-black text-slate-800 tracking-tight">{{ statistics.totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
          </div>
        </div>
        <div class="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100/50 group-hover:scale-110 transition-transform duration-300">
          <WnSvgIcon icon="solar:wallet-money-bold-duotone" :size="30" class="text-primary-500" />
        </div>
      </div>

      <!-- 今日退费总额 -->
      <div class="bg-white rounded-3xl p-6 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300">
        <div>
          <p class="text-sm font-semibold text-slate-400 mb-1">今日退费总额</p>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xl font-bold text-slate-800">￥</span>
            <span class="text-3xl font-black text-slate-800 tracking-tight">{{ statistics.totalRefund.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
          </div>
        </div>
        <div class="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100/50 group-hover:scale-110 transition-transform duration-300">
          <WnSvgIcon icon="solar:round-transfer-horizontal-bold-duotone" :size="30" class="text-rose-500" />
        </div>
      </div>

      <!-- 待支付订单数 -->
      <div class="bg-white rounded-3xl p-6 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300">
        <div>
          <p class="text-sm font-semibold text-slate-400 mb-1">待支付订单数</p>
          <div class="flex items-baseline gap-1.5">
            <span class="text-3xl font-black text-slate-800 tracking-tight">{{ statistics.pendingOrders }}</span>
            <span class="text-sm font-bold text-slate-500">笔</span>
          </div>
        </div>
        <div class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100/50 group-hover:scale-110 transition-transform duration-300">
          <WnSvgIcon icon="solar:clock-circle-bold-duotone" :size="30" class="text-amber-500" />
        </div>
      </div>
    </div>

    <!-- 底部全白无框卡片 -->
    <div class="bg-white rounded-3xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.04)] p-6 flex flex-col flex-1 min-h-0 border border-slate-50">
      
      <div class="mb-5 px-3 flex items-center justify-between shrink-0">
        <h2 class="text-lg font-bold text-slate-800 tracking-tight">院内业务流水记录</h2>
        <!-- 此处可以扩展简单的搜索功能 -->
      </div>

      <!-- 高辨识度留白表格 -->
      <div class="finance-table-wrapper flex-1 min-h-0 px-3 relative" :class="{ 'opacity-50 pointer-events-none': loading }">
        <WnTable
          ref="tableRef"
          :loading="loading"
          :pagination="pagination"
          :data="tableData"
          :columns="columns"
          @pagination:size-change="handleSizeChange"
          @pagination:current-change="handleCurrentChange"
        >
          <!-- 总金额 (高亮右对齐) -->
          <template #amount="{ row }">
            <div class="font-black text-[15px] tracking-tight transition-colors" :class="row.status === 'REFUNDED' ? 'text-slate-400 opacity-60' : 'text-primary-600'">
              <span class="text-[12px] opacity-70 mr-0.5">￥</span>{{ row.amount.toFixed(2) }}
            </div>
          </template>

          <!-- 支付状态胶囊 -->
          <template #status="{ row }">
            <span 
              v-if="row.status === 'PAID'"
              class="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100/50 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase"
            >
              已支付
            </span>
            <span 
              v-else-if="row.status === 'PENDING'"
              class="inline-block bg-amber-50 text-amber-600 border border-amber-100/50 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase"
            >
              待支付
            </span>
            <span 
              v-else-if="row.status === 'REFUNDED'"
              class="inline-block bg-slate-100 text-slate-500 border border-slate-200/50 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase line-through opacity-70"
            >
              已退款
            </span>
          </template>

          <!-- 查看详情按钮 -->
          <template #action="{ row }">
            <div 
              class="inline-flex items-center gap-1.5 cursor-pointer text-primary-600 hover:text-primary-800 bg-primary-50/50 hover:bg-primary-100 px-3 py-1.5 rounded-lg active:scale-95 transition-all text-xs font-bold"
              @click="handleView(row)"
            >
              查看详情
            </div>
          </template>
        </WnTable>
      </div>
    </div>

    <!-- 右侧滑出账单明细 Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="账单明细"
      size="450px"
      append-to-body
      destroy-on-close
    >
      <div v-if="activeInvoice" class="flex flex-col h-full bg-slate-50">
        <!-- 账单头部信息 -->
        <div class="bg-white px-8 py-8 shrink-0 flex flex-col items-center border-b border-slate-100/80">
          <div class="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
             <WnSvgIcon icon="solar:bill-list-bold-duotone" :size="32" class="text-primary-500" />
          </div>
          <h3 class="text-3xl font-black text-slate-800 tracking-tight shrink-0">
             <span class="text-lg opacity-60 font-semibold mr-1">￥</span>{{ activeInvoice.amount.toFixed(2) }}
          </h3>
          <p class="text-sm font-semibold mt-2" :class="{
             'text-emerald-500': activeInvoice.status === 'PAID',
             'text-amber-500': activeInvoice.status === 'PENDING',
             'text-slate-400 line-through': activeInvoice.status === 'REFUNDED'
          }">
             {{ activeInvoice.status === 'PAID' ? '交易成功 (PAID)' : activeInvoice.status === 'PENDING' ? '等待支付 (PENDING)' : '已作废退款 (REFUNDED)' }}
          </p>
        </div>

        <!-- 基础信息 -->
        <div class="bg-white px-8 py-6 m-4 mt-6 rounded-[1.5rem] shadow-sm border border-slate-100 shrink-0">
           <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-medium text-slate-400">流水单号</span>
              <span class="text-sm font-semibold text-slate-700 tracking-wider">{{ activeInvoice.invoiceNo }}</span>
           </div>
           <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-medium text-slate-400">业务类型</span>
              <span class="text-sm font-semibold text-slate-700">{{ activeInvoice.type }}</span>
           </div>
           <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-medium text-slate-400">患者姓名</span>
              <span class="text-sm font-semibold text-slate-700">{{ activeInvoice.patientName }}</span>
           </div>
           <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-400">交易时间</span>
              <span class="text-sm font-semibold text-slate-700">{{ activeInvoice.createTime }}</span>
           </div>
        </div>

        <!-- 货物明细 -->
        <div class="bg-white px-8 py-6 m-4 mt-0 rounded-[1.5rem] shadow-sm border border-slate-100 flex-1 overflow-y-auto">
           <h4 class="text-[13px] font-bold text-slate-800 mb-4 tracking-widest uppercase">Fee Details</h4>
           <div v-for="(item, index) in mockDetails" :key="index" class="flex justify-between items-start mb-5 pb-5 border-b border-slate-50 last:border-0 last:mb-0 last:pb-0">
              <div class="flex-1 pr-4">
                 <p class="text-sm font-bold text-slate-800 leading-tight mb-1">{{ item.name }}</p>
                 <p class="text-xs font-medium text-slate-400">规格: {{ item.spec }}</p>
                 <p class="text-[13px] font-semibold text-slate-600 mt-1">￥{{ item.price.toFixed(2) }} × {{ item.quantity }}</p>
              </div>
              <div class="shrink-0 text-right font-bold text-sm text-slate-700">
                 ￥{{ item.total.toFixed(2) }}
              </div>
           </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
/* 深度美化表格，去掉传统强线条分割，依靠留白和极淡的 border-b border-slate-50 来区分行 */
.finance-table-wrapper :deep(.el-table) {
  --el-table-border-color: #f8fafc; /* slate-50 */
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  background-color: transparent;
}

.finance-table-wrapper :deep(.el-table th.el-table__cell) {
  border-bottom: 2px solid #f1f5f9 !important; /* slate-100 */
  color: #94a3b8; /* slate-400 */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 16px 0;
}

.finance-table-wrapper :deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid #f8fafc !important; /* slate-50 */
  padding: 18px 0;
  transition: all 0.3s ease;
}

.finance-table-wrapper :deep(.el-table__row:hover td.el-table__cell) {
  background-color: #f8fafc !important; /* hover态：极淡底色 */
}

/* 去除整体容器边框及内部伪元素自带线条 */
.finance-table-wrapper :deep(.el-table--border::after),
.finance-table-wrapper :deep(.el-table--group::after),
.finance-table-wrapper :deep(.el-table::before),
.finance-table-wrapper :deep(.el-table__inner-wrapper::before) {
  display: none !important;
}

/* 自定义 Drawer 样式净化 */
:deep(.el-drawer__header) {
  margin-bottom: 0 !important;
  padding: 20px 32px !important;
  border-bottom: 1px solid #f1f5f9;
  font-weight: bold;
  color: #1e293b;
}
:deep(.el-drawer__body) {
  padding: 0 !important;
  overflow: hidden;
}
</style>
