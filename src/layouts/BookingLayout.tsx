import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useSupabase } from '../contexts/SupabaseContext';
import ThemeToggle from '../components/ThemeToggle';
import { LogOut, User, Menu, X } from 'lucide-react';

export default function BookingLayout() {
  const { theme, toggleTheme } = useTheme();
  const { signOut, user } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const userName = user?.user_metadata?.name || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="relative">
        <div className="border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {/* Desktop navigation */}
              <div className="hidden lg:flex items-center space-x-4">
                <Link 
                  to="/" 
                  className={`text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                    location.pathname === '/' ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  Overview
                </Link>
                <Link 
                  to="/book" 
                  className={`text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                    location.pathname === '/book' ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  Book Appointment
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <User size={18} className="text-indigo-500 dark:text-indigo-400" />
                  <span className="text-sm font-medium">
                    {userName}
                  </span>
                </div>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl">
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-6">
                  <User size={18} className="text-indigo-500 dark:text-indigo-400" />
                  <span className="text-sm font-medium">
                    {userName}
                  </span>
                </div>
                <Link 
                  to="/" 
                  className={`block px-4 py-2 rounded-lg ${
                    location.pathname === '/' 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Overview
                </Link>
                <Link 
                  to="/book" 
                  className={`block px-4 py-2 rounded-lg ${
                    location.pathname === '/book' 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-white"
            >
              <X size={24} />
            </button>
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
}