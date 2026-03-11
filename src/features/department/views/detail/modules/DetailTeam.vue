<template>
  <div class="flex flex-col gap-6 w-full">
    <h3 class="text-2xl font-extrabold text-slate-400">Our Team</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="member in props.members"
        :key="member.id"
        class="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-sm"
      >
        <div class="w-16 h-16 rounded-2xl bg-primary-100 overflow-hidden mb-4 shadow-sm relative">
          <img
            :src="member.avatar"
            :alt="member.name"
            class="w-full h-full object-cover scale-110"
          />
        </div>
        <h4 class="text-[15px] font-extrabold text-slate-700 mb-1 leading-tight">
          {{ member.name }}
        </h4>
        <p class="text-xs font-semibold text-slate-400 mb-5">{{ member.role }}</p>

        <!-- Social Icons (using standard SVGs for mock) -->
        <div class="flex items-center gap-3 text-slate-300">
          <a
            href="#"
            class="hover:text-primary-500 transition-colors"
            aria-label="LinkedIn"
          >
            <WnSvgIcon
              icon="ri:linkedin-fill"
              :size="14"
            />
          </a>
          <a
            href="#"
            class="hover:text-primary-500 transition-colors"
            aria-label="X (Twitter)"
          >
            <WnSvgIcon
              icon="ri:twitter-x-line"
              :size="14"
            />
          </a>
          <a
            href="#"
            class="hover:text-primary-500 transition-colors"
            aria-label="Instagram"
          >
            <WnSvgIcon
              icon="ri:instagram-line"
              :size="14"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WnSvgIcon from '@/shared/ui/core/base/Wn-svg-icon/index.vue';
import type { TeamMemberItem } from '@/mock/departments';

defineOptions({ name: 'DetailTeam' });

const props = defineProps<{
  members: TeamMemberItem[];
}>();
</script>
