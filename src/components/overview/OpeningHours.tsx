import React from 'react';
import { Clock } from 'lucide-react';

export default function OpeningHours() {
  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-indigo-500" />
        Opening Hours
      </h2>
      <div className="space-y-2">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Monday - Friday</span>
          <span>10:00 - 17:30</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Saturday - Sunday</span>
          <span>Closed</span>
        </div>
      </div>
    </div>
  );
} 