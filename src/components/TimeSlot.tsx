import React from 'react';
import { Clock, User } from 'lucide-react';
import { TimeSlot as TimeSlotType } from '../types/booking';
import { formatTime } from '../utils/dateUtils';

interface TimeSlotProps {
  slot: TimeSlotType;
  onBook: () => void;
  onCancel: () => void;
}

export default function TimeSlot({ slot, onBook, onCancel }: TimeSlotProps) {
  return (
    <div className={`
      rounded-xl p-4 transition-all duration-200 backdrop-blur-sm
      ${slot.isBooked 
        ? 'bg-indigo-50/70 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/50' 
        : 'bg-white/70 dark:bg-gray-700/70 border border-gray-200/50 dark:border-gray-600/50 hover:border-indigo-200/50 dark:hover:border-indigo-700/50'
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-xl 
            ${slot.isBooked 
              ? 'bg-indigo-100/70 dark:bg-indigo-800/70' 
              : 'bg-gray-100/70 dark:bg-gray-600/70'
            }
          `}>
            <Clock size={16} className={`
              ${slot.isBooked 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-300'
              }
            `} />
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatTime(slot.time)}
            </span>
            {slot.isBooked && (
              <div className="flex items-center mt-1 space-x-1">
                <User size={14} className="text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {slot.booking?.clientName}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {slot.isBooked ? (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={onBook}
            className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all shadow-sm hover:shadow-md"
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
}