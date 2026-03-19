<template>
  <div class="relative w-full h-full flex-1">
    <div class="absolute inset-0 flex gap-4 bg-surface overflow-hidden">

      <Transition name="fade">
        <div
          v-if="isMobile && showChatArea"
          class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          @click="showChatArea = false"
        ></div>
      </Transition>

      <ChatSidebar
        :chats="chats"
        :active-chat="activeChat"
        :loading="loading"
        :class="[
          '',
          isMobile ? (showChatArea ? 'hidden' : 'w-full') : 'w-80 xl:w-96 shrink-0'
        ]"
        @select="handleSelectChat"
      />

      <ChatArea
        :active-chat="activeChat"
        :messages="currentMessages"
        :messages-loading="messagesLoading"
        :sending="sending"
        :class="[
          'flex-1 min-w-0 transition-all duration-300 z-50',
          isMobile ? (showChatArea ? 'fixed inset-0' : 'hidden') : ''
        ]"
        @send="handleSendMessage"
        @send-files="handleSendFiles"
        @back="showChatArea = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ChatSidebar from './modules/ChatSidebar.vue';
import ChatArea from './modules/ChatArea.vue';
// 🚀 直接导入静态 Mock 数据，脱离真实 API
import { mockConversations, mockMessages } from '@/mock/messages';

defineOptions({ name: 'MessagesLayout' });

const isMobile = ref(false);
const showChatArea = ref(false);
const loading = ref(false);
const messagesLoading = ref(false);
const sending = ref(false);

const chats = ref<any[]>([]);
const activeChat = ref<any | null>(null);
const currentMessages = ref<any[]>([]);

const currentUserId = 1; // 模拟当前登录用户的 ID

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024;
};

// 模拟获取联系人列表
const fetchConversations = () => {
  loading.value = true;
  setTimeout(() => {
    chats.value = [...mockConversations];
    loading.value = false;
  }, 600); // 模拟 600ms 的网络延迟
};

// 模拟获取聊天记录
const handleSelectChat = (chat: any) => {
  activeChat.value = chat;
  if (isMobile.value) {
    showChatArea.value = true;
  }

  messagesLoading.value = true;
  setTimeout(() => {
    // 过滤出当前对话的消息（目前只有 ID=4 有数据，其他的会显示空白欢迎页）
    const data = mockMessages.filter((m) => m.conversationId === chat.id);

    currentMessages.value = data.map((msg: any) => ({
      ...msg,
      isOwn: msg.senderId === currentUserId,
    }));
    messagesLoading.value = false;
  }, 400); // 模拟 400ms 的网络延迟
};

// 模拟发送消息
const handleSendMessage = (content: string) => {
  if (!activeChat.value) return;
  sending.value = true;

  setTimeout(() => {
    const tempMessage = {
      id: Date.now(),
      content,
      sentAt: new Date().toISOString(),
      isOwn: true,
      senderId: currentUserId,
      conversationId: activeChat.value.id,
      isRead: false
    };

    // 放入当前聊天窗口
    currentMessages.value.push(tempMessage);

    // 同步更新侧边栏的最后一条消息预览
    const targetChat = chats.value.find(c => c.id === activeChat.value.id);
    if (targetChat) {
      targetChat.lastMessageContent = content;
      targetChat.lastMessageTime = tempMessage.sentAt;
    }

    sending.value = false;
  }, 300); // 模拟 300ms 的发送延迟
};

// 模拟发送带文件的消息
const handleSendFiles = (content: string, files: File[]) => {
  if (!activeChat.value) return;
  sending.value = true;

  setTimeout(() => {
    // 模拟上传文件，生成临时 URL
    const attachments = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file), // 实际项目中应上传到服务器获取真实 URL
    }));

    const tempMessage = {
      id: Date.now(),
      content,
      sentAt: new Date().toISOString(),
      isOwn: true,
      senderId: currentUserId,
      conversationId: activeChat.value.id,
      isRead: false,
      attachments,
    };

    // 放入当前聊天窗口
    currentMessages.value.push(tempMessage);

    // 同步更新侧边栏的最后一条消息预览
    const targetChat = chats.value.find(c => c.id === activeChat.value.id);
    if (targetChat) {
      targetChat.lastMessageContent = files.length > 0 
        ? `📎 ${files[0].name}${files.length > 1 ? ` and ${files.length - 1} more` : ''}`
        : content;
      targetChat.lastMessageTime = tempMessage.sentAt;
    }

    sending.value = false;
  }, 500); // 模拟 500ms 的发送延迟（文件上传稍慢）
};

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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>