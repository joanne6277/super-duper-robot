import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, FileText, User as UserIcon, Bell, LogOut } from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  cartItemCount: number;
  currentUser: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isSidebarCollapsed,
  toggleSidebar,
  showCart,
  setShowCart,
  cartItemCount,
  currentUser,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="shrink-0 bg-white shadow-md z-30 relative">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none transition-colors"
            title={isSidebarCollapsed ? "展開側邊欄" : "收合側邊欄"}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            <Link to="/search-contract">合約管理系統</Link>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCart(!showCart)}
            className={`relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors ${showCart ? 'bg-indigo-50 text-indigo-600' : ''}`}
            title="批次清單"
          >
            <FileText className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{currentUser?.name || '使用者'}</p>
                  <p className="text-sm text-gray-500">{currentUser?.department || '未分配部門'}</p>
                </div>
                <Link
                  to="/notification-settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Bell className="w-4 h-4 mr-3 text-gray-400" />
                  通知設定
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  登出
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;