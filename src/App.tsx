import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import type { User, ContractData } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// --- 引入頁面模組 ---
import TuFuContract from './pages/TuFuContract'; 
import AcademicContract from './pages/AcademicContract';

// 引入 Mock Data
import { sampleData, sampleUsers } from './utils/mockData';

const App: React.FC = () => {
  // --- 全域狀態 ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // 登入表單狀態
  const [loginId, setLoginId] = useState('');

  // UI 狀態
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedNavs, setExpandedNavs] = useState<string[]>(['學發部', '圖服部']);

  // 資料狀態
  const [contracts] = useState<ContractData[]>(sampleData);
  const [shoppingCart, ] = useState<string[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  
  // 編輯/詳目用的暫存狀態
  const [currentContract, setCurrentContract] = useState<ContractData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();

  // --- 登入邏輯 ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = sampleUsers.find(u => u.employeeId === loginId); 
    if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setExpandedNavs([user.permissions.landingPage]);
        navigate('/search-contract');
    } else {
        alert('登入失敗：找不到使用者 (測試帳號: 12345)');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginId('');
    navigate('/');
  };

  const toggleNav = (navName: string) => {
    setExpandedNavs(prev => prev.includes(navName) ? prev.filter(n => n !== navName) : [...prev, navName]);
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
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isSidebarCollapsed={isSidebarCollapsed}
          expandedNavs={expandedNavs}
          toggleNav={toggleNav}
          currentUser={currentUser}
        />

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Routes>
            <Route path="/tufu-contract" element={<TuFuContract />} />
            <Route path="/academic-contract" element={<AcademicContract />} />
            <Route path="/template-management" element={<div className="p-8 bg-white rounded-xl">範本管理頁面 (請將程式碼移至 src/pages/TemplateManagement.tsx)</div>} />
            <Route path="*" element={<div className="p-8 text-center text-gray-500">頁面建置中...</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;