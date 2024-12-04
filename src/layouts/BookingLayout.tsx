import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function BookingLayout() {
  const navigate = useNavigate();
  const { signOut } = useSupabase();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="relative">
        {/* Header */}
        <div className="border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/" 
                  className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Overview
                </Link>
                <span className="text-gray-700 dark:text-gray-300">|</span>
                <span className="text-gray-700 dark:text-gray-300">marian</span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
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