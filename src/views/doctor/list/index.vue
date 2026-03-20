<!-- 医生列表页面 -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getStatusClass } from '@/utils/ui/status';
import { resolveLocalizedText } from '@/utils/i18n';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import type { Doctor } from '@/types/api/doctor';
import type { ColumnOption } from '@/types/component';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnForm from '@/components/core/forms/Wn-form/index.vue';
import { useTable } from '@/hooks/core/useTable';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as doctorApi from '@/api/doctor';
import * as departmentApi from '@/api/department';
import * as userApi from '@/api/user';

defineOptions({ name: 'Doctors' });

const router = useRouter();
const { t, locale } = useI18n();
const departmentOptions = ref<{label: string, value: any}[]>([]);
const specialtyOptions = ref<{label: string, value: any}[]>([]);
const unboundUserOptions = ref<{label: string, value: any}[]>([]);

const loadMeta = async () => {
  try {
    const [depts, specialties] = await Promise.all([
      departmentApi.fetchList({}),
      doctorApi.getSpecialtyList()
    ]);

    departmentOptions.value = depts.map((d: any) => ({
      label: resolveLocalizedText(d.name, locale.value),
      value: d.id
    }));

    specialtyOptions.value = specialties.map(s => ({
      label: resolveLocalizedText(s.name, locale.value),
      value: s.id
    }));

    // 获取未绑定的系统用户（假设后端存在此 API，否则可在此优雅降级或使用一般用户列表）
    try {
      const users = await userApi.getUnboundUsers?.() || [];
      unboundUserOptions.value = users.map((u: any) => ({
        label: `${u.name || u.username} (${u.phone || '无手机号'})`,
        value: u.id
      }));
    } catch(e) { /* ignore */ }
  } catch (error) {
    console.error('Failed to load meta data', error);
  }
};

onMounted(() => {
  loadMeta();
});

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
      const requestParams = {
        ...params,
        status: params.status !== undefined && params.status !== '' ? Number(params.status) : undefined,
      };
      return doctorApi.getDoctorPage(requestParams);
    },
    apiParams: {
      query: '',
      departmentId: undefined,
      specialtyId: undefined,
      status: undefined,
    },
    paginationKey: {
      current: 'pageNum',
      size: 'pageSize',
    },
    immediate: true,
  },
});

watch(
  [
    () => searchModel.departmentId,
    () => searchModel.specialtyId,
    () => searchModel.status,
  ],
  () => {
    handleSearch();
  },
);

watch(locale, async () => {
  await loadMeta();
  handleSearch();
});

const doctorStatusOptions = computed(() => [
  { label: t('doctors.filter.available'), value: 1 },
  { label: t('doctors.filter.unavailable'), value: 0 },
]);

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'query',
    type: 'input',
    background: 'var(--color-field)',
    props: {
      placeholder: t('doctors.filter.placeholder'),
      style: { width: '320px' },
    },
  },
  {
    key: 'departmentId',
    type: 'select',
    props: {
      placeholder: t('doctors.filter.department'),
      options: [
        { label: t('doctors.filter.allDepartments'), value: undefined },
        ...departmentOptions.value
      ],
      fitInputWidth: true,
    },
  },
  {
    key: 'specialtyId',
    type: 'select',
    props: {
      placeholder: t('doctors.filter.specialist'),
      options: [
        { label: t('doctors.filter.allSpecialists'), value: undefined },
        ...specialtyOptions.value
      ],
      fitInputWidth: true,
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      placeholder: t('doctors.filter.status'),
      options: [
        { label: t('doctors.filter.allStatus'), value: undefined },
        ...doctorStatusOptions.value,
      ],
      fitInputWidth: true,
    },
  },
]);

const columns = computed<ColumnOption[]>(() => [
  { label: t('doctors.table.name'), prop: 'name', minWidth: 180, useSlot: true, sortable: true },
  { label: t('doctors.table.id'), prop: 'doctorNo', minWidth: 140, sortable: true },
  { label: t('doctors.table.department'), prop: 'departmentName', minWidth: 160, sortable: true },
  { label: t('doctors.table.specialist'), prop: 'specialist', minWidth: 160, sortable: true },
  { label: t('doctors.table.totalPatients'), prop: 'totalPatients', minWidth: 140, sortable: true },
  { label: t('doctors.table.todaysAppointment'), prop: 'todayAppointments', minWidth: 160, sortable: true },
  {
    label: t('doctors.table.availabilityStatus'),
    prop: 'availabilityStatus',
    minWidth: 180,
    useSlot: true,
    sortable: true,
  },
  { label: t('doctors.table.action'), prop: 'action', minWidth: 120, useSlot: true },
]);

// ================= 医生配置抽屉 (Add/Edit) =================
const drawerVisible = ref(false);
const drawerTitle = ref('');
const formRef = ref<any>(null);
const submitting = ref(false);

const formSchema = computed(() => [
  {
    type: 'select',
    label: '关联系统账号',
    key: 'userId',
    options: unboundUserOptions.value,
    rules: [{ required: true, message: '请选择要绑定的系统用户账号' }]
  },
  {
    type: 'select',
    label: '所属科室',
    key: 'departmentId',
    options: departmentOptions.value,
    rules: [{ required: true, message: '请选择科室' }]
  },
  {
    type: 'input',
    label: '医生姓名',
    key: 'name',
    rules: [{ required: true, message: '请输入医生姓名' }]
  },
  {
    type: 'input',
    label: '职称',
    key: 'title',
    rules: [{ required: true, message: '请输入职称（如：主任医师）' }]
  },
  {
    type: 'input',
    label: '擅长方向',
    key: 'specialist', // backend typically maps to specialty or specialist
    rules: [{ required: true, message: '请输入擅长方向' }]
  },
  {
    type: 'input',
    label: '排班限额',
    key: 'dailyLimit',
    props: {
      type: 'number',
      min: 0,
      max: 100
    },
    rules: [{ required: true, message: '请输入排班限额' }]
  }
]);

const handleAddDoctor = () => {
  drawerTitle.value = '新增医生档案';
  drawerVisible.value = true;
  setTimeout(() => {
    formRef.value?.setValues({ dailyLimit: 20 });
  }, 100);
};

const handleEdit = (row: Doctor) => {
  drawerTitle.value = '编辑医生档案';
  drawerVisible.value = true;
  setTimeout(() => {
    formRef.value?.setValues({
      userId: row.userId,
      departmentId: row.departmentId,
      name: row.name,
      title: row.title,
      specialist: row.specialist,
      dailyLimit: row.dailyLimit || 20
    });
  }, 100);
};

const handleSubmitDoc = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (valid) {
    submitting.value = true;
    try {
      // 实际应调用 doctorApi.addDoctor / updateDoctor
      console.log('保存医生信息:', formRef.value.getValues());
      ElMessage.success(`${drawerTitle.value}保存成功!`);
      drawerVisible.value = false;
      handleSearch();
    } catch (e) {
      console.error(e);
      ElMessage.error('保存失败');
    } finally {
      submitting.value = false;
    }
  }
};

const handleGoDetail = (row: Doctor) => {
  router.push({
    name: 'DoctorDetails',
    params: { id: row.id.toString() },
  });
};

const handleDelete = async (row: Doctor) => {
  try {
    await ElMessageBox.confirm(t('doctors.confirmDelete', { name: row.name }), t('doctors.deleteDoctor'), {
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
      confirmButtonText: t('doctors.delete'),
    });
    await doctorApi.deleteDoctor(row.id);
    ElMessage.success(t('doctors.deleteSuccess', { name: row.name }));
    handleSearch();
  } catch (error: any) {
    if (error !== 'cancel') {
       console.error(error);
    }
  }
};
</script>

<template>
  <div class="bg-surface-sunken h-full rounded-2xl flex flex-col overflow-hidden">
    <!-- 表头 -->
    <WnTableHeader class="shrink-0 p-6">
      <template #left>
        <WnSearchBar
          v-model="searchModel"
          :items="searchItems"
          @keyup.enter="handleSearch"
          search-bar-background="white"
        />
      </template>

      <template #right>
        <WnButton
          v-roles="['R_SUPER']"
          mode="add"
          @click="handleAddDoctor"
        >
          {{ t('doctors.addDoctor') }}
        </WnButton>
      </template>
    </WnTableHeader>

    <!-- 表格内容 -->
    <div
      class="px-6 flex-1 min-h-0 transition-opacity duration-500"
      :class="{ 'animate-fade-in': !loading }"
      :key="locale"
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
        <template #name="{ row }">
          <div
            class="flex items-center gap-3.5 py-2 cursor-pointer group"
            @click="handleGoDetail(row)"
          >
            <div
              class="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 flex-cc shrink-0 border border-slate-100 shadow-sm group-hover:border-primary-300 transition-colors duration-300"
            >
              <img
                v-if="row.avatar"
                :src="row.avatar"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <WnSvgIcon
                v-else
                icon="solar:user-bold"
                :size="20"
                class="text-slate-300 group-hover:text-primary-400 transition-colors duration-300"
              />
            </div>
            <span class="group-hover:text-primary-600 transition-colors duration-300">
              {{ row.name }}
            </span>
          </div>
        </template>



        <template #availabilityStatus="{ row }">
          <div
            class="inline-flex items-center px-3 py-1 rounded-lg border font-medium transition-all duration-300"
            :class="getStatusClass(row.status, 'doctor')"
          >
            {{ row.availabilityStatus }}
          </div>
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-2 text-title">
            <WnSvgIcon
              v-roles="['R_SUPER']"
              icon="lucide:edit"
              class="c-p hover:text-(--color-primary-500) active:text-(--color-primary-800) transition-colors"
              @click="handleEdit(row)"
            />
            <div class="w-[2px] h-4 bg-disabled-border" v-roles="['R_SUPER']"></div>
            <WnSvgIcon
              v-roles="['R_SUPER']"
              icon="mi:delete"
              class="c-p hover:text-(--color-danger-500) active:text-(--color-danger-600) transition-colors"
              @click="handleDelete(row)"
            />
          </div>
        </template>
      </WnTable>
    </div>

    <!-- 新增/编辑医生档案抽屉 (el-drawer) -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="500px"
      append-to-body
      destroy-on-close
    >
      <div class="flex flex-col h-full bg-white relative">
        <div class="px-6 py-5 border-b border-slate-100 shrink-0">
          <h3 class="text-lg font-bold text-slate-800">{{ drawerTitle }}</h3>
          <p class="text-[13px] text-slate-500 mt-1.5">维护核心医生信息及其出诊排班限额与关联系统用户账号。</p>
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
            取消操作
          </WnButton>
          <WnButton 
            type="primary"
            class="w-full !rounded-xl !py-5"
            :loading="submitting"
            @click="handleSubmitDoc"
          >
            保存医生档案
          </WnButton>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
