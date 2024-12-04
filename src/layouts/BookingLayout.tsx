import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useSupabase } from '../contexts/SupabaseContext';

export default function BookingLayout() {
  const { user, signOut } = useSupabase();
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
              <div className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <LayoutDashboard size={18} />
                  <span>Overview</span>
                </Link>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {format(currentTime, 'EEEE, MMMM d, yyyy')}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="font-mono">
                    {format(currentTime, 'HH:mm:ss')}
                  </span>
                </div>
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