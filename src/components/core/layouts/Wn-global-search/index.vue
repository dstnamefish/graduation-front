<!-- 全局搜索组件：支持路由、医生、患者、科室等多种数据类型的全局搜索，支持键盘快捷键 -->
<template>
  <div class="relative w-full" ref="containerRef">
    <ElInput v-model.trim="searchValue" :placeholder="$t('common.placeholder') + ' (Ctrl+K)'" @focus="openDropdown" @click="openDropdown" ref="searchInput">
      <template #prefix>
        <WnSvgIcon icon="cuida:search-outline" :size="18" class="text-t-100" />
      </template>
      <template #suffix>
        <Transition name="fade">
          <WnSvgIcon v-if="searchValue" icon="proicons:cancel" :size="18" class="text-t-200 hover:text-t-100 c-p transition-all active:scale-95" title="Clear" @mousedown.stop="handleClear" />
        </Transition>
      </template>
    </ElInput>
    <Transition name="dropdown">
      <div v-show="showDropdown" class="absolute w-full mt-2 p-2 bg-box rounded-2xl z-50 overflow-hidden shadow-md" @mousedown.stop>
        <div v-if="!searchValue && historyResult.length > 0">
          <div class="flex-cb px-3 py-2">
            <span class="text-t-0">{{ $t('common.search.history') }}</span>
            <button class="text-sm c-p text-t-200 hover:text-primary transition-colors" @mousedown.stop="clearHistory">{{ $t('common.clear') }}</button>
          </div>
          <div class="flex flex-wrap gap-2.5 p-2">
            <div v-for="(item, index) in historyResult" :key="item.path || item.id" class="group relative flex-ic c-p px-3 py-1.5 rounded-sm bg-g-150 hover:text-primary transition-all duration-300 max-w-[140px]" @mousedown="selectItem(item)" :title="item.title">
              <span class="text-sm truncate w-full block">{{ item.title }}</span>
              <WnSvgIcon icon="local-actions/delete" :size="18" color="#C0C0C0" class="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity" @mousedown.stop="deleteHistory(index)" />
            </div>
          </div>
        </div>
        <div v-if="searchValue">
          <div v-if="searchResult.length > 0" class="search-results max-h-[400px] overflow-y-auto">
            <div v-for="(item, index) in searchResult" :key="item.id || item.path" class="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 mx-1" :class="[keyboardIndex === index ? 'bg-slate-100 dark:bg-slate-800 text-t-100' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-t-100']" @mousedown="selectItem(item)">
              <div class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 transition-colors">
                <WnSvgIcon :icon="item.icon" :size="20" />
              </div>
              <div class="flex-1 flex flex-col min-w-0">
                <span class="text-[14px] font-semibold truncate">{{ item.title }}</span>
                <span class="text-[11px] truncate mt-0.5 text-slate-400">{{ item.subtitle || item.path }}</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter" :class="{
                'bg-blue-50 text-blue-500 dark:bg-blue-500/10': item.type === 'route',
                'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10': item.type === 'doctor',
                'bg-orange-50 text-orange-500 dark:bg-orange-500/10': item.type === 'patient',
                'bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10': item.type === 'department',
                'bg-red-50 text-red-500 dark:bg-red-500/10': item.type === 'disease',
                'bg-teal-50 text-teal-500 dark:bg-teal-500/10': item.type === 'medicine',
                'bg-yellow-50 text-yellow-500 dark:bg-yellow-500/10': item.type === 'sop' || item.type === 'regulation',
                'bg-purple-50 text-purple-500 dark:bg-purple-500/10': item.type === 'billing' || item.type === 'supply',
              }">
                {{ item.type }}
              </span>
            </div>
          </div>
          <div v-else class="flex flex-col items-center py-10 text-slate-300">
            <div class="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50">
              <WnSvgIcon icon="local-actions/search" :size="32" class="opacity-20" />
            </div>
            <p class="text-sm font-medium text-slate-400">{{ $t('common.search.noResult') }}</p>
          </div>
        </div>
        <div class="mt-2 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center gap-5 px-3 py-1.5 text-[11px] text-slate-400 font-medium">
          <span class="flex items-center gap-1.5">
            <kbd class="min-w-[20px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200/50 dark:border-slate-700 shadow-sm flex items-center justify-center font-sans">↵</kbd>
            {{ $t('common.select') }}
          </span>
          <span class="flex items-center gap-1.5">
            <kbd class="min-w-[20px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200/50 dark:border-slate-700 shadow-sm flex items-center justify-center font-sans">↑</kbd>
            <kbd class="min-w-[20px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200/50 dark:border-slate-700 shadow-sm flex items-center justify-center font-sans">↓</kbd>
            {{ $t('common.navigate') }}
          </span>
          <span class="flex items-center gap-1.5">
            <kbd class="min-w-[20px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200/50 dark:border-slate-700 shadow-sm flex items-center justify-center font-sans">esc</kbd>
            {{ $t('common.close') }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/types/api/user.model';
import { AppRouteRecord } from '@/types';
import { getMockDoctors, getMockPatients, getMockDepartments, getMockClinical, getMockManagement, getMockBilling } from '@/mock';

defineOptions({ name: 'WnGlobalSearch' });

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const showDropdown = ref(false);
const searchInput = ref<any>(null);
const containerRef = ref<HTMLElement | null>(null);
const searchValue = ref('');
const keyboardIndex = ref(-1);
const searchResult = ref<ExtendedSearchResult[]>([]);

/** 扩展搜索结果类型 */
interface ExtendedSearchResult {
  id?: string | number;
  title: string;
  subtitle?: string;
  path?: string;
  icon: string;
  type: 'route' | 'doctor' | 'patient' | 'department' | 'disease' | 'medicine' | 'sop' | 'regulation' | 'billing' | 'supply';
}

/** 历史搜索结果 */
const historyResult = computed<ExtendedSearchResult[]>(() => {
  return (userStore.searchHistory || []).map((item) => {
    if (item.type) return item;
    return { title: item.meta?.title ? t(item.meta.title as string) : item.title || '', path: item.path, icon: (item.meta?.icon as string) || item.icon || 'local-common/menu', type: 'route', id: item.path };
  });
});

/** 所有可用路由 */
const allAvailableRoutes = computed(() => {
  return router.getRoutes().filter((route) => route.meta?.title && !route.meta?.isHide && route.name && route.path !== '/') as unknown as AppRouteRecord[];
});

/** 过滤搜索结果 */
const filterSearch = (query: string) => {
  if (!query) return [];
  const normalizedQuery = query.toLowerCase();
  const results: ExtendedSearchResult[] = [];
  allAvailableRoutes.value.forEach((route) => {
    const translatedTitle = t(route.meta.title as string);
    if (translatedTitle.toLowerCase().includes(normalizedQuery)) results.push({ title: translatedTitle, path: route.path, icon: (route.meta.icon as string) || 'local-common/menu', type: 'route' });
  });
  getMockDoctors().forEach((doc) => {
    if (doc.name.toLowerCase().includes(normalizedQuery) || doc.specialty.toLowerCase().includes(normalizedQuery)) results.push({ id: doc.doctorCode, title: doc.name, subtitle: doc.specialty, path: '/doctors', icon: 'local-business/doctors', type: 'doctor' });
  });
  getMockPatients().forEach((pt) => {
    if (pt.name.toLowerCase().includes(normalizedQuery) || pt.patientId.toLowerCase().includes(normalizedQuery)) results.push({ id: pt.patientId, title: pt.name, subtitle: pt.patientId, path: '/patients', icon: 'local-business/menu-patients', type: 'patient' });
  });
  getMockDepartments().forEach((dept) => {
    if (dept.name.toLowerCase().includes(normalizedQuery)) results.push({ id: dept.code, title: dept.name, subtitle: dept.floor, path: '/departments', icon: 'local-business/departments', type: 'department' });
  });
  getMockClinical().forEach((item) => {
    if (item.name.toLowerCase().includes(normalizedQuery) || item.description?.toLowerCase().includes(normalizedQuery)) results.push({ id: item.id, title: item.name, subtitle: item.description, icon: item.type === 'disease' ? 'local-menu/clinical' : 'local-common/medicine', type: item.type });
  });
  getMockManagement().forEach((item) => {
    if (item.name.toLowerCase().includes(normalizedQuery) || item.department?.toLowerCase().includes(normalizedQuery)) results.push({ id: item.id, title: item.name, subtitle: item.department, icon: 'local-common/file', type: item.type });
  });
  getMockBilling().forEach((item) => {
    if (item.name.toLowerCase().includes(normalizedQuery)) results.push({ id: item.id, title: item.name, subtitle: item.type === 'billing' ? `价格：${item.price}` : `位置：${item.location}`, icon: item.type === 'billing' ? 'local-common/money' : 'local-common/box', type: item.type });
  });
  return results.slice(0, 10);
};

/** 防抖搜索 */
const performSearch = createSmartDebounce(async (val: string) => {
  searchResult.value = filterSearch(val);
  keyboardIndex.value = searchResult.value.length > 0 ? 0 : -1;
}, 300);

function handleClear() {
  searchValue.value = '';
  searchResult.value = [];
  keyboardIndex.value = -1;
  nextTick(() => searchInput.value?.focus());
}

function openDropdown() {
  showDropdown.value = true;
}

function closeDropdown() {
  showDropdown.value = false;
  searchValue.value = '';
  searchResult.value = [];
  keyboardIndex.value = -1;
}

function focusAndOpen() {
  openDropdown();
  nextTick(() => searchInput.value?.focus());
}

function selectItem(item: ExtendedSearchResult) {
  if (item.path) router.push(item.path);
  addHistory(item);
  closeDropdown();
}

function addHistory(item: ExtendedSearchResult) {
  const history = [...userStore.searchHistory];
  const itemKey = item.id || `${item.type}-${item.path}-${item.title}`;
  const existingIndex = history.findIndex((h) => {
    const hKey = h.id || `${h.type}-${h.path}-${h.title}`;
    return hKey === itemKey;
  });
  if (existingIndex !== -1) history.splice(existingIndex, 1);
  const historyItem = { id: item.id, title: item.title, subtitle: item.subtitle, path: item.path, icon: item.icon, type: item.type };
  history.unshift(historyItem);
  if (history.length > 10) history.pop();
  userStore.setSearchHistory(history);
}

function deleteHistory(index: number) {
  const history = [...userStore.searchHistory];
  history.splice(index, 1);
  userStore.setSearchHistory(history);
}

/** 键盘事件处理 */
const handleKeydown = (event: KeyboardEvent) => {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const isCommandKey = isMac ? event.metaKey : event.ctrlKey;
  if (isCommandKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    focusAndOpen();
    return;
  }
  if (!showDropdown.value) return;
  const list = searchValue.value ? searchResult.value : historyResult.value;
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      if (list.length) keyboardIndex.value = keyboardIndex.value <= 0 ? list.length - 1 : keyboardIndex.value - 1;
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (list.length) keyboardIndex.value = keyboardIndex.value >= list.length - 1 ? 0 : keyboardIndex.value + 1;
      break;
    case 'Enter':
      event.preventDefault();
      if (keyboardIndex.value >= 0 && list[keyboardIndex.value]) selectItem(list[keyboardIndex.value]);
      break;
    case 'Escape':
      event.preventDefault();
      closeDropdown();
      break;
  }
};

onClickOutside(containerRef, () => {
  showDropdown.value = false;
});

watch(searchValue, (newVal) => {
  if (!newVal) {
    searchResult.value = [];
    keyboardIndex.value = -1;
    return;
  }
  performSearch(newVal);
});

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  transform: translateY(-12px) scale(0.98);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.search-results {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
kbd {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
}
</style>
