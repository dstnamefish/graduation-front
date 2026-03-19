<template>
  <div class="flex flex-col h-full bg-surface rounded-2xl border border-border">
    <div class="p-4 md:p-6 shrink-0">
      <ElInput
        v-model="searchQuery"
        placeholder="Search name, chat, etc"
        class="search-input"
        clearable
      >
        <template #prefix>
          <WnSvgIcon
            icon="akar-icons:search"
            :size="18"
            class="text-placeholder"
          />
        </template>
        <template #suffix>
          <button
            class="p-1 text-placeholder hover:text-primary-500 transition-colors cursor-pointer"
          >
            <WnSvgIcon
              icon="mi:filter"
              :size="18"
            />
          </button>
        </template>
      </ElInput>
    </div>

    <ElScrollbar class="flex-1 min-h-0">
      <div class="px-3 pb-4 space-y-1">
        <div
          v-if="loading"
          class="flex flex-col gap-4 p-2"
        >
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center gap-3 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-200 rounded-full shrink-0"></div>
            <div class="flex-1">
              <div class="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
              <div class="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <TransitionGroup
          name="list"
          tag="div"
          class="space-y-1"
        >
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            :class="[
              'flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-300',
              activeChat?.id === chat.id
                ? 'bg-card ring-1 ring-border translate-x-1'
                : 'hover:bg-surface hover:shadow-sm',
            ]"
            @click="$emit('select', chat)"
          >
            <div class="relative mr-4 shrink-0">
              <div class="w-12 h-12 rounded-full overflow-hidden border border-border shadow-sm">
                <img
                  :src="chat.targetUserAvatar"
                  class="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2 truncate">
                  <h3 class="text-sm font-bold text-title truncate">{{ chat.targetUserName }}</h3>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-md text-xs font-bold shrink-0',
                      getRoleClass(chat.targetUserRole),
                    ]"
                  >
                    {{ chat.targetUserRole }}
                  </span>
                </div>

                <span
                  :class="[
                    'text-xs ml-2 shrink-0 transition-colors duration-300',
                    chat.unreadCount > 0
                      ? 'text-red-500 font-bold'
                      : 'text-placeholder font-medium',
                  ]"
                >
                  {{ formatTime(chat.lastMessageTime) }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-xs text-muted truncate font-medium pr-2">
                  {{ chat.lastMessageContent || 'No messages yet' }}
                </p>

                <div
                  v-if="chat.unreadCount > 0"
                  class="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                >
                  {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <div
          v-if="!loading && filteredChats.length === 0"
          class="text-center py-10 opacity-60"
        >
          <p class="text-muted text-sm font-medium">No conversations found</p>
        </div>
      </div>
    </ElScrollbar>

    <div class="p-4 border-t border-border shrink-0">
      <WnButton
        type="primary"
        label="New Message"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import { ElScrollbar, ElInput } from 'element-plus';

const props = defineProps<{
  chats: any[];
  activeChat: any;
  loading: boolean;
}>();

defineEmits(['select']);

const searchQuery = ref('');

// 搜索过滤
const filteredChats = computed(() => {
  return props.chats.filter((chat) => {
    return chat.targetUserName.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// 匹配图片中的 Patient (蓝青底) 和 Doctor (粉红底)
const getRoleClass = (role: string) => {
  if (role === 'Patient') return 'bg-primary-100 text-primary-700';
  if (role === 'Doctor') return 'bg-danger-100 text-danger-700';
  return 'bg-slate-100 text-slate-600';
};

// 时间格式化 (统一为 09:30 AM 格式)
const formatTime = (time?: string) => {
  if (!time) return '';
  return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* 错落滑动动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
