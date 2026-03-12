/**
 * 预约相关校验规则
 * 包含预约创建、编辑等表单的校验规则。
 */

import { Rule } from 'antd/es/form';

/**
 * 预约创建表单校验规则
 */
export const appointmentFormRules = {
  patientId: [
    {
      required: true,
      message: '患者ID不能为空'
    },
    {
      type: 'number',
      min: 1,
      message: '患者ID必须为正整数'
    }
  ],
  doctorId: [
    {
      required: true,
      message: '医生ID不能为空'
    },
    {
      type: 'number',
      min: 1,
      message: '医生ID必须为正整数'
    }
  ],
  departmentId: [
    {
      required: true,
      message: '科室ID不能为空'
    },
    {
      type: 'number',
      min: 1,
      message: '科室ID必须为正整数'
    }
  ],
  appointmentDate: [
    {
      required: true,
      message: '预约日期不能为空'
    },
    {
      validator: (_, value) => {
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            return Promise.reject(new Error('预约日期必须是未来日期'));
          }
        }
        return Promise.resolve();
      }
    }
  ],
  appointmentTime: [
    {
      required: true,
      message: '预约时间不能为空'
    }
  ],
  appointmentSource: [
    {
      type: 'number',
      min: 0,
      max: 4,
      message: '预约来源取值范围为0-4'
    }
  ],
  remark: [
    {
      max: 500,
      message: '备注信息不能超过500字符'
    }
  ]
};

/**
 * 预约快速添加表单校验规则
 */
export const appointmentAddFormRules = {
  patientId: [
    {
      required: true,
      message: '患者ID不能为空'
    }
  ],
  doctorId: [
    {
      required: true,
      message: '医生ID不能为空'
    }
  ],
  departmentId: [
    {
      required: true,
      message: '科室ID不能为空'
    }
  ],
  appointmentDate: [
    {
      required: true,
      message: '预约日期不能为空'
    }
  ],
  appointmentTime: [
    {
      required: true,
      message: '预约时间不能为空'
    }
  ]
};

/**
 * 日历视图查询参数校验规则
 */
export const agendaQueryRules = {
  startDate: [
    {
      required: true,
      message: '开始日期不能为空'
    }
  ],
  endDate: [
    {
      required: true,
      message: '结束日期不能为空'
    },
    {
      validator: (_, value, callback) => {
        if (value && callback) {
          const form = callback.form;
          const startDate = form.getFieldValue('startDate');
          if (startDate && new Date(value) < new Date(startDate)) {
            return Promise.reject(new Error('结束日期必须晚于开始日期'));
          }
        }
        return Promise.resolve();
      }
    }
  ]
};
