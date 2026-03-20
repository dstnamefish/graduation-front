<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import WnForm from '@/components/core/forms/Wn-form/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { useTable } from '@/hooks/core/useTable';

defineOptions({ name: 'SystemDictionaryDrug' });

const typeOptions = [
  { label: '药品 (Drug)', value: 'DRUG' },
  { label: '检查 (Inspection)', value: 'INSPECTION' },
  { label: '耗材 (Consumable)', value: 'CONSUMABLE' }
];

const statusOptions = [
  { label: '在售', value: 1 },
  { label: '停用', value: 0 }
];

// ======================= 列表查询 =======================
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
    apiFn: (params: any) => {
      // MOCK DATA for display purposes
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            total: 5,
            list: [
              { id: 1, code: 'DRG-001', name: '阿莫西林胶囊', type: 'DRUG', spec: '0.25g*50粒/盒', price: 15.80, stock: 1250, status: 1 },
              { id: 2, code: 'INS-002', name: '全腹部CT平扫', type: 'INSPECTION', spec: '单次', price: 350.00, stock: 9999, status: 1 },
              { id: 3, code: 'CSM-003', name: '一次性医用外科口罩', type: 'CONSUMABLE', spec: '10个/包', price: 5.50, stock: 35, status: 1 },
              { id: 4, code: 'DRG-004', name: '布洛芬缓释胶囊', type: 'DRUG', spec: '0.3g*30粒/盒', price: 21.00, stock: 10, status: 1 },
              { id: 5, code: 'INS-005', name: '血常规检查', type: 'INSPECTION', spec: '单次', price: 25.00, stock: 9999, status: 0 },
            ]
          });
        }, 300);
      });
    },
    apiParams: {
      keyword: '',
      type: undefined,
      status: undefined
    },
    paginationKey: { current: 'pageNum', size: 'pageSize' },
    immediate: true,
  },
});

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'keyword',
    type: 'input',
    props: {
      placeholder: '请输入项目编码或名称',
      style: { width: '240px' },
    },
  },
  {
    key: 'type',
    type: 'select',
    props: {
      placeholder: '项目类型',
      options: [{ label: '全部类型', value: undefined }, ...typeOptions],
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: '在售状态',
      options: [{ label: '全部状态', value: undefined }, ...statusOptions],
      fitInputWidth: true,
    },
  }
]);

const columns = computed(() => [
  { label: '项目编码', prop: 'code', minWidth: 120 },
  { label: '项目名称', prop: 'name', minWidth: 160 },
  { label: '类型', prop: 'type', minWidth: 130, useSlot: true },
  { label: '规格', prop: 'spec', minWidth: 140 },
  { label: '单价', prop: 'price', minWidth: 120, useSlot: true },
  { label: '当前库存', prop: 'stock', minWidth: 140, useSlot: true },
  { label: '状态', prop: 'status', minWidth: 100, useSlot: true },
  { label: '操作', prop: 'action', minWidth: 120, useSlot: true, align: 'center' },
]);

// ======================= 抽屉表单交互 =======================
const drawerVisible = ref(false);
const drawerTitle = ref('');
const formRef = ref<any>(null);
const submitting = ref(false);

const formSchema = computed(() => [
  {
    type: 'input',
    label: '项目编码',
    key: 'code',
    rules: [{ required: true, message: '请输入自定义或国家标准编码' }]
  },
  {
    type: 'input',
    label: '项目名称',
    key: 'name',
    rules: [{ required: true, message: '请输入项目名称' }]
  },
  {
    type: 'select',
    label: '类型分类',
    key: 'type',
    options: typeOptions,
    rules: [{ required: true, message: '请选择系统分类' }]
  },
  {
    type: 'input',
    label: '产品规格',
    key: 'spec',
    rules: [{ required: true, message: '请输入产品规格（如盒/次/件）' }]
  },
  {
    type: 'input',
    label: '售卖单价 (￥)',
    key: 'price',
    props: { type: 'number', min: 0, precision: 2, step: 0.1 },
    rules: [{ required: true, message: '请输入单价' }]
  },
  {
    type: 'input',
    label: '现有库存',
    key: 'stock',
    props: { type: 'number', min: 0, precision: 0 },
    rules: [{ required: true, message: '请输入总库存' }]
  },
  {
    type: 'select',
    label: '在售状态',
    key: 'status',
    options: statusOptions,
    rules: [{ required: true, message: '请选择状态' }]
  }
]);

const handleAdd = () => {
  drawerTitle.value = '新增医药与收费项目';
  drawerVisible.value = true;
  setTimeout(() => {
    formRef.value?.setValues({ status: 1, stock: 9999 }); 
  }, 100);
};

const handleEdit = (row: any) => {
  drawerTitle.value = '调整价格/库存';
  drawerVisible.value = true;
  setTimeout(() => {
    formRef.value?.setValues({
      code: row.code,
      name: row.name,
      type: row.type,
      spec: row.spec,
      price: row.price,
      stock: row.stock,
      status: row.status
    });
  }, 100);
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确认作废项目 [${row.name}] 吗？作废后不可恢复。`, '危险操作', {
      type: 'error',
      confirmButtonText: '确认作废'
    });
    ElMessage.success('作废成功');
    handleSearch();
  } catch(e) {}
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (valid) {
    submitting.value = true;
    try {
      const values = formRef.value.getValues();
      console.log('保存字典项目:', values);
      ElMessage.success('项目库存与价格刷新成功');
      drawerVisible.value = false;
      handleSearch();
    } catch(e) {
      ElMessage.error('系统保存失败');
    } finally {
      submitting.value = false;
    }
  }
};
</script>

<template>
  <div class="h-full bg-slate-50 p-6 flex flex-col overflow-hidden">
    <!-- 主体容器：极致柔和级阴影 -->
    <div class="bg-white rounded-[2rem] shadow-soft p-6 flex flex-col flex-1 min-h-0 border border-slate-100/50">
      
      <WnTableHeader class="shrink-0 mb-6 px-2">
        <template #left>
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-bold text-slate-800 tracking-tight">医药与收费项管理</h2>
            <WnSearchBar
              v-model="searchModel"
              :items="searchItems"
              @keyup.enter="handleSearch"
              class="ml-4"
              search-bar-background="white"
            />
          </div>
        </template>
        
        <template #right>
          <div v-roles="['R_SUPER']">
            <WnButton type="primary" mode="add" @click="handleAdd">新增项目库</WnButton>
          </div>
        </template>
      </WnTableHeader>

      <div
        class="flex-1 min-h-0 relative px-2 transition-opacity duration-500"
        :class="{ 'animate-fade-in': !loading }"
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
          <!-- 【类型】胶囊标签 -->
          <template #type="{ row }">
            <span 
              v-if="row.type === 'DRUG'"
              class="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100/60 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
            >
              药品
            </span>
            <span 
              v-else-if="row.type === 'INSPECTION'"
              class="inline-block bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100/60 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
            >
              检查
            </span>
            <span 
              v-else-if="row.type === 'CONSUMABLE'"
              class="inline-block bg-blue-50 text-blue-600 border border-blue-100/60 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
            >
              耗材
            </span>
          </template>

          <!-- 【单价】人名币加粗高亮 -->
          <template #price="{ row }">
            <div class="text-slate-800 font-bold tracking-tight text-sm">
               <span class="text-xs text-slate-400 font-medium">￥</span>{{ row.price?.toFixed(2) }}
            </div>
          </template>

          <!-- 【当前库存】带自动预警 -->
          <template #stock="{ row }">
             <div 
                class="flex items-center gap-1.5 font-medium transition-colors"
                :class="row.stock < 50 ? 'text-rose-500 font-bold' : 'text-slate-600'"
             >
                <WnSvgIcon v-if="row.stock < 50" icon="lucide:alert-circle" :size="16" class="animate-pulse" />
                <span class="text-[13px]">{{ row.stock }}</span>
             </div>
          </template>

          <!-- 【状态】 -->
          <template #status="{ row }">
            <div class="flex items-center gap-1.5">
               <div class="w-2 h-2 rounded-full" :class="row.status === 1 ? 'bg-emerald-500' : 'bg-slate-300'"></div>
               <span class="text-xs font-semibold" :class="row.status === 1 ? 'text-slate-700' : 'text-slate-400'">
                 {{ row.status === 1 ? '在售' : '停用' }}
               </span>
            </div>
          </template>

          <!-- 操作列 -->
          <template #action="{ row }">
            <div class="flex items-center justify-center gap-2" v-roles="['R_SUPER']">
              <div 
                class="w-7 h-7 flex-cc rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-primary-600 transition-colors"
                @click="handleEdit(row)"
              >
                <WnSvgIcon icon="lucide:edit-2" :size="14" />
              </div>
              <div 
                class="w-7 h-7 flex-cc rounded-lg cursor-pointer bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                @click="handleDelete(row)"
              >
                <WnSvgIcon icon="lucide:trash-2" :size="14" />
              </div>
            </div>
          </template>
        </WnTable>
      </div>
    </div>

    <!-- 右侧滑出抽屉：新增/调整项目 -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="480px"
      append-to-body
      destroy-on-close
    >
      <div class="flex flex-col h-full bg-white relative">
        <div class="px-6 py-5 border-b border-slate-100 shrink-0">
          <h3 class="text-lg font-bold text-slate-800">{{ drawerTitle }}</h3>
          <p class="text-[13px] text-slate-500 mt-1.5">维护系统医疗收费项目的基准价格及现货防脱销库存。</p>
        </div>
        
        <div class="flex-1 px-6 py-6 overflow-y-auto w-full">
          <WnForm ref="formRef" :items="formSchema" />
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-4 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)]">
          <WnButton 
            type="default"
            class="w-full !rounded-xl !py-5"
            @click="drawerVisible = false"
          >
            放弃修改
          </WnButton>
          <WnButton 
            type="primary"
            class="w-full !rounded-xl !py-5"
            :loading="submitting"
            @click="handleSubmit"
          >
            确认提交
          </WnButton>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
