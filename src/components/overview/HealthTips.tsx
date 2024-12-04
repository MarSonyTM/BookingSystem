import React from 'react';
import { Heart } from 'lucide-react';

export default function HealthTips() {
  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Heart className="w-5 h-5 mr-2 text-indigo-500" />
        Health Tips
      </h2>
      <ul className="space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
          <span>Stay hydrated before and after your session</span>
        </li>
        {/* Add more health tips */}
      </ul>
    </div>
  );
} 