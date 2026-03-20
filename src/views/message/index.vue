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
import { ElMessage } from 'element-plus';
import ChatSidebar from './modules/ChatSidebar.vue';
import ChatArea from './modules/ChatArea.vue';
import {
  fetchConversationList,
  fetchMessages,
  createMessage
} from '@/api/message';
import type { Conversation, Message } from '@/types/api/message';
import { useUserStore } from '@/types/api/user.model';

defineOptions({ name: 'MessagesLayout' });

const userStore = useUserStore();
const isMobile = ref(false);
const showChatArea = ref(false);
const loading = ref(false);
const messagesLoading = ref(false);
const sending = ref(false);

const chats = ref<Conversation[]>([]);
const activeChat = ref<Conversation | null>(null);
const currentMessages = ref<Message[]>([]);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024;
};

const fetchConversations = async () => {
  loading.value = true;
  try {
    const res = await fetchConversationList();
    chats.value = res || [];
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    ElMessage.error('Failed to load conversations');
    chats.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSelectChat = async (chat: Conversation) => {
  activeChat.value = chat;
  if (isMobile.value) {
    showChatArea.value = true;
  }

  messagesLoading.value = true;
  try {
    const res = await fetchMessages(chat.id);
    currentMessages.value = (res || []).map((msg) => ({
      ...msg,
      isOwn: msg.senderId === userStore.info?.id
    }));

    const targetChat = chats.value.find(c => c.id === chat.id);
    if (targetChat) {
      targetChat.unreadCount = 0;
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    ElMessage.error('Failed to load messages');
    currentMessages.value = [];
  } finally {
    messagesLoading.value = false;
  }
};

const handleSendMessage = async (content: string) => {
  if (!activeChat.value) return;
  sending.value = true;

  try {
    await createMessage({
      content,
      conversationId: activeChat.value.id,
      type: 0
    });

    const res = await fetchMessages(activeChat.value.id);
    currentMessages.value = (res || []).map((msg) => ({
      ...msg,
      isOwn: msg.senderId === userStore.info?.id
    }));

    const targetChat = chats.value.find(c => c.id === activeChat.value!.id);
    if (targetChat) {
      targetChat.lastMessageContent = content;
      targetChat.lastMessageTime = new Date().toISOString();
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    ElMessage.error('Failed to send message');
  } finally {
    sending.value = false;
  }
};

const handleSendFiles = async (content: string, files: File[]) => {
  if (!activeChat.value) return;
  sending.value = true;

  try {
    const attachments = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    }));

    const messageContent = content || (files.length > 0 ? files[0].name : '');
    await createMessage({
      content: messageContent,
      conversationId: activeChat.value.id,
      type: 3
    });

    const res = await fetchMessages(activeChat.value.id);
    currentMessages.value = (res || []).map((msg) => ({
      ...msg,
      isOwn: msg.senderId === userStore.info?.id
    }));

    const targetChat = chats.value.find(c => c.id === activeChat.value!.id);
    if (targetChat) {
      targetChat.lastMessageContent = files.length > 0
        ? `📎 ${files[0].name}${files.length > 1 ? ` and ${files.length - 1} more` : ''}`
        : content;
      targetChat.lastMessageTime = new Date().toISOString();
    }
  } catch (error) {
    console.error('Failed to send files:', error);
    ElMessage.error('Failed to send files');
  } finally {
    sending.value = false;
  }
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
