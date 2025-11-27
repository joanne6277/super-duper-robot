import type { User, ContractData } from '../types';

export const sampleData: ContractData[] = [
  { 
    id: '1', 
    contractTarget: { 
        publicationId: 'P12345', 
        type: '期刊', 
        title: '範例合約一', 
        volumeInfo: '10',
        issnIsbn: '978-0-12345-678-9'
    },
    registrationInfo: { 
      managementNo: 'MGT-001', 
      departmentNo: 'DEP-A-001', 
      departmentSubNo: 'SUB-01', 
      collector: '張三',
      asResponsible: '李四',
      isCurrent: '是',
      contractVersion: [],
      nonAiritiVersion: ''
    },
    basicInfo: { 
      partyARep: '王大明', 
      partyBRep: '陳小華', 
      contractParty: ['甲方公司'],
      contractStartDate: '2024-01-01', 
      contractEndDate: '2025-12-31', 
      autoRenewYears: '1', 
      autoRenewFrequency: '2',
      thereafter: '是', 
      specialDateInfo: ''
    },
    rightsInfo: {
        authorizationFormMain: '非專',
        authorizationFormSub: 'L4',
        paymentType: '有償',
        isOpenAccess: '無'
    },
    scopeInfo: {
        thirdPartyPlatform_tws: '上_TWS',
        thirdPartyPlatform_consent: [],
        discoverySystem_selectionType: '單選',
        discoverySystem_futurePlatforms: '含將來合作平台',
        discoverySystem_includeCN: '含CN',
        discoverySystem_platforms: ['Google Scholar'],
        discoverySystem_consent: [],
        comparisonSystem: '否',
        nclClause_selectionType: '不上',
        nclClause_doNotList: [],
        nclClause_embargoRules: [],
        listingLocation: '全球用戶',
        status_al_cn: ''
    },
    otherClauses: {
        usageRightsWarranty: '保證+甲方賠償',
        userRightsProtection: '否',
        terminationClause: '否',
        forceMajeure: '否',
        confidentiality: '否',
        noOaOnOwnWebsite: '否',
        legalIssueHandling: '雙方',
        manuscriptAgreementMention: '否',
        authorizationCopy: '否',
        damages_hasClause: '否',
        damages_description: ''
    },
    remittanceInfo: [],
    terminationInfo: {
        isTerminated: '否',
        terminationReason: '',
        terminationDate: '',
        terminationMethod: ''
    },
    royaltyInfo: [],
    remarks: '',
    createdAt: new Date('2024-01-01'),
    maintenanceHistory: []
  },
  // 您可以在這裡新增更多範例資料...
];

export const sampleUsers: User[] = [
  { 
    id: 'user-1', 
    name: '王大明 (Admin)', 
    employeeId: '12345', 
    email: 'admin@example.com', 
    department: '學發部', 
    permissions: { 
      adminOnly: true, 
      createMaintain: true, 
      searchExport: true, 
      downloadTemplate: true, 
      maintainTemplate: true, 
      maintainParams: '學發部', 
      landingPage: '學發部' 
    }, 
    notificationSettings: { 
      enabled: true, 
      reportScopeMonths: 6, 
      reportFrequency: 'monthly', 
      selectedTeamMembers: ['user-1'] 
    } 
  },
  // ... 其他使用者資料
];