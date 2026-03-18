<template>
  <article
    class="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300 flex flex-col h-full hover:shadow-lg"
  >
    <figure class="p-4 bg-white relative">
      <div
        v-if="imageError"
        class="w-full aspect-video rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 mb-2 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-[10px] font-medium tracking-wider uppercase">Image Not Available</span>
      </div>

      <img
        v-else
        :src="data.avatar"
        :alt="data.name"
        @error="handleImageError"
        class="w-full aspect-video object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
        loading="lazy"
      />
    </figure>

    <div class="px-4 pb-4 flex flex-col flex-1">
      <header>
        <h3
          class="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors"
        >
          {{ data.name }}
        </h3>
      </header>
      <p class="text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-1">{{ data.description }}</p>

      <footer class="pt-6 border-t border-slate-100 flex items-center justify-between">
        <ul
          class="flex -space-x-2"
          :aria-label="`${data.name} team members`"
        >
          <li
            v-for="(avatar, idx) in data.topDoctorAvatars?.slice(0, 5) || []"
            :key="idx"
            class="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm hover:z-10 transition-all cursor-pointer bg-slate-100"
          >
            <img
              :src="avatar"
              alt=""
              @error="(e) => handleAvatarError(e, idx)"
              class="w-full h-full object-cover"
            />
          </li>
          <li
            v-if="data.extraDoctorCount > 5"
            class="flex items-center"
          >
            <small class="text-[11px] font-bold text-slate-800 ml-2">
              + {{ data.extraDoctorCount - 5 }} others
            </small>
          </li>
        </ul>

        <WnButton
          type="primary"
          size="small"
          @click="$emit('view', data)"
        >
          See Detail
        </WnButton>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Department } from '@/types/api/department';

defineOptions({ name: 'DepartmentCard' });

const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};

const handleAvatarError = (e: Event, idx: number) => {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = `https://ui-avatars.com/api/?name=${idx}&background=random`;
  }
};

defineProps<{
  data: Department;
}>();

defineEmits<{
  (e: 'view', data: Department): void;
}>();
</script>
