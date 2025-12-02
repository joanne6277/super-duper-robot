import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, ChevronDown, Settings } from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  expandedNavs: string[];
  toggleNav: (navName: string) => void;
  currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarCollapsed,
  expandedNavs,
  toggleNav,
  currentUser
}) => {
  const location = useLocation();
  const currentPage = location.pathname;

  const getButtonClass = (path: string) => 
    `block w-full text-left pl-12 pr-4 py-2 hover:bg-gray-700 transition-colors ${
      currentPage === path ? 'bg-indigo-600 text-white' : ''
    }`;

  return (
    <aside 
      className={`shrink-0 bg-gray-800 text-gray-300 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <nav className="flex-1 mt-4">
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
          
          {expandedNavs.includes('學發部') && !isSidebarCollapsed && (
            <div className="bg-gray-900 bg-opacity-50 animate-in fade-in slide-in-from-top-1 duration-200">
              <Link to="/search-contract" className={getButtonClass('/search-contract')}>
                搜尋合約
              </Link>
              <Link to="/academic-contract" className={getButtonClass('/academic-contract')}>
                新增/維護合約
              </Link>
              <Link to="/template-management" className={getButtonClass('/template-management')}>
                範本管理
              </Link>
              
              {currentUser?.permissions.maintainParams === '學發部' && (
                <Link to="/xuefa-params" className={getButtonClass('/xuefa-params')}>
                  參數設定
                </Link>
              )}
            </div>
          )}
        </div>

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
              <span className="block w-full text-left pl-12 pr-4 py-2 text-gray-500 cursor-not-allowed">
                 搜尋合約 (未開放)
              </span>
              <Link to="/tufu-contract" className={getButtonClass('/tufu-contract')}>
                新增/維護合約
              </Link>
              <span className="block w-full text-left pl-12 pr-4 py-2 text-gray-500 cursor-not-allowed">
                範本管理 (未開放)
              </span>
              
              {currentUser?.permissions.maintainParams === '圖服部' && (
                <Link to="/tufu-params" className={getButtonClass('/tufu-params')}>
                  參數設定
                </Link>
              )}
            </div>
          )}
        </div>

        {currentUser?.permissions.adminOnly && (
          <Link 
            to="/permission-management"
            className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors focus:outline-none ${
              currentPage === '/permission-management' ? 'bg-indigo-600 text-white' : ''
            }`}
            title={isSidebarCollapsed ? "權限管理" : ""}
          >
            <Settings className="w-5 h-5" />
            {!isSidebarCollapsed && <span className="ml-4">權限管理</span>}
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;