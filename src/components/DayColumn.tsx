import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import TimeSlot from './TimeSlot';
import { TimeSlot as TimeSlotType } from '../types/booking';

interface DayColumnProps {
  date: Date;
  dayName: string;
  dayDate: string;
  timeSlots: TimeSlotType[];
  onBook: (time: string) => void;
  onCancel: (time: string) => void;
}

export default function DayColumn({
  dayName,
  dayDate,
  timeSlots,
  onBook,
  onCancel,
}: DayColumnProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const bookedSlots = timeSlots.filter(slot => slot.isBooked).length;
  const availableSlots = timeSlots.length - bookedSlots;

  return (
    <div className="flex-1 min-w-[280px] md:min-w-[320px] backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl overflow-hidden transition-all transform hover:scale-[1.02] border border-gray-200/50 dark:border-gray-700/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 bg-gradient-to-r from-transparent to-white/50 dark:to-gray-700/50 border-b border-gray-200/50 dark:border-gray-700/50 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {dayName}
              </h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{dayDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {availableSlots} available
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {bookedSlots} booked
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="space-y-3 p-4 bg-white/30 dark:bg-gray-800/30 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {timeSlots.map((slot) => (
            <TimeSlot
              key={slot.time}
              slot={slot}
              onBook={() => onBook(slot.time)}
              onCancel={() => onCancel(slot.time)}
            />
          ))}
        </div>
      )}
    </div>
  );
}