<template>
  <div
    class="messages-container flex h-[calc(100vh-100px)] bg-white rounded-3xl overflow-hidden shadow-sm border border-default-border"
  >
    <!-- Mobile Overlay -->
    <div
      v-if="isMobile && showChatArea"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="showChatArea = false"
    />

    <!-- Chat List Sidebar -->
    <div
      :class="[
        'border-r border-default-border flex flex-col bg-[#fcfcfd] transition-all duration-300',
        isMobile ? (showChatArea ? 'hidden' : 'w-full') : 'w-80 xl:w-96',
      ]"
    >
      <div class="p-4 md:p-6">
        <h1 class="text-xl md:text-2xl font-bold text-secondary mb-4 md:mb-6">Messages</h1>

        <!-- Search -->
        <div class="relative mb-4 md:mb-6">
          <WnSvgIcon
            icon="akar-icons:search"
            :size="18"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full bg-white border border-default-border rounded-xl py-2.5 md:py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <!-- Filters/Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'px-3 md:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-secondary text-white shadow-md'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Conversations List -->
      <ElScrollbar class="flex-1">
        <div class="px-2 md:px-3 pb-6 space-y-1">
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex flex-col gap-3 p-4"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="flex items-center gap-3 animate-pulse"
            >
              <div class="w-12 h-12 bg-gray-200 rounded-full" />
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div class="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>

          <!-- Chat Items -->
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            :class="[
              'flex items-center p-3 md:p-4 rounded-2xl cursor-pointer transition-all',
              activeChat?.id === chat.id
                ? 'bg-primary/5 border-l-4 border-primary'
                : 'hover:bg-gray-50',
            ]"
            @click="selectChat(chat)"
          >
            <!-- Avatar with Status -->
            <div class="relative mr-3 md:mr-4 shrink-0">
              <div
                class="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-sm"
              >
                <img
                  :src="chat.avatar || defaultAvatar"
                  class="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>
              <div
                v-if="chat.onlineStatus === 'online'"
                class="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-success border-2 border-white rounded-full"
              />
            </div>

            <!-- Chat Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-sm font-bold text-secondary truncate">{{ chat.name }}</h3>
                <span class="text-[10px] text-gray-400 font-medium ml-2">
                  {{ formatTime(chat.lastMessageTime) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-[11px] text-gray-500 truncate font-medium">
                  {{ chat.lastMessageContent || 'No messages yet' }}
                </p>
                <div
                  v-if="chat.unreadCount > 0"
                  class="w-5 h-5 bg-error rounded-full flex-cc text-[10px] text-white font-bold ml-2 shrink-0"
                >
                  {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="!loading && filteredChats.length === 0"
            class="text-center py-12"
          >
            <WnSvgIcon
              icon="solar:chat-round-line-bold-duotone"
              :size="48"
              class="text-gray-300 mx-auto mb-4"
            />
            <p class="text-gray-400 text-sm">No conversations found</p>
          </div>
        </div>
      </ElScrollbar>
    </div>

    <!-- Main Chat Area -->
    <div
      :class="[
        'flex-1 flex flex-col bg-white transition-all duration-300',
        isMobile ? (showChatArea ? 'fixed inset-0 z-50' : 'hidden') : '',
      ]"
    >
      <template v-if="activeChat">
        <!-- Chat Header -->
        <div
          class="h-16 md:h-[88px] px-4 md:px-8 border-b border-default-border flex items-center justify-between bg-white"
        >
          <div class="flex items-center">
            <!-- Back Button (Mobile) -->
            <button
              v-if="isMobile"
              class="mr-3 p-2 -ml-2 text-gray-500 hover:text-secondary rounded-lg hover:bg-gray-100 transition-colors"
              @click="showChatArea = false"
            >
              <WnSvgIcon
                icon="solar:arrow-left-linear"
                :size="20"
              />
            </button>

            <div class="relative mr-3 md:mr-4">
              <div
                class="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-primary/10"
              >
                <img
                  :src="activeChat.avatar || defaultAvatar"
                  class="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>
              <div
                v-if="activeChat.onlineStatus === 'online'"
                class="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-success border-2 border-white rounded-full"
              />
            </div>
            <div>
              <h2 class="text-sm md:text-base font-bold text-secondary">{{ activeChat.name }}</h2>
              <span class="text-[10px] md:text-[11px] text-gray-400 font-medium flex items-center">
                <span
                  v-if="activeChat.onlineStatus === 'online'"
                  class="w-1.5 h-1.5 bg-success rounded-full mr-1.5"
                />
                {{ activeChat.onlineStatus === 'online' ? 'Active now' : 'Away' }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 md:gap-3">
            <button
              class="hidden sm:flex p-2 md:p-3 bg-gray-50 text-secondary rounded-xl hover:bg-gray-100 transition-colors"
            >
              <WnSvgIcon
                icon="solar:phone-bold"
                :size="18"
              />
            </button>
            <button
              class="hidden sm:flex p-2 md:p-3 bg-gray-50 text-secondary rounded-xl hover:bg-gray-100 transition-colors"
            >
              <WnSvgIcon
                icon="solar:videocamera-record-bold"
                :size="18"
              />
            </button>
            <button
              class="p-2 md:p-3 bg-gray-50 text-secondary rounded-xl hover:bg-gray-100 transition-colors"
            >
              <WnSvgIcon
                icon="solar:menu-dots-bold"
                :size="18"
              />
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <ElScrollbar
          ref="messagesScrollRef"
          class="flex-1 bg-[#fcfcfd]"
        >
          <div class="p-4 md:p-8 space-y-4 md:space-y-6">
            <!-- Messages Loading -->
            <div
              v-if="messagesLoading"
              class="flex justify-center py-8"
            >
              <div
                class="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
              />
            </div>

            <!-- Messages List -->
            <div
              v-for="(msg, index) in currentMessages"
              :key="index"
              :class="['flex', msg.isOwn ? 'justify-end' : 'justify-start']"
            >
              <div
                :class="[
                  'max-w-[85%] md:max-w-[70%] flex flex-col',
                  msg.isOwn ? 'items-end' : 'items-start',
                ]"
              >
                <!-- Message Bubble -->
                <div
                  :class="[
                    'px-4 md:px-5 py-3 md:py-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all hover:shadow-md',
                    msg.isOwn
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white text-secondary border border-default-border rounded-tl-none',
                  ]"
                >
                  {{ msg.content }}
                </div>
                <!-- Time & Status -->
                <div class="mt-1.5 md:mt-2 flex items-center gap-2">
                  <span class="text-[10px] text-gray-400 font-medium">
                    {{ formatMessageTime(msg.sentAt) }}
                  </span>
                  <WnSvgIcon
                    v-if="msg.isOwn && msg.readAt"
                    icon="solar:check-read-bold"
                    :size="14"
                    class="text-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </ElScrollbar>

        <!-- Chat Input -->
        <div class="p-3 md:p-6 border-t border-default-border bg-white">
          <div class="bg-gray-50 rounded-2xl p-2 pl-3 md:pl-4 flex items-center gap-2 shadow-inner">
            <button class="p-2 text-gray-400 hover:text-primary transition-colors hidden sm:block">
              <WnSvgIcon
                icon="solar:paperclip-2-bold"
                :size="20"
              />
            </button>
            <input
              v-model="newMessage"
              type="text"
              placeholder="Write your message here..."
              class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 md:py-3 text-secondary font-medium"
              @keyup.enter="sendMessage"
            />
            <button class="p-2 text-gray-400 hover:text-primary transition-colors hidden sm:block">
              <WnSvgIcon
                icon="solar:smile-circle-bold"
                :size="20"
              />
            </button>
            <button
              :disabled="!newMessage.trim() || sending"
              :class="[
                'text-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex-cc transition-all',
                newMessage.trim() && !sending
                  ? 'bg-primary shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed',
              ]"
              @click="sendMessage"
            >
              <WnSvgIcon
                v-if="!sending"
                icon="solar:plain-bold"
                :size="18"
              />
              <div
                v-else
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            </button>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="flex-1 flex-col items-center justify-center p-8 text-center bg-[#fcfcfd] hidden lg:flex"
      >
        <div class="w-48 h-48 md:w-64 md:h-64 bg-primary/5 rounded-full flex-cc mb-6 md:mb-8">
          <WnSvgIcon
            icon="solar:chat-round-line-bold-duotone"
            :size="80"
            class="text-primary/30"
          />
        </div>
        <h2 class="text-xl md:text-2xl font-bold text-secondary mb-3">Welcome to your Inbox</h2>
        <p class="text-gray-400 max-w-sm text-sm font-medium leading-relaxed">
          Select a conversation from the sidebar to start chatting with your medical team or
          patients.
        </p>
        <button
          class="mt-6 md:mt-8 bg-secondary text-white px-6 md:px-8 py-3 md:py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-secondary/20 hover:bg-secondary/90 active:scale-95 transition-all"
        >
          New Message
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { conversationService } from '@/features/message/api.conversation';
import { messageService } from '@/features/message/api';
import type { ConversationResponse, MessageResponse } from '@/types/api';
import { ElScrollbar } from 'element-plus';

// Responsive state
const isMobile = ref(false);
const showChatArea = ref(false);

// Data state
const loading = ref(false);
const messagesLoading = ref(false);
const sending = ref(false);
const searchQuery = ref('');
const activeTab = ref('all');
const newMessage = ref('');
const messagesScrollRef = ref<InstanceType<typeof ElScrollbar> | null>(null);

// Default avatar
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

// Tabs configuration
const tabs = [
  { id: 'all', name: 'All Chats' },
  { id: 'patients', name: 'Patients' },
  { id: 'doctors', name: 'Doctors' },
  { id: 'unread', name: 'Unread' },
];

// Chat data
interface ChatItem extends ConversationResponse {
  avatar?: string;
  name: string;
}

interface MessageItem extends MessageResponse {
  isOwn: boolean;
}

const chats = ref<ChatItem[]>([]);
const activeChat = ref<ChatItem | null>(null);
const currentMessages = ref<MessageItem[]>([]);

// Computed filtered chats
const filteredChats = computed(() => {
  return chats.value.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    if (activeTab.value === 'unread') {
      return matchesSearch && chat.unreadCount > 0;
    }
    return matchesSearch;
  });
});

// Check screen size
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024;
};

// Format time display
const formatTime = (time?: string) => {
  if (!time) {
    return '';
  }
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatMessageTime = (time?: string) => {
  if (!time) {
    return '';
  }
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Fetch conversations
const fetchConversations = async () => {
  loading.value = true;
  try {
    const data = await conversationService.fetchConversations();
    chats.value = data.map((conv) => ({
      ...conv,
      avatar: conv.targetUserAvatar || defaultAvatar,
      name: conv.targetUserName || conv.name || 'Unknown',
    }));
  } catch {
    // Use mock data on error
    chats.value = getMockChats();
  } finally {
    loading.value = false;
  }
};

// Fetch messages for a conversation
const fetchMessages = async (conversationId: number) => {
  messagesLoading.value = true;
  try {
    const data = await messageService.getMessagesByConversation(conversationId);
    // Assuming we have current user ID from auth context
    const currentUserId = 1; // TODO: Get from auth store
    currentMessages.value = data.map((msg) => ({
      ...msg,
      isOwn: msg.senderId === currentUserId,
    }));
    scrollToBottom();
  } catch {
    currentMessages.value = getMockMessages();
  } finally {
    messagesLoading.value = false;
  }
};

// Select a chat
const selectChat = async (chat: ChatItem) => {
  activeChat.value = chat;
  if (isMobile.value) {
    showChatArea.value = true;
  }
  await fetchMessages(chat.id);

  // Mark as read
  if (chat.unreadCount > 0) {
    try {
      await messageService.batchMarkAsRead(chat.id);
      chat.unreadCount = 0;
    } catch {
      // Silent fail
    }
  }
};

// Send message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !activeChat.value || sending.value) {
    return;
  }

  sending.value = true;
  const content = newMessage.value;
  newMessage.value = '';

  // Optimistic update
  const tempMessage: MessageItem = {
    id: Date.now(),
    content,
    type: 0,
    sourceType: 0,
    status: 1,
    sentAt: new Date().toISOString(),
    senderId: 1,
    conversationId: activeChat.value.id,
    tenantId: 1,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
    isOwn: true,
  };
  currentMessages.value.push(tempMessage);
  scrollToBottom();

  try {
    await messageService.sendMessage({
      content,
      conversationId: activeChat.value.id,
    });
  } catch {
    // Message already shown, silent fail
  } finally {
    sending.value = false;
  }
};

// Scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesScrollRef.value) {
      const scrollEl = messagesScrollRef.value.$el?.querySelector('.el-scrollbar__wrap');
      if (scrollEl) {
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    }
  });
};

// Mock data
const getMockChats = (): ChatItem[] => [
  {
    id: 1,
    name: 'Dr. Petra Winsburry',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petra',
    lastMessageContent: 'The patient overview report for today is ready.',
    lastMessageTime: new Date().toISOString(),
    onlineStatus: 'online',
    unreadCount: 2,
    type: 0,
    status: 1,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Emily Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    lastMessageContent: 'Thank you for the prescription, doctor.',
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    onlineStatus: 'away',
    unreadCount: 0,
    type: 0,
    status: 1,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'John Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    lastMessageContent: 'Is the MRI machine available for emergency?',
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    onlineStatus: 'online',
    unreadCount: 0,
    type: 0,
    status: 1,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Linda Green',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
    lastMessageContent: 'The surgery was successful. Patient is stable.',
    lastMessageTime: new Date(Date.now() - 172800000).toISOString(),
    onlineStatus: 'away',
    unreadCount: 0,
    type: 0,
    status: 1,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
  },
];

const getMockMessages = (): MessageItem[] => [
  {
    id: 1,
    content: 'Hi, I have finished the report.',
    type: 0,
    sourceType: 0,
    status: 1,
    sentAt: new Date(Date.now() - 300000).toISOString(),
    senderId: 2,
    conversationId: 1,
    tenantId: 1,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
    isOwn: false,
  },
  {
    id: 2,
    content: 'The patient overview report for today is ready.',
    type: 0,
    sourceType: 0,
    status: 1,
    sentAt: new Date(Date.now() - 240000).toISOString(),
    senderId: 2,
    conversationId: 1,
    tenantId: 1,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
    isOwn: false,
  },
  {
    id: 3,
    content: 'Thank you! I will review it immediately.',
    type: 0,
    sourceType: 0,
    status: 1,
    sentAt: new Date(Date.now() - 180000).toISOString(),
    readAt: new Date().toISOString(),
    senderId: 1,
    conversationId: 1,
    tenantId: 1,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
    isOwn: true,
  },
];

// Lifecycle
onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  fetchConversations();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.flex-cc {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .messages-container {
    height: calc(100vh - 80px);
    border-radius: 1rem;
  }
}

@media (max-width: 640px) {
  .messages-container {
    height: calc(100vh - 60px);
    border-radius: 0;
    margin: -1rem;
    width: calc(100% + 2rem);
  }
}
</style>
