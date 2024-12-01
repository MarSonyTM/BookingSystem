import React from 'react';
import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useSupabase } from '../contexts/SupabaseContext';

export default function AdminLayout() {
  const { user, signOut } = useSupabase();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="relative">
        <div className="border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 dark:text-gray-300">Admin:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={18} />
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