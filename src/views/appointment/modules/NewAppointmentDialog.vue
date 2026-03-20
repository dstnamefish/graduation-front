<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { fetchPage as fetchPatients } from '@/api/patient'
import { fetchList as fetchDepartments } from '@/api/department'
import { getDoctorPage as fetchDoctors } from '@/api/doctor'
import { create as createAppointment } from '@/api/appointment'
import WnForm from '@/components/core/forms/Wn-form/index.vue'
import type { FormItem } from '@/components/core/forms/Wn-form/index.vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible', 'success'])

const computedVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const wnFormRef = ref<InstanceType<typeof WnForm>>()
const submitting = ref(false)

const formData = reactive<Record<string, any>>({
  patientId: '',
  departmentId: '',
  doctorId: '',
  appointmentDate: '',
  timeSlot: '',
  description: ''
})

const loadingPatients = ref(false)
const loadingDoctors = ref(false)

const patientOptions = ref<{ label: string; value: number; detail: string }[]>([])
const departmentOptions = ref<{ label: string; value: number }[]>([])
const doctorOptions = ref<{ label: string; value: number }[]>([])

const initDepartments = async () => {
  try {
    const res = await fetchDepartments({ status: 1 })
    departmentOptions.value = res.map(dept => ({
      label: dept.name,
      value: dept.id
    }))
  } catch (error) {
    console.error('Failed to load departments:', error)
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    resetForm()
    initDepartments()
    nextTick(() => {
      wnFormRef.value?.clearValidate()
    })
  }
})

const close = () => {
  computedVisible.value = false
}

const searchPatient = async (query: string) => {
  if (query) {
    loadingPatients.value = true
    try {
      const res = await fetchPatients({ query, page: 1, size: 50 })
      patientOptions.value = res.records.map((p: any) => ({
        label: p.name,
        value: p.id,
        detail: p.patientNo || ''
      }))
    } catch (error) {
      console.error('Search patient error', error)
      patientOptions.value = []
    } finally {
      loadingPatients.value = false
    }
  } else {
    patientOptions.value = []
  }
}

const handleDeptChange = async (val: number | '') => {
  formData.doctorId = ''
  doctorOptions.value = []

  if (val !== '') {
    loadingDoctors.value = true
    try {
      const res = await fetchDoctors({ departmentId: val as number, status: 1, page: 1, size: 50 })
      doctorOptions.value = res.records.map((doc: any) => ({
        label: doc.name,
        value: doc.id
      }))
    } catch (error) {
      console.error('Load doctor error', error)
    } finally {
      loadingDoctors.value = false
    }
  }
}

const resetForm = () => {
  formData.patientId = ''
  formData.departmentId = ''
  formData.doctorId = ''
  formData.appointmentDate = ''
  formData.timeSlot = ''
  formData.description = ''
  patientOptions.value = []
  doctorOptions.value = []
  wnFormRef.value?.clearValidate()
}

const handleSubmit = async () => {
  const valid = await wnFormRef.value?.validate()
  if (!valid) return

  submitting.value = true
  try {
    await createAppointment({
      patientId: formData.patientId as number,
      doctorId: formData.doctorId as number,
      departmentId: formData.departmentId as number,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.timeSlot,
      remark: formData.description
    })
    ElMessage.success('预约成功')
    computedVisible.value = false
    emit('success')
  } catch (error) {
    console.error('Submit error:', error)
  } finally {
    submitting.value = false
  }
}

const formItems = computed<FormItem[]>(() => [
  {
    key: 'patientId',
    label: '选择患者',
    type: 'select',
    span: 24,
    rules: [{ required: true, message: '请选择患者', trigger: 'change' }],
    props: {
      filterable: true,
      remote: true,
      reserveKeyword: true,
      placeholder: '请输入姓名 / 病历号检索患者',
      remoteMethod: searchPatient,
      loading: loadingPatients.value,
      options: patientOptions.value,
      class: 'is-filterable-select'
    }
  },
  {
    key: 'departmentId',
    label: '就诊科室',
    type: 'select',
    span: 12,
    rules: [{ required: true, message: '请选择就诊科室', trigger: 'change' }],
    props: {
      placeholder: '请选择科室',
      options: departmentOptions.value,
      onChange: handleDeptChange,
      fitInputWidth: true
    }
  },
  {
    key: 'doctorId',
    label: '预约医生',
    type: 'select',
    span: 12,
    rules: [{ required: true, message: '请选择预约医生', trigger: 'change' }],
    props: {
      placeholder: '请选择医生',
      disabled: !formData.departmentId,
      loading: loadingDoctors.value,
      options: doctorOptions.value,
      fitInputWidth: true
    }
  },
  {
    key: 'appointmentDate',
    label: '预约日期',
    type: 'shadcn-date',
    span: 12,
    rules: [{ required: true, message: '请选择预约日期', trigger: 'change' }],
    props: {
      placeholder: '请选择日期',
      placement: 'left',
      fitInputWidth: true,
      disablePastDates: true
    }
  },
  {
    key: 'timeSlot',
    label: '就诊时段',
    type: 'select',
    span: 12,
    rules: [{ required: true, message: '请选择就诊时段', trigger: 'change' }],
    props: {
      placeholder: '请选择时段',
      options: [
        { label: '上午 (09:00)', value: '09:00:00' },
        { label: '下午 (14:00)', value: '14:00:00' }
      ],
      fitInputWidth: true
    }
  },
  {
    key: 'description',
    label: '病情描述/备注',
    type: 'input',
    span: 24,
    props: {
      type: 'textarea',
      rows: 3,
      placeholder: '请简要描述患者的病情或任何需要注意的备注信息'
    }
  }
])
</script>

<template>
  <el-dialog
    v-model="computedVisible"
    title="新建就诊预约"
    width="600px"
    :close-on-click-modal="false"
  >
    <WnForm
      ref="wnFormRef"
      v-model="formData"
      :items="formItems"
      :span="12"
      :gutter="24"
      label-position="top"
      :show-reset="false"
      :show-submit="false"
    />

    <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确认预约
        </el-button>
    </template>
  </el-dialog>
</template>