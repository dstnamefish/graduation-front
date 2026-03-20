<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import WnTable from '@/components/core/tables/Wn-table/index.vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import { useTable } from '@/hooks/core/useTable';
import { getRoleList, getMenuTree, getRoleMenuIds, updateRolePermissions } from '@/api/role';

defineOptions({ name: 'SystemRole' });

// ================= 角色列表相关 =================
const {
  loading,
  data: tableData,
  pagination,
  handleCurrentChange,
  handleSizeChange,
  getData: handleSearch,
} = useTable({
  core: {
    apiFn: (params) => getRoleList({ ...params }),
    paginationKey: { current: 'pageNum', size: 'pageSize' },
    immediate: true,
  },
});

const columns = computed(() => [
  { label: '角色名称', prop: 'name', minWidth: 160 },
  { label: '角色编码', prop: 'code', minWidth: 140 },
  { label: '状态', prop: 'status', minWidth: 120, useSlot: true },
  { label: '备注', prop: 'remark', minWidth: 180 },
  { label: '操作', prop: 'action', minWidth: 160, useSlot: true, align: 'center' },
]);

// ================= 权限配置 (Drawer) 相关 =================
const drawerVisible = ref(false);
const treeLoading = ref(false);
const submitting = ref(false);
const treeRef = ref<any>(null);
const menuTreeData = ref<any[]>([]);
const currentRoleId = ref<number | null>(null);

// 定义树形控件的配置
const defaultProps = {
  children: 'children',
  label: 'title', // 假设后端返回的是 title 或者 name
};

// 页面加载时仅请求一次完整权限树
onMounted(async () => {
  try {
    const res = await getMenuTree();
    menuTreeData.value = (res as any) || [];
  } catch (error) {
    console.error('获取菜单树失败', error);
  }
});

/**
 * 打开权限配置抽屉
 */
const handleConfigAuth = async (row: any) => {
  currentRoleId.value = row.id;
  drawerVisible.value = true;
  treeLoading.value = true;

  try {
    const menuIds = await getRoleMenuIds(row.id);
    if (treeRef.value) {
      // 在 Element Plus 中回显树节点（规避父节点半选问题，只 set 叶子节点。也可以直接 setCheckedKeys。这里直接全量 set）
      treeRef.value.setCheckedKeys(menuIds || []);
    }
  } catch (error) {
    console.error('获取角色权限失败', error);
  } finally {
    treeLoading.value = false;
  }
};

/**
 * 提交角色权限变更
 */
const handleSubmitAuth = async () => {
  if (!currentRoleId.value || !treeRef.value) return;
  submitting.value = true;
  try {
    // 获取完全选中的节点和半选中的节点
    const checkedKeys = treeRef.value.getCheckedKeys();
    const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
    const allSelectedKeys = [...checkedKeys, ...halfCheckedKeys];

    await updateRolePermissions(currentRoleId.value, allSelectedKeys);
    ElMessage.success('权限分配成功！');
    drawerVisible.value = false;
  } catch (error) {
    console.error('保存权限失败', error);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="h-full bg-slate-50 p-6 overflow-hidden flex flex-col">
    <!-- 主体白色大卡片圆角容器 -->
    <div class="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
      <!-- 头部区域 -->
      <div class="mb-6 px-2 flex justify-between items-center shrink-0">
        <div>
          <h2 class="text-xl font-bold text-slate-800 tracking-tight">角色管理</h2>
          <p class="text-sm text-slate-500 mt-1">设置系统内部不同角色及其菜单路由与细粒度按钮权限。</p>
        </div>
      </div>

      <!-- 角色表格 -->
      <div class="flex-1 min-h-0 relative">
        <WnTable
          ref="tableRef"
          :loading="loading"
          :pagination="pagination"
          :data="tableData"
          :columns="columns"
          @pagination:size-change="handleSizeChange"
          @pagination:current-change="handleCurrentChange"
        >
          <!-- 状态药丸标签 -->
          <template #status="{ row }">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
              :class="row.status === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'"
            >
              {{ row.status === 1 ? '启用' : '禁用' }}
            </span>
          </template>

          <template #action="{ row }">
            <div class="flex justify-center items-center">
              <!-- 使用 v-roles 指令进行权限隔离 -->
              <div
                v-roles="['R_SUPER']"
                class="flex items-center gap-1.5 cursor-pointer text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg active:scale-95 transition-all w-fit"
                @click="handleConfigAuth(row)"
              >
                <WnSvgIcon icon="lucide:shield-check" :size="16" />
                <span class="text-[13px] font-bold">配置权限</span>
              </div>
            </div>
          </template>
        </WnTable>
      </div>
    </div>

    <!-- 权限分配全高抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="配置权限"
      size="480px"
      append-to-body
      destroy-on-close
    >
      <div class="flex flex-col h-full bg-white relative">
        <div class="px-6 py-5 border-b border-slate-100 shrink-0">
          <h3 class="text-lg font-bold text-slate-800">配置角色菜单及按钮</h3>
          <p class="text-[13px] text-slate-500 mt-1.5">勾选所需赋予该角色的可见路由页面以及功能按钮操作权。</p>
        </div>

        <div class="flex-1 px-6 py-5 overflow-y-auto" v-loading="treeLoading">
          <!-- 具备呼吸感包裹层的树形容器 -->
          <div class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 shadow-inner">
            <el-tree
              ref="treeRef"
              :data="menuTreeData"
              :props="defaultProps"
              node-key="id"
              show-checkbox
              default-expand-all
              :expand-on-click-node="false"
              class="!bg-transparent"
            >
              <template #default="{ node, data }">
                <div class="flex items-center h-8 group w-full pr-4">
                  <!-- 区分普通菜单和具备权限标识的叶子按钮节点 -->
                  <div class="flex items-center gap-2">
                    <span
                      class="text-sm font-medium transition-colors"
                      :class="data.permission ? 'text-slate-600' : 'text-slate-800'"
                    >
                      {{ node.label || data.name || '未知项' }}
                    </span>

                    <!-- 权限标识的独特高亮 Tag -->
                    <span
                      v-if="data.permission"
                      class="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm border"
                      :class="{
                        'bg-blue-50 text-blue-600 border-blue-100': data.permission.includes('add') || data.permission.includes('create'),
                        'bg-orange-50 text-orange-600 border-orange-100': data.permission.includes('edit') || data.permission.includes('update'),
                        'bg-red-50 text-red-600 border-red-100': data.permission.includes('delete') || data.permission.includes('remove'),
                        'bg-teal-50 text-teal-600 border-teal-100': data.permission.includes('import') || data.permission.includes('export') || data.permission.includes('download'),
                        'bg-slate-100 text-slate-500 border-slate-200': !data.permission.match(/(add|create|edit|update|delete|remove|import|export|download)/i)
                      }"
                    >
                      {{ data.permission }}
                    </span>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-4 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)]">
          <button
            class="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all"
            @click="drawerVisible = false"
          >
            取消配置
          </button>
          <button
            class="py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm shadow-md hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2"
            :disabled="submitting"
            @click="handleSubmitAuth"
          >
            <WnSvgIcon v-if="submitting" icon="line-md:loading-loop" :size="16" />
            保存分配
          </button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
