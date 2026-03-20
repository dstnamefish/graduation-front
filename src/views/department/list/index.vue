<template>
  <div class="flex flex-col h-full bg-slate-50 overflow-hidden">
      
      <!-- Top Actions -->
      <WnTableHeader class="shrink-0 mb-6 px-2">
        <template #right>
          <WnButton v-roles="['R_SUPER']" type="primary" @click="handleAdd">新增科室</WnButton>
        </template>
      </WnTableHeader>

      <!-- Department Grid -->
    <div
      v-loading="loading"
      class="flex-1 overflow-y-auto "
    >
      <div
        v-if="allData && allData.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <DepartmentCard
          v-for="dept in allData"
          :key="dept.id"
          :data="dept"
          @view="handleViewDetail"
          @edit="handleEdit"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading"
        class="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-20"
      >
        <WnSvgIcon
          icon="solar:clipboard-remove-linear"
          :size="48"
          class="opacity-20"
        />
        <p class="text-sm font-medium">No departments found</p>
      </div>
    </div>
    </div>

    <!-- 侧边表单抽屉 -->
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
          <p class="text-[13px] text-slate-500 mt-1.5">请填写相关科室的关键信息与描述。</p>
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
            取消
          </WnButton>
          <WnButton 
            type="primary"
            class="w-full !rounded-xl !py-5"
            :loading="submitting"
            @click="handleSubmitForm"
          >
            保存配置
          </WnButton>
        </div>
      </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchList } from '@/api/department'; // you would import add/update APIs as well
import type { Department } from '@/types/api/department';
import DepartmentCard from './modules/DepartmentCard.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import WnForm from '@/components/core/forms/Wn-form/index.vue';

defineOptions({ name: 'Departments' });

const router = useRouter();
const loading = ref(false);
const allData = ref<Department[]>([]);

/**
 * Fetch Data using API
 */
const fetchData = async () => {
  loading.value = true;
  try {
    const list = await fetchList({});
    allData.value = list;
  } catch (error) {
    ElMessage.error('Failed to load departments');
    allData.value = [];
  } finally {
    loading.value = false;
  }
};

/**
 * Handlers
 */
const handleViewDetail = (dept: any) => {
  router.push({ name: 'DepartmentDetails', params: { id: dept.id } });
};

// ================= Super Admin Add/Edit Options =================
const drawerVisible = ref(false);
const drawerTitle = ref('');
const formRef = ref<any>(null);
const submitting = ref(false);

const formSchema = computed(() => [
  { type: 'input', label: '科室名称', key: 'name', rules: [{ required: true, message: '请输入科室名称' }] },
  { type: 'input', label: '科室编码', key: 'code', rules: [{ required: true, message: '请输入科室编码' }] },
  { type: 'input', label: '科室简介', key: 'description', props: { type: 'textarea', rows: 4 } },
  {
    type: 'select',
    label: '状态',
    key: 'status',
    options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }],
    rules: [{ required: true, message: '请选择状态' }]
  }
]);

const handleAdd = () => {
  drawerTitle.value = '新增科室';
  drawerVisible.value = true;
  setTimeout(() => {
    formRef.value?.setValues({ status: 1 });
  }, 100);
};

const handleEdit = (dept: any) => {
  drawerTitle.value = '编辑科室';
  drawerVisible.value = true;
  setTimeout(() => {
    formRef.value?.setValues({
      name: dept.name,
      code: dept.code || dept.patientNo || null,
      description: dept.description,
      status: dept.status !== undefined ? dept.status : 1
    });
  }, 100);
};

const handleSubmitForm = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (valid) {
    submitting.value = true;
    try {
      // Execute Add or Update mock
      const values = formRef.value.getValues();
      console.log('Submitting values:', values);
      ElMessage.success(`${drawerTitle.value}保存成功!`);
      drawerVisible.value = false;
      fetchData();
    } catch (e) {
      console.error(e);
      ElMessage.error('保存失败');
    } finally {
      submitting.value = false;
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>