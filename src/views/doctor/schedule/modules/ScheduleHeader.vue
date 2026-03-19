<template>
  <div class="flex items-center justify-between shrink-0 p-6">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold text-foreground ">{{ displayTitle }}</h1>
      <div class="flex items-center bg-background rounded-lg overflow-hidden divide-x divide-white">
        <WnIconButton
          v-for="btn in navigateButtons"
          :key="btn.direction"
          :icon="btn.icon"
          :size="24"
          @click="$emit('navigate', btn.direction)"
          class="border-none"
        />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <WnTabSwitch
        :model-value="modelValue"
        :options="viewOptions"
        type="status"
        @update:model-value="(value: string | number) => $emit('update:modelValue', value as string)"
      />

      <ElSelect
        :model-value="selectedAgenda"
        :placeholder="t('doctorSchedule.allAgenda')"
        class="w-36"
        @update:model-value="$emit('update:selectedAgenda', $event)"
      >
        <ElOption
          :label="t('doctorSchedule.allAgenda')"
          value=""
        />
        <ElOption
          :label="t('doctorSchedule.checkUp')"
          value="checkup"
        />
        <ElOption
          :label="t('doctorSchedule.surgery')"
          value="surgery"
        />
        <ElOption
          :label="t('doctorSchedule.consultation')"
          value="consultation"
        />
      </ElSelect>

      <WnButton
        type="primary"
        @click="$emit('add')"
      >
        {{ t('doctorSchedule.addSchedule') }}
      </WnButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import WnIconButton from '@/components/core/widget/Wn-icon-button/index.vue';
import WnButton from '@/components/core/base/Wn-button/index.vue';
import WnTabSwitch from '@/components/core/widget/Wn-tab-switch/index.vue';

defineOptions({ name: 'ScheduleHeader' });

const { t } = useI18n();

const props = defineProps<{
  modelValue: string;
  currentDate: Date;
  selectedAgenda: string;
  weekDaysData?: { fullDate: Date }[];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:selectedAgenda', value: string): void;
  (e: 'navigate', direction: number): void;
  (e: 'today'): void;
  (e: 'add'): void;
}>();

const viewOptions = computed(() => [
  { label: t('doctorSchedule.day'), value: 'Day' },
  { label: t('doctorSchedule.week'), value: 'Week' },
  { label: t('doctorSchedule.month'), value: 'Month' },
]);

const navigateButtons = [
  { direction: -1, icon: 'ri:arrow-left-s-line' },
  { direction: 1, icon: 'ri:arrow-right-s-line' },
];

const displayTitle = computed(() => {
  if (props.modelValue === 'Month') {
    return props.currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  } else if (props.modelValue === 'Week' && props.weekDaysData?.length) {
    const start = props.weekDaysData[0].fullDate;
    const end = props.weekDaysData[6].fullDate;
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  } else {
    // 🚀 核心修复：为 Day 视图返回具体的日期，例如 "July 1, 2028"
    return props.currentDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
});
</script>
