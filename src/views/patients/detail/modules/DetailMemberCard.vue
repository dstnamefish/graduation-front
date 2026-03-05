<template>
  <div
    class="bg-[#1b253b] rounded-3xl p-6 shadow-md text-white overflow-hidden relative w-full aspect-[1.6]"
  >
    <!-- Background Patterns -->
    <div
      class="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none flex flex-wrap content-start"
    >
      <WnSvgIcon
        icon="ri:hospital-fill"
        :size="48"
        class="m-2"
      />
      <WnSvgIcon
        icon="ri:hospital-fill"
        :size="48"
        class="m-2"
      />
      <WnSvgIcon
        icon="ri:hospital-fill"
        :size="48"
        class="m-2"
      />
      <WnSvgIcon
        icon="ri:hospital-fill"
        :size="48"
        class="m-2"
      />
    </div>

    <div class="relative z-10 flex flex-col justify-between h-full">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-white/20 flex flex-wrap gap-0.5 p-1">
          <div class="w-2 h-2 rounded bg-[#a5f3e4]"></div>
          <div class="w-2 h-2 rounded bg-white"></div>
          <div class="w-2 h-2 rounded bg-white"></div>
          <div class="w-2 h-2 rounded bg-[#a5f3e4]"></div>
        </div>
        <span class="font-bold tracking-wide">WellNest Hospital</span>
      </div>

      <div>
        <h3 class="text-xl font-black italic tracking-wider mb-8 opacity-90">BLUE MEMBER</h3>
        <div class="flex items-end justify-between">
          <div class="flex flex-col">
            <span class="text-[11px] font-bold tracking-widest opacity-80 uppercase">
              {{ name }} | {{ id }}
            </span>
          </div>
          <div class="flex flex-col text-right">
            <span class="text-[9px] font-bold opacity-70">Valid till 12/31</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';

defineOptions({ name: 'PatientDetailCard' });

defineProps<{
  name: string;
  id: string;
}>();
</script>
