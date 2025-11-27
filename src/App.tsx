import React, { useState } from 'react';
import type { User, ContractData } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// --- 引入頁面模組 ---
import SearchContract from './pages/SearchContract';

import AcademicContract from './pages/AcademicContract';

// 引入 Mock Data
import { sampleData, sampleUsers } from './utils/mockData';

// 原本的 sampleData 和 sampleUsers 宣告已移除，改從 utils/mockData 引入

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

  // 資料狀態
  const [contracts] = useState<ContractData[]>(sampleData);
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
        // 這裡您可以選擇：
        // 1. 如果「學發部」合約是唯一的類型，直接換成 AcademicContract
        // 2. 或者保留 CreateContract 作為入口，裡面再選合約類型
        return <AcademicContract />; 

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