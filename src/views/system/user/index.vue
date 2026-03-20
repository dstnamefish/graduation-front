<!-- 用户管理页面 -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import WnSearchBar, { type SearchFormItem } from '@/components/core/forms/Wn-search-bar/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnTableHeader from '@/components/core/tables/Wn-table-header/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnForm from '@/components/core/forms/Wn-form/index.vue';
import type { ColumnOption } from '@/types/component';
import { useTable } from '@/hooks/core/useTable';
import * as userApi from '@/api/user';
// 假设这里也可以请求角色列表，为了演示功能暂时给个空值或者从 roleApi 拉取
// import * as roleApi from '@/api/role'; 

defineOptions({ name: 'SystemUser' });

const parseRoleName = (roleName: string) => {
  if (!roleName) return '--';
  try {
    const parsed = JSON.parse(roleName);
    return parsed.zh || parsed.en || roleName;
  } catch {
    return roleName;
  }
};

const roleOptions = ref<{label: string, value: any}[]>([
  { label: '管理员', value: 1 },
  { label: '医生', value: 2 },
  { label: '患者', value: 3 },
  { label: '前台', value: 4 }
]);

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
      return userApi.getUserPage({ ...params });
    },
    apiParams: {
      name: '',
      phone: '',
      roleId: undefined,
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
    () => searchModel.roleId,
  ],
  () => {
    handleSearch();
  },
);

const searchItems = computed<SearchFormItem[]>(() => [
  {
    key: 'name',
    type: 'input',
    background: 'var(--color-field)',
    props: {
      placeholder: '请输入姓名/昵称',
      style: { width: '220px' },
    },
  },
  {
    key: 'phone',
    type: 'input',
    background: 'var(--color-field)',
    props: {
      placeholder: '请输入手机号码',
      style: { width: '220px' },
    },
  },
  {
    key: 'roleId',
    type: 'select',
    props: {
      placeholder: '角色',
      options: [
        { label: '全部角色', value: undefined },
        ...roleOptions.value
      ],
      fitInputWidth: true,
    },
  },
]);

const columns = computed<ColumnOption[]>(() => [
  { label: '姓名', prop: 'nickName', minWidth: 160, useSlot: true },
  { label: '手机号', prop: 'phone', minWidth: 140 },
  { label: '角色', prop: 'roleName', minWidth: 120, useSlot: true },
  { label: '科室', prop: 'departmentName', minWidth: 140 },
  { label: '状态', prop: 'status', minWidth: 100, useSlot: true },
  { label: '操作', prop: 'action', minWidth: 140, useSlot: true, align: 'center' },
]);

// 抽屉及表单
const drawerVisible = ref(false);
const drawerTitle = ref('编辑用户');
const formRef = ref<any>(null);
const currentEditId = ref<number | null>(null);

const formSchema = computed(() => [
  {
    type: 'input',
    label: '姓名',
    key: 'name',
    rules: [{ required: true, message: '请输入姓名' }],
  },
  {
    type: 'input',
    label: '手机号',
    key: 'phone',
    rules: [{ required: true, message: '请输入手机号' }],
  },
  {
    type: 'select',
    label: '分配角色',
    key: 'roleIds',
    options: roleOptions.value,
    props: { multiple: true },
    rules: [{ required: true, message: '请选择角色' }],
  }
]);

const handleEdit = (row: any) => {
  drawerTitle.value = '编辑用户';
  drawerVisible.value = true;
  currentEditId.value = row.id;
  setTimeout(() => {
    if (formRef.value) {
      formRef.value.setValues({
        name: row.nickName,
        phone: row.phone,
        roleIds: []
      });
    }
  }, 100);
};

const handleDrawerSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (valid) {
    const values = formRef.value.getValues();
    try {
      if (currentEditId.value && values.roleIds) {
          // 这个接口代表分配角色
          await userApi.assignUserRoles(currentEditId.value, values.roleIds);
      }
      ElMessage.success('编辑成功');
      drawerVisible.value = false;
      handleSearch();
    } catch (e) {
      console.error(e);
    }
  }
};

const handleStatusChange = async (row: any) => {
  const newStatus = row.status === 1 ? 0 : 1;
  try {
    const tip = newStatus === 1 ? '启用' : '禁用';
    await ElMessageBox.confirm(`确定要${tip}该用户吗？`, '提示', { type: 'warning' });
    await userApi.updateUserStatus(row.id, newStatus);
    ElMessage.success(`用户${tip}成功`);
    handleSearch();
  } catch (e: any) {
    if (e !== 'cancel') {
      console.error(e);
      row.status = row.status === 1 ? 1 : 0; // revert switch
    }
  }
};

const handleResetPwd = async (row: any) => {
  try {
    const { value: newPassword } = await ElMessageBox.prompt(`请输入重置后的新密码（${row.nickName}）：`, '重设密码', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPattern: /^.{6,20}$/,
      inputErrorMessage: '密码长度需为 6-20 位'
    });
    await userApi.resetUserPassword(row.id, newPassword);
    ElMessage.success('密码重置成功');
  } catch (e) {
    if (e !== 'cancel') {
        console.error(e);
    }
  }
};
</script>

<template>
  <div class="bg-surface-sunken h-full rounded-2xl flex flex-col overflow-hidden">
    <!-- 表头搜索 -->
    <WnTableHeader class="shrink-0 p-6">
      <template #left>
        <WnSearchBar
          v-model="searchModel"
          :items="searchItems"
          @keyup.enter="handleSearch"
          search-bar-background="white"
        />
      </template>
    </WnTableHeader>

    <!-- 表格内容主体 -->
    <div
      class="px-6 flex-1 min-h-0 transition-opacity duration-500"
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
        <template #nickName="{ row }">
          <div class="flex items-center gap-3 py-1 cursor-pointer group">
            <div class="w-9 h-9 rounded-xl overflow-hidden bg-slate-50 flex-cc shrink-0 border border-slate-100">
              <img v-if="row.avatar" :src="row.avatar" class="w-full h-full object-cover" />
              <WnSvgIcon v-else icon="solar:user-bold" :size="20" class="text-slate-300" />
            </div>
            <span class="text-slate-800 font-medium">
              {{ row.nickName || row.username || '未命名' }}
            </span>
          </div>
        </template>

        <template #roleName="{ row }">
          <el-tag
            v-if="row.roleName"
            size="small"
            :type="parseRoleName(row.roleName).includes('管理员') ? 'danger' : parseRoleName(row.roleName).includes('医') ? 'primary' : 'success'"
          >
            {{ parseRoleName(row.roleName) }}
          </el-tag>
          <span v-else class="text-slate-400 text-sm">--</span>
        </template>

        <template #status="{ row }">
          <el-switch
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>

        <template #action="{ row }">
          <div class="flex items-center gap-2 justify-center text-sm font-medium">
            <div
              class="cursor-pointer text-primary-600 hover:text-primary-700 active:scale-95 transition-all"
              @click="handleEdit(row)"
            >
              编辑
            </div>
            <div class="w-[1px] h-3 bg-slate-200"></div>
            <div
              class="cursor-pointer text-warning-500 hover:text-warning-600 active:scale-95 transition-all"
              @click="handleResetPwd(row)"
            >
              重置密码
            </div>
          </div>
        </template>
      </WnTable>
    </div>

    <!-- 用户编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="450px"
      append-to-body
      destroy-on-close
    >
      <div class="h-full flex flex-col">
          <div class="flex-1 overflow-y-auto px-1 py-4">
              <WnForm
                ref="formRef"
                :items="formSchema"
              />
          </div>
          <div class="shrink-0 flex justify-end gap-3 mt-4">
               <el-button @click="drawerVisible = false">取消</el-button>
               <el-button type="primary" @click="handleDrawerSubmit">保存</el-button>
          </div>
      </div>
    </el-drawer>
  </div>
</template>
