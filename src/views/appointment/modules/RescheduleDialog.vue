<template>
  <ElDialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :show-close="false"
    width="520px"
    class="reschedule-dialog custom-rounded-dialog"
    align-center
    destroy-on-close
    @closed="handleClosed"
  >
    <div class="px-1 pt-2 pb-0">
      <!-- 极简加黑的大标题 -->
      <h2 class="text-[32px] font-extrabold text-black tracking-tight leading-none mb-3">
        修改预约时间
      </h2>
      <p class="text-[13px] text-gray-500 leading-relaxed mb-6">
        请根据您的需要选择新的就诊时间。变更预约不会产生额外费用，但请尽量提前通知。
      </p>

      <!-- 悬浮卡片感：当前预约信息 -->
      <div class="bg-[#f5f6f9] rounded-[16px] p-5 flex items-start gap-4 mb-8 border border-transparent">
        <div class="w-12 h-12 bg-slate-900 rounded-[12px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <WnSvgIcon icon="local-actions/calendar" :size="24" color="#fff" />
        </div>
        <div>
          <div class="text-[11px] font-bold tracking-wider text-gray-400 mb-1.5 uppercase">当前预约信息</div>
          <div class="text-[15px] font-bold text-slate-900 mb-1 leading-snug" v-if="appointment">
            {{ appointment.appointmentDate }} {{ formatAppointmentTime(appointment.appointmentTime) }}, {{ appointment.doctorName }}
          </div>
          <div class="text-[12px] text-gray-500" v-if="appointment">
            {{ appointment.treatmentName || '普通挂号' }} · 门诊楼 4 层 402 室
          </div>
        </div>
      </div>

      <!-- 表单组件 -->
      <div class="-mx-1 mb-2">
        <WnForm
          ref="wnFormRef"
          v-model="form"
          :items="formItems"
          :span="12"
          :gutter="16"
          label-position="top"
          :show-reset="false"
          :show-submit="false"
        />
      </div>

      <!-- 操作按钮底部 -->
      <div class="flex items-center justify-end gap-6 mt-4">
        <button
          class="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors px-2 cursor-pointer bg-transparent border-none appearance-none outline-none"
          @click="handleClose"
          :disabled="loading"
        >
          取消修改
        </button>
        <button
          class="bg-black text-white text-[13px] font-bold px-7 py-3 rounded-[10px] hover:bg-slate-800 transition-all border-none cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 shadow-md"
          @click="handleConfirm"
          :disabled="loading"
        >
          <span v-if="loading" class="el-icon is-loading mr-2 w-4 h-4 text-white"></span>
          确认变更预约
        </button>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage, ElDialog } from 'element-plus';
import type { Appointment } from '@/types/api/appointment';
import WnSvgIcon from '@/components/core/base/Wn-svg-icon/index.vue';
import WnForm from '@/components/core/forms/Wn-form/index.vue';
import type { FormItem } from '@/components/core/forms/Wn-form/index.vue';

const props = defineProps<{
  visible: boolean;
  appointment: Appointment | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', data: { date: string; time: string; remark: string }): void;
}>();

const form = reactive({
  date: '',
  time: '',
  remark: ''
});

// 解析并格式化预约时间
const formatAppointmentTime = (timeStr?: string) => {
  if (!timeStr) return '';
  // 假设原始时间可能是 HH:mm:ss 或 HH:mm
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return timeStr;
};

// 监听弹窗显示，自动填充或者置空
watch(
  () => props.visible,
  (val) => {
    if (val && props.appointment) {
      form.date = '';
      form.time = '';
      form.remark = '';
    }
  }
);

const handleClose = () => {
  emit('update:visible', false);
};

const handleClosed = () => {
  form.date = '';
  form.time = '';
  form.remark = '';
};

// 禁用过去的日期
const disablePastDates = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time.getTime() < today.getTime();
};

// 表单配置
const formItems = computed<FormItem[]>(() => [
  {
    key: 'date',
    label: '选择新日期',
    type: 'shadcn-date',
    span: 12,
    rules: [{ required: true, message: '请选择修改后的新日期', trigger: 'change' }],
    props: {
      placeholder: '03/28/2026',
      disabledDate: disablePastDates,
      valueFormat: 'YYYY-MM-DD',
      format: 'MM/DD/YYYY',
      placement: 'left',
      
    }
  },
  {
    key: 'time',
    label: '选择新时间',
    type: 'select',
    span: 12,
    rules: [{ required: true, message: '请选择修改后的新时间', trigger: 'change' }],
    props: {
      placeholder: '11:30 上午',
      options: [
        { label: '09:00 上午', value: '09:00:00' },
        { label: '10:00 上午', value: '10:00:00' },
        { label: '11:30 上午', value: '11:30:00' },
        { label: '14:00 下午', value: '14:00:00' },
        { label: '15:30 下午', value: '15:30:00' },
        { label: '16:30 下午', value: '16:30:00' }
      ],
    }
  },
  {
    key: 'remark',
    label: '备注 (选填)',
    type: 'input',
    span: 24,
    props: {
      type: 'textarea',
      rows: 3,
      placeholder: '请告知我们修改预约的原因或其他特殊需求...',
      resize: 'none',
      class: 'custom-heavy-textarea'
    }
  }
]);

const wnFormRef = ref<InstanceType<typeof WnForm>>();

const handleConfirm = async () => {
  const valid = await wnFormRef.value?.validate();
  if (!valid) return;

  emit('confirm', { date: form.date, time: form.time, remark: form.remark });
};
</script>