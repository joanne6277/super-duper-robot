import type { SearchColumn } from '../types';

export const tocSections = [
    { id: 'contract-target', label: '合約標的' },
    { id: 'registration-info', label: '造冊資訊' },
    { id: 'termination-info', label: '解約' },
    { id: 'basic-info', label: '基本資料' },
    { id: 'rights-info', label: '權利內容' },
    { id: 'royalty-info', label: '權利金比例' },
    { id: 'scope-info', label: '授權範圍' },
    { id: 'other-clauses', label: '其他條款' },
    { id: 'remittance-info', label: '匯款資料' },
    { id: 'scan-file', label: '合約掃描檔' },
    { id: 'remarks', label: '備註' },
];

export const authorizationFormOptions = {
    '非專': ['L4', 'L4臺大方案一', 'L5-1', 'L5-1臺大方案二', 'L5', 'L5臺大方案三'],
    '專屬': ['L1', 'L3'],
    '獨家': ['L2'],
    '共出編輯': [],
    '共同出版': [],
    '亞東專屬': []
};

export const discoveryPlatforms = ['Google Scholar', 'NAVER Academic', 'Primo', 'EBSCO EDS', 'OCLC Discovery'];
export const embargoTargets = ['第三方平台', '國家圖書館', 'TOAJ'];
export const embargoPeriods = ['一年', '半年', '一期'];

export const defaultSearchColumns: SearchColumn[] = [
  { id: 'title', name: '刊名', isDefault: true },
  { id: 'managementNo', name: '管理編號', isDefault: true },
];