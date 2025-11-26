import React from 'react';
import { Users, ChevronDown, Settings } from 'lucide-react';
import type { User } from '../types'; // 確保 src/types/index.ts 存在

interface SidebarProps {
  isSidebarCollapsed: boolean;
  expandedNavs: string[];
  toggleNav: (navName: string) => void;
  currentPage: string;
  onNavigate: (pageId: string) => void;
  currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarCollapsed,
  expandedNavs,
  toggleNav,
  currentPage,
  onNavigate,
  currentUser
}) => {
  // 輔助函式：判斷按鈕是否啟用 (樣式)
  const getButtonClass = (pageId: string) => 
    `block w-full text-left pl-12 pr-4 py-2 hover:bg-gray-700 transition-colors ${
      currentPage === pageId ? 'bg-indigo-600 text-white' : ''
    }`;

  // 輔助函式：處理導航點擊
  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
  };

  return (
    <aside 
      className={`shrink-0 bg-gray-800 text-gray-300 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <nav className="flex-1 mt-4">
        {/* 學發部選單區塊 */}
        <div>
          <button 
            onClick={() => toggleNav('學發部')} 
            className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors focus:outline-none"
            title={isSidebarCollapsed ? "學發部" : ""}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5"/>
              {!isSidebarCollapsed && <span className="ml-4">學發部</span>}
            </div>
            {!isSidebarCollapsed && (
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedNavs.includes('學發部') ? 'rotate-180' : ''}`} />
            )}
          </button>
          
          {/* 子選單 */}
          {expandedNavs.includes('學發部') && !isSidebarCollapsed && (
            <div className="bg-gray-900 bg-opacity-50 animate-in fade-in slide-in-from-top-1 duration-200">
              <button 
                onClick={() => handleNavClick('search-contract')} 
                className={getButtonClass('search-contract')}
              >
                搜尋合約
              </button>
              <button 
                onClick={() => handleNavClick('create-contract')} 
                className={getButtonClass('create-contract')}
              >
                新增/維護合約
              </button>
              <button 
                onClick={() => handleNavClick('template-management')} 
                className={getButtonClass('template-management')}
              >
                範本管理
              </button>
              
              {/* 權限控制：只有擁有學發部參數權限的人才看得到 */}
              {currentUser?.permissions.maintainParams === '學發部' && (
                <button 
                  onClick={() => handleNavClick('xuefa-params')} 
                  className={getButtonClass('xuefa-params')}
                >
                  參數設定
                </button>
              )}
            </div>
          )}
        </div>

        {/* 圖服部選單區塊 */}
        <div>
          <button 
            onClick={() => toggleNav('圖服部')} 
            className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors focus:outline-none"
            title={isSidebarCollapsed ? "圖服部" : ""}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5"/>
              {!isSidebarCollapsed && <span className="ml-4">圖服部</span>}
            </div>
            {!isSidebarCollapsed && (
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedNavs.includes('圖服部') ? 'rotate-180' : ''}`} />
            )}
          </button>
          
          {expandedNavs.includes('圖服部') && !isSidebarCollapsed && (
            <div className="bg-gray-900 bg-opacity-50 animate-in fade-in slide-in-from-top-1 duration-200">
              <button className="block w-full text-left pl-12 pr-4 py-2 hover:bg-gray-700 transition-colors text-gray-500 cursor-not-allowed">
                搜尋合約 (未開放)
              </button>
              <button className="block w-full text-left pl-12 pr-4 py-2 hover:bg-gray-700 transition-colors text-gray-500 cursor-not-allowed">
                新增/維護合約 (未開放)
              </button>
              <button className="block w-full text-left pl-12 pr-4 py-2 hover:bg-gray-700 transition-colors text-gray-500 cursor-not-allowed">
                範本管理 (未開放)
              </button>
              
              {/* 權限控制：只有擁有圖服部參數權限的人才看得到 */}
              {currentUser?.permissions.maintainParams === '圖服部' && (
                <button 
                  onClick={() => handleNavClick('tufu-params')} 
                  className={getButtonClass('tufu-params')}
                >
                  參數設定
                </button>
              )}
            </div>
          )}
        </div>

        {/* 權限管理 (Admin Only) */}
        {currentUser?.permissions.adminOnly && (
          <button 
            onClick={() => handleNavClick('permission-management')} 
            className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors focus:outline-none ${
              currentPage === 'permission-management' ? 'bg-indigo-600 text-white' : ''
            }`}
            title={isSidebarCollapsed ? "權限管理" : ""}
          >
            <Settings className="w-5 h-5" />
            {!isSidebarCollapsed && <span className="ml-4">權限管理</span>}
          </button>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;