import React, { useState } from 'react';
import type { User, ContractData } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// --- 引入頁面模組 (請確保這些檔案已建立於 src/pages/) ---
import SearchContract from './pages/SearchContract';
import CreateContract from './pages/CreateContract';
// 如果您還沒建立以下頁面，可以先暫時註解掉，或建立空白組件
// import ContractDetail from './pages/ContractDetail';
// import TemplateManagement from './pages/TemplateManagement';
// import PermissionManagement from './pages/PermissionManagement';
// import XuefaParams from './pages/XuefaParams';
// import TufuParams from './pages/TufuParams';
// import NotificationSettingsPage from './pages/NotificationSettings';

// --- 模擬資料 (實際開發建議移至 src/utils/mockData.ts) ---
const sampleData: ContractData[] = [
  { 
    id: '1', 
    contractTarget: { 
        publicationId: 'P12345', 
        type: '期刊', 
        title: '範例合約一', 
        volumeInfo: { format: 'volume_issue', volume: '10', issue: '2', year: '', month: '', description: '' },
    },
    registrationInfo: { issnIsbn: '978-0-12345-678-9', managementNo: 'MGT-001', departmentNo: 'DEP-A-001', departmentSubNo: 'SUB-01', newestNo: '是' },
    basicInfo: { partyARep: '王大明', partyBRep: '陳小華', contractParty: '甲方公司', contractStartDate: '2024-01-01', contractEndDate: '2025-12-31', autoRenewYears: '1', autoRenewTimes: '2', thereafter: '是', specialDateInfo: '', responsibleAS: '李四', responsibleCollection: '張三' },
    createdAt: new Date(),
    maintenanceHistory: []
  },
];

const sampleUsers: User[] = [
  { 
    id: 'user-1', name: '王大明 (Admin)', employeeId: '12345', email: 'admin@example.com', department: '學發部', 
    permissions: { adminOnly: true, createMaintain: true, searchExport: true, downloadTemplate: true, maintainTemplate: true, maintainParams: '學發部', landingPage: '學發部' }, 
    notificationSettings: { enabled: true, reportScopeMonths: 6, reportFrequency: 'monthly', selectedTeamMembers: ['user-1'] } 
  },
  // ... 其他使用者資料
];

const App: React.FC = () => {
  // --- 全域狀態 ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // 登入表單狀態
  const [loginId, setLoginId] = useState('');

  // UI 狀態
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('search-contract');
  const [expandedNavs, setExpandedNavs] = useState<string[]>(['學發部']);

  // 資料狀態 (提升到 App 層級以便跨頁面共享)
  const [contracts, setContracts] = useState<ContractData[]>(sampleData);
  const [shoppingCart, ] = useState<string[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  
  // 編輯/詳目用的暫存狀態
  const [currentContract, setCurrentContract] = useState<ContractData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // --- 登入邏輯 ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 簡單驗證：這裡使用 sampleUsers 進行比對，實際應呼叫 API
    const user = sampleUsers.find(u => u.employeeId === loginId); 
    // 為方便測試，這裡簡化密碼驗證邏輯
    if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setExpandedNavs([user.permissions.landingPage]);
        navigateTo('search-contract');
    } else {
        alert('登入失敗：找不到使用者 (測試帳號: 12345)');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginId('');
  };

  // --- 導覽邏輯 ---
  const navigateTo = (pageId: string) => {
    setCurrentPage(pageId);
    // 每次切換頁面時，重置某些狀態
    if (pageId === 'create-contract' && !isEditMode) {
      setCurrentContract(null);
    }
  };

  const toggleNav = (navName: string) => {
    setExpandedNavs(prev => prev.includes(navName) ? prev.filter(n => n !== navName) : [...prev, navName]);
  };

  // --- 頁面渲染邏輯 (Router) ---
  const renderContent = () => {
    switch (currentPage) {
      case 'search-contract':
        return (
          <SearchContract 
            contracts={contracts}
            onNavigateToDetail={(contract) => {
              setCurrentContract(contract);
              navigateTo('contract-detail');
            }}
          />
        );
      
      case 'create-contract':
        return (
          <CreateContract 
            existingContract={isEditMode ? currentContract : null}
            onSave={(newData) => {
              if (isEditMode) {
                setContracts(prev => prev.map(c => c.id === newData.id ? newData : c));
              } else {
                setContracts(prev => [...prev, newData]);
              }
              navigateTo('search-contract');
              setIsEditMode(false);
            }}
            onCancel={() => navigateTo('search-contract')}
          />
        );

      case 'contract-detail':
        // 請確保您有建立 ContractDetail.tsx，或在此直接放入簡單的顯示邏輯
        return currentContract ? (
          <div className="p-8 bg-white rounded-xl shadow">
             <h2 className="text-2xl font-bold mb-4">{currentContract.contractTarget.title}</h2>
             <p>管理部編號: {currentContract.registrationInfo.managementNo}</p>
             <div className="mt-6 flex gap-4">
               <button onClick={() => navigateTo('search-contract')} className="px-4 py-2 border rounded">返回</button>
               <button onClick={() => { setIsEditMode(true); navigateTo('create-contract'); }} className="px-4 py-2 bg-indigo-600 text-white rounded">編輯</button>
             </div>
          </div>
        ) : <div>查無資料</div>;

      // ... 其他頁面 (Template, Params...) 可在此擴充 case
      case 'template-management':
        return <div className="p-8 bg-white rounded-xl">範本管理頁面 (請將程式碼移至 src/pages/TemplateManagement.tsx)</div>;
      
      default:
        return <div className="p-8 text-center text-gray-500">頁面建置中... ({currentPage})</div>;
    }
  };

  // --- 主要渲染 ---
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">合約管理系統</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">帳號 (員工編號)</label>
              <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required placeholder="測試請輸入: 12345" />
            </div>
            {/* 密碼欄位省略或保留 */}
            <button type="submit" className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">登入</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Navbar 
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        showCart={showCart}
        setShowCart={setShowCart}
        cartItemCount={shoppingCart.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={navigateTo}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isSidebarCollapsed={isSidebarCollapsed}
          expandedNavs={expandedNavs}
          toggleNav={toggleNav}
          currentPage={currentPage}
          onNavigate={navigateTo}
          currentUser={currentUser}
        />

        <main className="flex-1 overflow-auto p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;