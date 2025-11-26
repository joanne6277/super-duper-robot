import type { SearchColumn } from '../types'; // 引入剛剛定義的型別

export const tocSections = [
  { id: 'contract-target', label: '合約標的' },
  { id: 'registration-info', label: '登記資訊' },
  { id: 'basic-info', label: '基本資訊' },
  { id: 'financial-info', label: '財務資訊' },
  { id: 'ip-info', label: '智財權' },
  { id: 'other-info', label: '其他資訊' },
];

export const defaultSearchColumns: SearchColumn[] = [
  // ...
];
