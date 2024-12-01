import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

export default function BookingLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[size:24px_24px] sm:bg-[size:32px_32px]" />
      <div className="relative">
        <div className="border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <div className="flex justify-between items-center py-3 sm:py-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Welcome,</span>
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  onClick={logout}
                  className="inline-flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm sm:text-base"
                >
                  <LogOut size={16} className="sm:hidden" />
                  <LogOut size={18} className="hidden sm:block" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}