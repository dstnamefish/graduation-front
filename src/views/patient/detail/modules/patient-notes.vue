<script setup lang="ts">
import type { PatientNote } from '@/types/api/patient';

defineOptions({ name: 'PatientDetailNotes' });

defineProps<{
  notes?: PatientNote[];
}>();
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-xl font-bold text-title">Patient Notes</h3>
      <span class="text-sm text-muted cursor-pointer hover:text-body transition-colors">
        View All
      </span>
    </div>

    <div
      v-if="notes && notes.length > 0"
      class="flex gap-4 overflow-x-auto no-scrollbar pb-2 flex-1 pt-1"
    >
      <div
        v-for="(note, index) in notes"
        :key="index"
        class="bg-card rounded-xl p-5 flex flex-col shrink-0 w-[calc((100%-2rem)/3)] min-w-[200px]"
      >
        <span class="text-xs text-muted mb-3">{{ note.createdTime }}</span>
        <h4 class=" font-bold text-title mb-2.5 line-clamp-1">
          {{ note.title }}
        </h4>
        <p class="text-[13px] text-muted leading-relaxed line-clamp-3">
          {{ note.content }}
        </p>
      </div>
    </div>
    <div
      v-else
      class="flex-1 flex items-center justify-center text-muted text-sm bg-surface border border-border rounded-xl min-h-[120px]"
    >
      No notes available
    </div>
  </div>
</template>
