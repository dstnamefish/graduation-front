export interface ManagementItem {
  id: string;
  name: string;
  type: 'sop' | 'regulation';
  department?: string;
}

export const getMockManagement = (): ManagementItem[] => [
  {
    id: 'S001',
    name: '请假流程 (Leave Process)',
    type: 'sop',
    department: '人力资源部 (HR)',
  },
  {
    id: 'S002',
    name: '报销标准 (Reimbursement Standard)',
    type: 'regulation',
    department: '财务部 (Finance)',
  },
  {
    id: 'S003',
    name: '手卫生规范 (Hand Hygiene SOP)',
    type: 'sop',
    department: '院感办 (Infection Control)',
  },
  {
    id: 'S004',
    name: '应急预案：火灾 (Fire Emergency Plan)',
    type: 'regulation',
    department: '保卫科 (Security)',
  },
];
