import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, History, Mail } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        onClick={() => navigate('/book')}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <Calendar className="w-7 h-7 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Book Appointment</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Schedule your next session</p>
        </div>
      </button>

      <button
        onClick={() => window.location.href = 'mailto:support@example.com'}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <Mail className="w-7 h-7 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Contact Us</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Questions or concerns?</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/history')}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all group sm:col-span-2 lg:col-span-1"
      >
        <div className="flex flex-col items-center text-center">
          <History className="w-7 h-7 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">View History</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">See past appointments</p>
        </div>
      </button>
    </div>
  );
}