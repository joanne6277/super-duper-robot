export interface User {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  department: string;
  permissions: {
    adminOnly: boolean;
    createMaintain: boolean;
    searchExport: boolean;
    downloadTemplate: boolean;
    maintainTemplate: boolean;
    maintainParams: string;
    landingPage: string;
  };
  notificationSettings: {
    enabled: boolean;
    reportScopeMonths: number;
    reportFrequency: string;
    selectedTeamMembers: string[];
  };
}

export interface ContractData {
  id: string;
  contractTarget: {
    publicationId: string;
    type: string;
    title: string;
    volumeInfo: {
      format: string;
      volume: string;
      issue: string;
      year: string;
      month: string;
      description: string;
    };
  };
  registrationInfo: {
    issnIsbn: string;
    managementNo: string;
    departmentNo: string;
    departmentSubNo: string;
    newestNo: string;
  };
  basicInfo: {
    partyARep: string;
    partyBRep: string;
    contractParty: string;
    contractStartDate: string;
    contractEndDate: string;
    autoRenewYears: string;
    autoRenewTimes: string;
    thereafter: string;
    specialDateInfo: string;
    responsibleAS: string;
    responsibleCollection: string;
  };
  createdAt: Date;
  maintenanceHistory: unknown[];
}

export interface SearchColumn {
  id: string;
  name: string;
  isDefault: boolean;
}
