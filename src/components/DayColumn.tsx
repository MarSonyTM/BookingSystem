import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const bookedSlots = timeSlots.filter(slot => slot.isBooked).length;
  const availableSlots = timeSlots.length - bookedSlots;

  return (
    <div className="flex-1 min-w-[280px] md:min-w-[320px] backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl overflow-hidden transition-all transform hover:scale-[1.01] border border-gray-200/50 dark:border-gray-700/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-gray-700/30 border-b border-gray-200/50 dark:border-gray-700/50 transition-colors group sticky top-0 z-10"
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
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'
        } overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}
      >
        <div className="space-y-3 p-4 bg-white/30 dark:bg-gray-800/30">
          {timeSlots.map((slot) => (
            <TimeSlot
              key={slot.time}
              slot={slot}
              onBook={() => onBook(slot.time)}
              onCancel={() => onCancel(slot.time)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}