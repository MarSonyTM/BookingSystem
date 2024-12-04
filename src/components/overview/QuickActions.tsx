import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, History, Mail } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <button
        onClick={() => navigate('/book')}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <Calendar className="w-8 h-8 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Book Appointment</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Schedule your next session</p>
        </div>
      </button>

      {/* Add other quick action buttons */}
    </div>
  );
} 