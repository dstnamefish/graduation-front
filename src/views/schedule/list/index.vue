<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import WnForm from '@/components/core/forms/Wn-form/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { useTable } from '@/hooks/core/useTable';

// Import APIs (Mocking specific schedule methods if they don't explicitly exist yet)
import * as departmentApi from '@/api/department';
import * as doctorApi from '@/api/doctor';
// import * as scheduleApi from '@/api/schedule';

defineOptions({ name: 'SystemScheduleList' });

// ======================= 数据字典与 API 初始化 =======================
const departmentOptions = ref<{label: string, value: any}[]>([]);
const allDoctors = ref<any[]>([]); // 全量或当前科室医生
const doctorOptions = ref<{label: string, value: any}[]>([]);

// 抽屉内专用的医生下拉框（依赖已选科室）
const drawerDoctorOptions = computed(() => {
  if (!formRef.value) return [];
  const deptId = formRef.value.getValues()?.departmentId;
  if (!deptId) return doctorOptions.value;
  return allDoctors.value
    .filter(doc => doc.departmentId === deptId)
    .map(doc => ({ label: doc.name, value: doc.id }));
});

const shiftOptions = [
  { label: '早班 (08:00 - 12:00)', value: 'MORNING' },
  { label: '中班 (13:00 - 17:00)', value: 'AFTERNOON' },
  { label: '晚班 (18:00 - 22:00)', value: 'EVENING' }
];

const loadMeta = async () => {
  try {
    const depts = await departmentApi.fetchList({});
    departmentOptions.value = depts.map((d: any) => ({ label: d.name, value: d.id }));

    // 假设加载所有医生字典（实际业务中医生较多时应按需分页加载，此处为简化）
    const docs = await doctorApi.getDoctorPage({ pageNum: 1, pageSize: 1000 }).catch(() => ({ list: [] }));
    allDoctors.value = docs.list || [];
    doctorOptions.value = allDoctors.value.map(d => ({ label: d.name, value: d.id }));
  } catch (error) {
    console.error('Failed to load metadata', error);
  }
};

onMounted(() => {
  loadMeta();
});

// ======================= 列表查询相关 =======================
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
      // return scheduleApi.getSchedulePage(params);
      
      // MOCK DATA for display purposes if backend schedule API is not yet linked
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            total: 3,
            list: [
              { id: 1, doctorId: 1, doctorName: '李思', doctorAvatar: '', departmentName: '内科', date: '2026-03-22', shift: 'MORNING', limit: 30, booked: 30 },
              { id: 2, doctorId: 2, doctorName: '王五', doctorAvatar: '', departmentName: '外科', date: '2026-03-22', shift: 'AFTERNOON', limit: 40, booked: 12 },
              { id: 3, doctorId: 3, doctorName: '张三', doctorAvatar: '', departmentName: '急诊科', date: '2026-03-23', shift: 'EVENING', limit: 20, booked: 19 },
            ]
          });
        }, 500);
      });
    },
    apiParams: {
      departmentId: undefined,
      doctorId: undefined,
      startDate: '',
      endDate: ''
    },
    paginationKey: { current: 'pageNum', size: 'pageSize' },
    immediate: true,
  },
});

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'departmentId',
    type: 'select',
    props: {
      placeholder: '所有科室',
      options: [{ label: '全部', value: undefined }, ...departmentOptions.value],
      fitInputWidth: true,
    },
  },
  {
    key: 'doctorId',
    type: 'select',
    props: {
      placeholder: '选择医生',
      options: [{ label: '全部', value: undefined }, ...doctorOptions.value],
      fitInputWidth: true,
      filterable: true,
    },
  },
  {
    key: 'dateRange',
    type: 'date-picker',
    props: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD'
    },
    // 将选择的日期区间映射到 start/end date
    listeners: {
      change: (val: string[] | null) => {
        searchModel.startDate = val ? val[0] : '';
        searchModel.endDate = val ? val[1] : '';
      }
    }
  }
]);

watch(() => searchModel.departmentId, () => handleSearch());
watch(() => searchModel.doctorId, () => handleSearch());
watch(() => searchModel.startDate, () => handleSearch());

const columns = computed(() => [
  { label: '出诊医生', prop: 'doctorName', minWidth: 160, useSlot: true },
  { label: '所属科室', prop: 'departmentName', minWidth: 120 },
  { label: '出诊日期', prop: 'date', minWidth: 140 },
  { label: '班次', prop: 'shift', minWidth: 140, useSlot: true },
  { label: '挂号状态 (已约 / 限额)', prop: 'status', minWidth: 200, useSlot: true },
  { label: '操作', prop: 'action', minWidth: 130, useSlot: true, align: 'center' },
]);

// ======================= 抽屉表单相关 =======================
const drawerVisible = ref(false);
const drawerTitle = ref('');
const formRef = ref<any>(null);
const submitting = ref(false);

const formSchema = computed(() => [
  {
    type: 'select',
    label: '门诊科室',
    key: 'departmentId',
    options: departmentOptions.value,
    props: { filterable: true, onChange: () => { if(formRef.value) formRef.value.setValues({doctorId: null}); } },
    rules: [{ required: true, message: '请选择门诊科室' }]
  },
  {
    type: 'select',
    label: '出诊医生',
    key: 'doctorId',
    options: drawerDoctorOptions.value, // this should dynamically filter via computed but WnForm might cache options. If cached, rely on simple fetch
    props: { filterable: true },
    rules: [{ required: true, message: '请选择出诊医生' }]
  },
  {
    type: 'date-picker',
    label: '出诊日期',
    key: 'date',
    props: { type: 'date', valueFormat: 'YYYY-MM-DD', placeholder: '选择日期' },
    rules: [{ required: true, message: '请选择出诊日期' }]
  },
  {
    type: 'select',
    label: '门诊班次',
    key: 'shift',
    options: shiftOptions,
    rules: [{ required: true, message: '请选择班次' }]
  },
  {
    type: 'input',
    label: '放号限额',
    key: 'limit',
    props: { type: 'number', min: 1, max: 200 },
    rules: [{ required: true, message: '请输入号源数量' }]
  }
]);

const handleAddSchedule = () => {
  drawerTitle.value = '新增全院排班';
  drawerVisible.value = true;
  setTimeout(() => {
    formRef.value?.setValues({ limit: 30 }); // 默认给30个号
  }, 100);
};

const handleEditSchedule = (row: any) => {
  drawerTitle.value = '编辑排班计划';
  drawerVisible.value = true;
  setTimeout(() => {
    formRef.value?.setValues({
      departmentId: row.departmentId,
      doctorId: row.doctorId,
      date: row.date,
      shift: row.shift,
      limit: row.limit
    });
  }, 100);
};

const handleDeleteSchedule = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确认删除医生 [${row.doctorName}] 在 [${row.date}] 的排班吗？`, '删除排班', {
      type: 'warning',
      confirmButtonText: '强制删除'
    });
    // await scheduleApi.delete(row.id);
    ElMessage.success('排班删除成功');
    handleSearch();
  } catch(e) {}
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (valid) {
    submitting.value = true;
    try {
      // do submit
      const values = formRef.value.getValues();
      console.log('保存排班:', values);
      ElMessage.success('排班发布成功');
      drawerVisible.value = false;
      handleSearch();
    } catch(e) {
      ElMessage.error('排班发布失败');
    } finally {
      submitting.value = false;
    }
  }
};
</script>

<template>
  <div class="h-full bg-slate-50 p-6 flex flex-col overflow-hidden">
    <!-- 主体容器 -->
    <div class="bg-white rounded-[2rem] shadow-soft p-6 flex flex-col flex-1 min-h-0 border border-slate-100/50">
      
      <!-- 极简筛选与标题动作 -> 整合在 TableHeader 中 -->
      <WnTableHeader class="shrink-0 mb-6 px-2">
        <template #left>
          <WnSearchBar
            v-model="searchModel"
            :items="searchItems"
            @keyup.enter="handleSearch"
            search-bar-background="white"
          />
        </template>
        
        <template #right>
          <div v-roles="['R_SUPER']">
            <WnButton type="primary" mode="add" @click="handleAddSchedule">新增排班</WnButton>
          </div>
        </template>
      </WnTableHeader>

      <!-- 排班极强信息密度表格 -->
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
          <!-- 医生列：带头像和姓名 -->
          <template #doctorName="{ row }">
            <div class="flex items-center gap-3 py-1.5 group cursor-default">
              <div class="w-9 h-9 rounded-full overflow-hidden bg-slate-100 flex-cc shrink-0 border border-slate-200">
                <img v-if="row.doctorAvatar" :src="row.doctorAvatar" class="w-full h-full object-cover" />
                <WnSvgIcon v-else icon="solar:user-bold" :size="20" class="text-slate-300" />
              </div>
              <span class="text-slate-800 font-bold group-hover:text-primary-600 transition-colors">
                {{ row.doctorName }}
              </span>
            </div>
          </template>

          <!-- 班次列：药丸标签 -->
          <template #shift="{ row }">
            <span 
              v-if="row.shift === 'MORNING'"
              class="inline-block bg-amber-50 text-amber-600 border border-amber-100 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
            >
              早班
            </span>
            <span 
              v-else-if="row.shift === 'AFTERNOON'"
              class="inline-block bg-teal-50 text-teal-600 border border-teal-100 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
            >
              中班
            </span>
            <span 
              v-else-if="row.shift === 'EVENING'"
              class="inline-block bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
            >
              晚班
            </span>
          </template>

          <!-- 号源状态列：极简进度条 -->
          <template #status="{ row }">
            <div class="w-[140px] flex flex-col gap-1.5">
               <div class="flex justify-between items-center text-[11px] font-bold">
                  <span :class="row.booked >= row.limit ? 'text-rose-600' : 'text-slate-600'">
                     {{ row.booked >= row.limit ? '已满诊' : '可预约' }}
                  </span>
                  <span class="text-slate-400 font-medium">{{ row.booked }} / {{ row.limit }}</span>
               </div>
               <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-500 rounded-full"
                    :class="row.booked >= row.limit ? 'bg-rose-500' : 'bg-primary-500'"
                    :style="{ width: `${Math.min((row.booked / row.limit) * 100, 100)}%` }"
                  ></div>
               </div>
            </div>
          </template>

          <!-- 操作列 -->
          <template #action="{ row }">
            <div class="flex items-center justify-center gap-2" v-roles="['R_SUPER']">
              <div 
                class="w-7 h-7 flex-cc rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-primary-600 transition-colors"
                @click="handleEditSchedule(row)"
              >
                <WnSvgIcon icon="lucide:edit-2" :size="14" />
              </div>
              <div 
                class="w-7 h-7 flex-cc rounded-lg cursor-pointer bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                @click="handleDeleteSchedule(row)"
              >
                <WnSvgIcon icon="lucide:trash-2" :size="14" />
              </div>
            </div>
          </template>
        </WnTable>
      </div>
    </div>

    <!-- 右侧滑出抽屉：新增/编辑排班 -->
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
          <p class="text-[13px] text-slate-500 mt-1.5">维护全院医生的门诊出诊安排，配置放号量及班次。</p>
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
            取消修改
          </WnButton>
          <WnButton 
            type="primary"
            class="w-full !rounded-xl !py-5"
            :loading="submitting"
            @click="handleSubmit"
          >
            发布排班
          </WnButton>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
