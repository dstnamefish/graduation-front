<template>
  <div class="flex flex-col h-full bg-surface-sunken relative rounded-2xl">
    <template v-if="activeChat">
      <div
        class="h-20 px-4 md:px-8 border-b border-border flex items-center justify-between shrink-0"
      >
        <div class="flex items-center">
          <WnIconButton
            icon="solar:arrow-left-linear"
            :size="24"
            class="mr-4 -ml-2 lg:hidden"
            @click="$emit('back')"
          />

          <div
            class="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-border mr-4"
          >
            <img
              :src="activeChat.targetUserAvatar"
              class="w-full h-full object-cover"
              alt="avatar"
            />
          </div>
          <div>
            <h2 class="text-base font-bold text-title flex items-center gap-2">
              {{ activeChat.targetUserName }}
            </h2>
            <span class="text-xs text-muted font-medium">last seen recently</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <WnIconButton
            icon="ri:more-fill"
            :size="20"
            class="bg-surface!"
          />
        </div>
      </div>

      <ElScrollbar
        ref="messagesScrollRef"
        class="flex-1 min-h-0"
      >
        <div class="p-4 md:p-8 space-y-6 flex flex-col min-h-full">
          <div class="flex justify-center my-4">
            <span class="text-xs font-medium text-placeholder">Today, July 20</span>
          </div>

          <div
            v-if="messagesLoading"
            class="flex justify-center py-8"
          >
            <div
              class="animate-spin w-8 h-8 border-4 border-primary-300 border-t-primary-600 rounded-full"
            ></div>
          </div>

          <TransitionGroup
            name="msg"
            tag="div"
            class="space-y-6 flex flex-col justify-end flex-1"
          >
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="['flex w-full gap-3', msg.isOwn ? 'justify-end' : 'justify-start']"
            >
              <div
                v-if="!msg.isOwn"
                class="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-border mt-1 shadow-sm"
              >
                <img
                  :src="activeChat.targetUserAvatar"
                  class="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>

              <div :class="['flex flex-col', msg.isOwn ? 'items-end' : 'items-start']">
                <div
                  :class="[
                    'px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative',
                    'max-w-md wrap-break-word whitespace-pre-wrap',
                    msg.isOwn
                      ? 'bg-accent text-slate-800 rounded-tr-none'
                      : 'bg-surface text-slate-800 rounded-tl-none',
                  ]"
                >
                  <div
                    v-if="msg.attachments && msg.attachments.length > 0"
                    class="mb-2 space-y-2"
                  >
                    <div
                      v-for="(attachment, idx) in msg.attachments"
                      :key="idx"
                      class="rounded-lg overflow-hidden"
                    >
                      <template v-if="isImageFile(attachment)">
                        <img
                          :src="attachment.url"
                          :alt="attachment.name"
                          class="max-w-full max-h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          @click="previewImage(attachment.url)"
                        />
                      </template>
                      <template v-else>
                        <div
                          class="flex items-center gap-3 px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                          @click="downloadFile(attachment)"
                        >
                          <WnSvgIcon
                            :icon="getFileIcon(attachment.type)"
                            :size="24"
                            class="text-primary-500"
                          />
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-title truncate">
                              {{ attachment.name }}
                            </p>
                            <p class="text-xs text-muted">
                              {{ formatFileSize(attachment.size) }}
                            </p>
                          </div>
                          <WnSvgIcon
                            icon="ri:download-line"
                            :size="18"
                            class="text-muted"
                          />
                        </div>
                      </template>
                    </div>
                  </div>
                  <span v-if="msg.content">{{ msg.content }}</span>
                </div>

                <div class="mt-2 flex items-center gap-2 px-1">
                  <span class="text-xs text-placeholder font-medium">
                    {{ formatTime(msg.sentAt) }}
                  </span>
                  <WnSvgIcon
                    v-if="msg.isOwn"
                    icon="ri:check-double-line"
                    :size="14"
                    class="text-placeholder"
                  />
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </ElScrollbar>

      <div class="p-4 md:p-6 shrink-0">
        <div
          class="rounded-2xl p-3 flex flex-col gap-3 bg-surface border border-border"
          :class="{ 'border-primary-300 bg-primary-50/10': isDragOver }"
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <div class="flex items-center gap-2">
            <WnIconButton
              icon="ri:emotion-line"
              :size="20"
              class="bg-surface!"
              @click="showEmojiPicker = !showEmojiPicker"
            />

            <div class="relative flex-1">
              <textarea
                ref="textareaRef"
                v-model="newMessage"
                placeholder="Type a message..."
                rows="1"
                class="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-title font-medium resize-none overflow-y-auto max-h-48 scrollbar-thin"
                :style="{ height: textareaHeight }"
                @input="autoResize"
                @keydown.enter.exact="handleEnterKey"
                @keydown.tab="handleTabKey"
              />

              <div
                v-if="showEmojiPicker"
                class="absolute bottom-full -left-15 mb-6 bg-surface border border-border rounded-xl p-3 z-50"
              >
                <div class="grid grid-cols-8 gap-1">
                  <button
                    v-for="emoji in commonEmojis"
                    :key="emoji"
                    class="w-8 h-8 flex items-center justify-center text-xl hover:bg-slate-100 rounded-lg transition-colors"
                    @click="insertEmoji(emoji)"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>

              <div
                v-if="showMentions && filteredMentions.length > 0"
                class="absolute bottom-full left-0 mb-2 bg-surface border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto z-50"
              >
                <button
                  v-for="user in filteredMentions"
                  :key="user.id"
                  class="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-100 transition-colors text-left"
                  @click="insertMention(user)"
                >
                  <img
                    :src="user.avatar"
                    class="w-6 h-6 rounded-full"
                  />
                  <span class="text-sm font-medium">{{ user.name }}</span>
                </button>
              </div>
            </div>

            <WnIconButton
              icon="ri:attachment-2"
              :size="20"
              class="bg-surface!"
              @click="triggerFileInput"
            />

            <input
              ref="fileInputRef"
              type="file"
              multiple
              class="hidden"
              @change="handleFileSelect"
            />

            <WnButton
              type="primary"
              icon="ri:send-plane-fill"
              label="Send"
              :icon-size="18"
              :loading="sending"
              icon-position="right"
              @click="handleSend"
            />
          </div>

          <div
            v-if="attachedFiles.length > 0"
            class="flex flex-wrap gap-2 pt-2 border-t border-border"
          >
            <div
              v-for="(file, index) in attachedFiles"
              :key="index"
              class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm"
            >
              <WnSvgIcon
                icon="ri:file-line"
                :size="16"
                class="text-muted"
              />
              <span class="text-muted truncate max-w-32">{{ file.name }}</span>
              <button
                class="text-muted hover:text-danger-500 transition-colors"
                @click="removeFile(index)"
              >
                <WnSvgIcon
                  icon="ri:close-line"
                  :size="14"
                />
              </button>
            </div>
          </div>

          <div
            v-if="isDragOver"
            class="absolute inset-0 bg-primary-50/50 rounded-2xl flex items-center justify-center pointer-events-none"
          >
            <div class="text-center">
              <WnSvgIcon
                icon="ri:upload-cloud-line"
                :size="32"
                class="text-primary-500 mb-2"
              />
              <p class="text-sm font-medium text-primary-600">Drop files here</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center bg-surface p-8 h-full min-h-0"
    >
      <div
        class="w-48 h-48 bg-surface-sunken rounded-full flex items-center justify-center mb-8 shadow-sm border border-border"
      >
        <WnSvgIcon
          icon="solar:chat-round-line-bold-duotone"
          :size="80"
          class="text-primary-200"
        />
      </div>
      <h2 class="text-2xl font-bold text-title mb-4">Welcome to your Inbox</h2>
      <p class="text-muted max-w-sm text-center text-sm font-medium leading-relaxed">
        Select a conversation from the sidebar to start chatting.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { ElMessage } from 'element-plus';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import { ElScrollbar } from 'element-plus';

const props = defineProps<{
  activeChat: any;
  messages: any[];
  messagesLoading: boolean;
  sending: boolean;
}>();

const emit = defineEmits(['send', 'back', 'send-files']);

const newMessage = ref('');
const messagesScrollRef = ref<InstanceType<typeof ElScrollbar> | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const textareaHeight = ref('auto');

const showEmojiPicker = ref(false);
const showMentions = ref(false);
const isDragOver = ref(false);
const attachedFiles = ref<File[]>([]);

const commonEmojis = [
  '😀',
  '😂',
  '😊',
  '😍',
  '🥰',
  '😘',
  '😜',
  '😎',
  '🤩',
  '🥳',
  '😏',
  '😒',
  '😔',
  '😭',
  '😡',
  '🤯',
  '😳',
  '😱',
  '🤔',
  '🙄',
  '🥱',
  '😴',
  '😷',
  '🤒',
  '👍',
  '👎',
  '✌️',
  '🤞',
  '🤝',
  '🙏',
  '👏',
  '💪',
  '❤️',
  '💔',
  '✨',
  '🔥',
  '🎉',
  '💊',
  '🩺',
  '🩸',
];

const mentionableUsers = [
  { id: 1, name: 'Dr. John Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
  {
    id: 2,
    name: 'Dr. Emily Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
  },
  {
    id: 3,
    name: 'Dr. Michael Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
  },
];

const filteredMentions = computed(() => {
  const match = newMessage.value.match(/@(\w*)$/);
  if (!match) return [];
  const query = match[1].toLowerCase();
  return mentionableUsers.filter((u) => u.name.toLowerCase().includes(query));
});

const formatTime = (time?: string) => {
  if (!time) return '';
  return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const isImageFile = (attachment: { type?: string; name?: string }) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (attachment.type && imageTypes.includes(attachment.type)) return true;
  const ext = attachment.name?.split('.').pop()?.toLowerCase() || '';
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
};

const getFileIcon = (type?: string): string => {
  if (!type) return 'ri:file-line';
  if (type.includes('pdf')) return 'ri:file-pdf-line';
  if (type.includes('word') || type.includes('document')) return 'ri:file-word-line';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'ri:file-excel-line';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'ri:file-ppt-line';
  if (type.includes('video')) return 'ri:file-video-line';
  if (type.includes('audio')) return 'ri:file-music-line';
  if (type.includes('zip') || type.includes('rar') || type.includes('archive'))
    return 'ri:file-zip-line';
  if (type.includes('text')) return 'ri:file-text-line';
  return 'ri:file-line';
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const previewImage = (url: string) => {
  window.open(url, '_blank');
};

const downloadFile = (attachment: { url: string; name: string }) => {
  const link = document.createElement('a');
  link.href = attachment.url;
  link.download = attachment.name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px';
  }
  checkMentionTrigger();
};

const checkMentionTrigger = () => {
  const match = newMessage.value.match(/@(\w*)$/);
  showMentions.value = !!match;
};

const handleEnterKey = (e: KeyboardEvent) => {
  if (e.shiftKey) return;
  e.preventDefault();
  handleSend();
};

const handleTabKey = (e: KeyboardEvent) => {
  if (filteredMentions.value.length > 0) {
    e.preventDefault();
    insertMention(filteredMentions.value[0]);
  }
};

const insertEmoji = (emoji: string) => {
  if (textareaRef.value) {
    const start = textareaRef.value.selectionStart;
    const end = textareaRef.value.selectionEnd;
    newMessage.value = newMessage.value.slice(0, start) + emoji + newMessage.value.slice(end);
    nextTick(() => {
      textareaRef.value?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }
  showEmojiPicker.value = false;
};

const insertMention = (user: { id: number; name: string }) => {
  const match = newMessage.value.match(/@(\w*)$/);
  if (match) {
    const index = match.index!;
    newMessage.value =
      newMessage.value.slice(0, index) +
      `@${user.name.replace(/\s+/g, '')} ` +
      newMessage.value.slice(index + match[0].length);
  }
  showMentions.value = false;
};

const handleDragOver = (e: DragEvent) => {
  if (e.dataTransfer?.types.includes('Files')) {
    isDragOver.value = true;
  }
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  isDragOver.value = false;
  const files = Array.from(e.dataTransfer?.files || []);
  addFiles(files);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  addFiles(files);
  target.value = '';
};

const addFiles = (files: File[]) => {
  const validFiles = files.filter((f) => f.size <= 10 * 1024 * 1024);
  if (validFiles.length < files.length) {
    ElMessage.warning('Some files exceed 10MB limit');
  }
  attachedFiles.value.push(...validFiles);
};

const removeFile = (index: number) => {
  attachedFiles.value.splice(index, 1);
};

const handleSend = () => {
  if (!newMessage.value.trim() && attachedFiles.value.length === 0) {
    ElMessage.warning('Please enter a message or attach a file');
    return;
  }
  if (props.sending) return;

  if (attachedFiles.value.length > 0) {
    emit('send-files', newMessage.value, attachedFiles.value);
    attachedFiles.value = [];
  } else {
    emit('send', newMessage.value);
  }
  newMessage.value = '';
  textareaHeight.value = 'auto';
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesScrollRef.value) {
      const scrollEl = messagesScrollRef.value.$el?.querySelector('.el-scrollbar__wrap');
      if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  });
};

watch(
  () => props.messages.length,
  () => {
    scrollToBottom();
  },
);
</script>

<style scoped>
.msg-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
