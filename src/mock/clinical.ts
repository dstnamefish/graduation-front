export interface ClinicalItem {
  id: string;
  name: string;
  type: 'disease' | 'medicine';
  description?: string;
  category?: string;
  price?: string;
}

export const getMockClinical = (): ClinicalItem[] => [
  {
    id: 'D001',
    name: '糖尿病 (Diabetes)',
    type: 'disease',
    description: '诊疗指南：重点监控血糖、饮食建议及并发症预防。',
    category: '内分泌科 (Endocrinology)',
  },
  {
    id: 'D002',
    name: '高血压 (Hypertension)',
    type: 'disease',
    description: '临床规范：日常血压监测，生活方式干预。',
    category: '心内科 (Cardiology)',
  },
  {
    id: 'D003',
    name: '发热 (Fever)',
    type: 'disease',
    description: '应急指南：成人及儿童发热初步诊断与分级。',
    category: '全科 (General Medicine)',
  },
  {
    id: 'M001',
    name: '阿司匹林 (Aspirin)',
    type: 'medicine',
    description: '库存：500盒 | 价格：¥25.00 | 禁忌：哮喘患者禁用。',
    category: '心血管药 (Cardiovascular)',
  },
  {
    id: 'M002',
    name: '胰岛素 (Insulin)',
    type: 'medicine',
    description: '库存：200支 | 价格：¥48.00 | 存储：冷藏。',
    category: '降糖药 (Antidiabetic)',
  },
];
